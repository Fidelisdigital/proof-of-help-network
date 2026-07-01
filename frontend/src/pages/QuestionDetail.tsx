import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { txSubmitAnswer, txVerifyAnswer, txAcceptAnswer, txDisputeAnswer, txStakeReputation, txRewardReputation, txPenaltyReputation, txSendPROOFH, txJoinTribe } from '../utils/transactions';
import { updateLocalCRED, getVoteCountsFromChain } from '../utils/state';

// Verify content matches onchain hash
async function verifyContentHash(content: string, extra: string, onchainHash: string): Promise<boolean> {
    if (!onchainHash || onchainHash.startsWith('hash_')) return false; // old format
    const encoder = new TextEncoder();
    const data = encoder.encode(content + extra);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computed = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return computed === onchainHash;
}
import { waitForTx } from '../utils/rpc';

export default function QuestionDetail() {
    const nav = useNavigate();
    const { id } = useParams();
    const { wallet, updateBalance, deductFee } = useWallet();
    const [question, setQuestion] = useState<any>(null);
    const [answers, setAnswers] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any>({});
    const [answerContent, setAnswerContent] = useState('');
    const [stakeAmount, setStakeAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [txHash, setTxHash] = useState('');
    const [success, setSuccess] = useState('');
    const [chainVotes, setChainVotes] = useState<Record<string, {helpful:number,accurate:number,disputed:number}>>({});
    const [contentVerified, setContentVerified] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const questions = JSON.parse(localStorage.getItem('phn_questions') || '[]');
        const q = questions.find((q: any) => q.id === id);
        setQuestion(q);
        const allAnswers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
        setAnswers(allAnswers.filter((a: any) => a.questionId === id));
        setProfiles(JSON.parse(localStorage.getItem('phn_profiles') || '{}'));
        // Fetch vote counts + verify content from chain
        const initialAnswers = JSON.parse(localStorage.getItem('phn_answers') || '[]')
            .filter((a: any) => a.questionId === id);
        initialAnswers.forEach(async (answer: any) => {
            try {
                const votes = await getVoteCountsFromChain(answer.id);
                setChainVotes(prev => ({ ...prev, [answer.id]: votes }));
                // Verify content hash
                const verified = await verifyContentHash(
                    answer.content, answer.authorAddress + answer.questionId, answer.contentHash
                );
                setContentVerified(prev => ({ ...prev, [answer.id]: verified }));
            } catch { /* fallback */ }
        });
        // Verify question content
        const allQs = JSON.parse(localStorage.getItem('phn_questions') || '[]');
        const qItem = allQs.find((qx: any) => qx.id === id);
        if (qItem?.contentHash && !qItem.contentHash.startsWith('hash_')) {
            verifyContentHash(qItem.title + qItem.content, qItem.authorAddress, qItem.contentHash)
                .then(v => setContentVerified(prev => ({ ...prev, [id!]: v })))
                .catch(() => {});
        }
    }, [id]);

    const refreshData = () => {
        const allAnswers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
        const filtered = allAnswers.filter((a: any) => a.questionId === id);
        setAnswers(filtered);
        setProfiles(JSON.parse(localStorage.getItem('phn_profiles') || '{}'));
        // Fetch vote counts from chain for each answer
        filtered.forEach(async (answer: any) => {
            try {
                const votes = await getVoteCountsFromChain(answer.id);
                setChainVotes(prev => ({ ...prev, [answer.id]: votes }));
            } catch { /* fallback to localStorage */ }
        });
    };

    const handleSubmitAnswer = async () => {
        if (!wallet.isConnected) { nav('/'); return; }
        if (!answerContent.trim()) { setError('Answer content is required'); return; }
        setError(''); setLoading(true);
        try {
            const hash = await txSubmitAnswer(
                wallet.address, id!, answerContent, stakeAmount,
                wallet.publicKey, wallet.privateKey
            );
            setTxHash(hash);
            await waitForTx(wallet.address, hash, 60000);
            deductFee(1000);
            // Fire stake_reputation as secondary tx (1000 PROOFH stake)
            try {
                const answerId = `a_${wallet.address.slice(0,8)}_${Date.now()}`;
                await txStakeReputation(wallet.address, answerId, 1000, wallet.publicKey, wallet.privateKey);
            } catch { /* non-blocking */ }
            setSuccess(`Answer submitted! TX: ${hash.slice(0, 16)}...`);
            setAnswerContent('');
            refreshData();
        } catch (err: any) {
            setError(err.message || 'Failed to submit answer');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (answerId: string, vote: 'helpful' | 'accurate' | 'misleading') => {
        if (!wallet.isConnected) return;
        setLoading(true);
        try {
            const hash = await txVerifyAnswer(
                wallet.address, answerId, vote,
                wallet.publicKey, wallet.privateKey
            );
            await waitForTx(wallet.address, hash, 60000);
            deductFee(1000);

            // Update local votes - only helpful/accurate give CRED
            const allAnswers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
            const idx = allAnswers.findIndex((a: any) => a.id === answerId);
            if (idx !== -1) {
                if (vote === 'helpful') allAnswers[idx].helpfulVotes = (allAnswers[idx].helpfulVotes || 0) + 1;
                else if (vote === 'accurate') allAnswers[idx].accurateVotes = (allAnswers[idx].accurateVotes || 0) + 1;
                // misleading: no CRED change, just record
                else allAnswers[idx].misleadingVotes = (allAnswers[idx].misleadingVotes || 0) + 1;
                localStorage.setItem('phn_answers', JSON.stringify(allAnswers));
            }
            // Update CRED for answer author (only helpful/accurate give +5)
            const answer = allAnswers[idx];
            if (answer && (vote === 'helpful' || vote === 'accurate')) {
                updateLocalCRED(answer.authorAddress);
                // Fire reward_reputation as secondary tx
                try {
                    await txRewardReputation(wallet.address, answer.authorAddress, 5, vote, wallet.publicKey, wallet.privateKey);
                } catch { /* non-blocking */ }
                setSuccess(`Verified as ${vote}! +5 CRED awarded to ${profiles[answer.authorAddress]?.username || 'answerer'}. TX: ${hash.slice(0, 16)}...`);
            } else {
                setSuccess(`Marked as ${vote}. TX: ${hash.slice(0, 16)}...`);
            }
            await updateBalance();
            refreshData();
        } catch (err: any) {
            setError(err.message || 'Failed to verify');
        } finally {
            setLoading(false);
        }
    };

    const handleDispute = async (answerId: string) => {
        if (!wallet.isConnected) return;
        setLoading(true);
        try {
            // Fire dispute_answer + penalty_reputation together
            const hash = await txDisputeAnswer(wallet.address, answerId, 'disputed_by_community', wallet.publicKey, wallet.privateKey);
            await waitForTx(wallet.address, hash, 60000);
            deductFee(1000);
            // Fire penalty_reputation as secondary tx
            const answer = JSON.parse(localStorage.getItem('phn_answers') || '[]').find((a: any) => a.id === answerId);
            if (answer) {
                try {
                    await txPenaltyReputation(wallet.address, answer.authorAddress, 5, 'disputed', wallet.publicKey, wallet.privateKey);
                } catch { /* non-blocking */ }
            }
            // Update local state
            const allAnswers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
            const idx = allAnswers.findIndex((a: any) => a.id === answerId);
            if (idx !== -1) { allAnswers[idx].isDisputed = true; localStorage.setItem('phn_answers', JSON.stringify(allAnswers)); }
            setSuccess('Disputed! TX: ' + hash.slice(0, 16) + '...');
            refreshData();
        } catch (err: any) { setError(err.message || 'Failed to dispute'); }
        setLoading(false);
    };

    const handleAccept = async (answerId: string) => {
        if (!wallet.isConnected) return;
        if (wallet.address !== question?.authorAddress) {
            setError('Only the question author can accept an answer');
            return;
        }
        setLoading(true);
        try {
            const hash = await txAcceptAnswer(
                wallet.address, id!, answerId,
                wallet.publicKey, wallet.privateKey
            );
            await waitForTx(wallet.address, hash, 60000);
            await updateBalance();

            // Update local state
            const allAnswers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
            const idx = allAnswers.findIndex((a: any) => a.id === answerId);
            if (idx !== -1) {
                allAnswers[idx].isAccepted = true;
                localStorage.setItem('phn_answers', JSON.stringify(allAnswers));
            }

            // No CRED for accept — CRED only from helpful/accurate votes

            // Update question
            const questions = JSON.parse(localStorage.getItem('phn_questions') || '[]');
            const qIdx = questions.findIndex((q: any) => q.id === id);
            if (qIdx !== -1) {
                questions[qIdx].acceptedAnswerId = answerId;
                localStorage.setItem('phn_questions', JSON.stringify(questions));
            }

            setSuccess(`Answer accepted! TX: ${hash.slice(0, 16)}...`);
            await updateBalance();
            refreshData();
        } catch (err: any) {
            setError(err.message || 'Failed to accept answer');
        } finally {
            setLoading(false);
        }
    };

    const timeAgo = (ts: number) => {
        const diff = Date.now() - ts;
        if (diff < 60000) return 'just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    };

    if (!question) return (
        <div style={{ background: '#060612', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#6B7280' }}>Question not found</div>
        </div>
    );

    const author = profiles[question.authorAddress];
    const isOwner = wallet.address === question.authorAddress;

    return (
        <div style={{ background: '#060612', minHeight: '100vh', fontFamily: 'Inter,sans-serif', color: '#F9FAFB' }}>
            {/* Navbar */}
            <nav style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 32px', background: 'rgba(6,6,18,0.95)', borderBottom: '1px solid rgba(99,102,241,0.15)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => nav('/feed')}>
                    <img src="/phn-logo.svg" alt="PHN" style={{ width: 28, height: 28 }} />
                    <div><div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: 1 }}>PHN</div><div style={{ fontSize: 9, color: '#4B5563', letterSpacing: 2 }}>PROOF OF HELP</div></div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                            {wallet.username?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 600 }}>{wallet.username} · {wallet.trustScore} CRED</span>
                    </div>
                    <button onClick={() => nav('/feed')} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #1F2937', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>
                        ← Feed
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 60px' }}>

                {/* Question */}
                <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: 36, marginBottom: 24 }}>
                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                                {author?.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif' }}>{author?.username || question.authorAddress.slice(0, 8)}</div>
                                <div style={{ fontSize: 12, color: '#6B7280' }}>{timeAgo(question.createdAt)} · {author?.reputationScore || 0} CRED</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.2)' }}>
                                {question.category}
                            </span>
                            {question.acceptedAnswerId && (
                                <span style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
                                    ✅ Answered
                                </span>
                            )}
                        </div>
                    </div>

                    <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, color: '#fff', marginBottom: 16, lineHeight: 1.3 }}>
                        {question.title}
                    </h1>
                    <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 20 }}>
                        {question.content}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {(question.tags || []).map((tag: string) => (
                            <span key={tag} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, color: '#6B7280', background: 'rgba(15,15,30,0.8)', border: '1px solid #1F2937' }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Success/Error */}
                {success && (
                    <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: 20, fontSize: 13, color: '#10B981' }}>
                        ✅ {success}
                    </div>
                )}
                {error && (
                    <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: 20, fontSize: 13, color: '#EF4444' }}>
                        ❌ {error}
                    </div>
                )}

                {/* Answers */}
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 16 }}>
                        {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                    </h2>

                    {answers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, marginBottom: 24 }}>
                            <div style={{ fontSize: 36, marginBottom: 12 }}>💡</div>
                            <div style={{ fontSize: 15, color: '#6B7280' }}>No answers yet. Be the first to help!</div>
                        </div>
                    ) : (
                        answers.map(answer => {
                            const answerAuthor = profiles[answer.authorAddress];
                            const isAccepted = answer.isAccepted || question.acceptedAnswerId === answer.id;
                            return (
                                <div key={answer.id} style={{
                                    background: isAccepted ? 'rgba(16,185,129,0.05)' : 'rgba(10,10,25,0.8)',
                                    border: `1px solid ${isAccepted ? 'rgba(16,185,129,0.3)' : '#1A1A2E'}`,
                                    borderRadius: 16, padding: '24px 28px', marginBottom: 16
                                }}>
                                    {/* Answer header */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>
                                                {answerAuthor?.username?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{answerAuthor?.username || answer.authorAddress.slice(0, 8)}</div>
                                                    {contentVerified[answer.id] === true && (
                                                        <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 999, background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>✓ verified</span>
                                                    )}
                                                    {contentVerified[answer.id] === false && answer.contentHash && !answer.contentHash.startsWith('hash_') && (
                                                        <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 999, background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>⚠️ tampered</span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#6B7280' }}>{answerAuthor?.reputationScore !== undefined ? answerAuthor.reputationScore : '...'} CRED · {timeAgo(answer.createdAt)}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            {answer.stakeAmount > 0 && (
                                                <div style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA' }}>
                                                    🎯 {answer.stakeAmount} CRED staked
                                                </div>
                                            )}
                                            {isAccepted && (
                                                <div style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10B981', fontWeight: 700 }}>
                                                    ✅ ACCEPTED
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Answer content */}
                                    <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 20 }}>
                                        {answer.content}
                                    </p>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                        {/* Verify buttons */}
                                        {wallet.address !== answer.authorAddress && (
                                            <>
                                                <button onClick={() => handleVerify(answer.id, 'helpful')} disabled={loading} style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                    👍 Helpful ({chainVotes[answer.id]?.helpful ?? answer.helpfulVotes ?? 0})
                                                </button>
                                                <button onClick={() => handleVerify(answer.id, 'accurate')} disabled={loading} style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                    🎯 Accurate ({chainVotes[answer.id]?.accurate ?? answer.accurateVotes ?? 0})
                                                </button>
                                                <button onClick={() => handleDispute(answer.id)} disabled={loading} style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                    ⚠️ Dispute ({answer.isDisputed ? 1 : 0})
                                                </button>
                
                                            </>
                                        )}

                                        {/* Accept button - only question owner */}
                                        {isOwner && !question.acceptedAnswerId && (
                                            <button onClick={() => handleAccept(answer.id)} disabled={loading} style={{ padding: '7px 16px', borderRadius: 8, background: loading ? 'rgba(107,114,128,0.2)' : 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10B981', fontSize: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginLeft: 'auto' }}>
                                                {loading ? '⏳ Confirming...' : '✅ Accept Answer'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Tribe Info — only for questions asked in a tribe */}
                {question.tribeId && (() => {
                    const tribes = JSON.parse(localStorage.getItem('phn_tribes') || '[]');
                    const tribe = tribes.find((t: any) => t.id === question.tribeId);
                    if (!tribe) return null;
                    const joined = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
                    const isJoined = (joined[wallet.address] || []).includes(question.tribeId) || tribe.creatorAddress === wallet.address;
                    const color = { Builders: '#6366F1', Writers: '#8B5CF6', Designers: '#EC4899', Crypto: '#F59E0B', Business: '#10B981', AI: '#06B6D4', Web3: '#A78BFA', General: '#9CA3AF' }[tribe.category as string] || '#6366F1';
                    return (
                        <div style={{ background: 'rgba(10,10,25,0.8)', border: `1px solid ${color}30`, borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                    🏘️
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 2 }}>POSTED IN TRIBE</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif' }}>{tribe.name}</div>
                                    <div style={{ fontSize: 12, color: '#6B7280' }}>👥 {tribe.memberCount || 1} members · {tribe.category}</div>
                                </div>
                            </div>
                            {isJoined ? (
                                <span style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 12, fontWeight: 700 }}>
                                    ✅ Member
                                </span>
                            ) : (
                                <button onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        const hash = await txJoinTribe(wallet.address, question.tribeId, wallet.publicKey, wallet.privateKey);
                                        await waitForTx(wallet.address, hash, 60000);
                                        const j = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
                                        if (!j[wallet.address]) j[wallet.address] = [];
                                        j[wallet.address].push(question.tribeId);
                                        localStorage.setItem('phn_joined_tribes', JSON.stringify(j));
                                        setSuccess('Joined tribe! TX: ' + hash.slice(0, 16) + '...');
                                    } catch(e: any) { setError(e.message); }
                                }} style={{ padding: '8px 20px', borderRadius: 10, background: `linear-gradient(135deg, ${color}, ${color}88)`, border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                    + Join Tribe
                                </button>
                            )}
                        </div>
                    );
                })()}

                {/* Submit Answer */}
                {!isOwner && (
                    <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: 32 }}>
                        <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 20 }}>
                            Your Answer
                        </h3>

                        <textarea
                            style={{ width: '100%', padding: '16px 18px', borderRadius: 12, background: 'rgba(6,6,18,0.8)', border: '1px solid #1F2937', color: '#F9FAFB', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none', resize: 'vertical', minHeight: 160, boxSizing: 'border-box', marginBottom: 20 }}
                            placeholder="Write your answer here. Be detailed and helpful..."
                            value={answerContent}
                            onChange={e => setAnswerContent(e.target.value)}
                            onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                            onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                        />



                        {/* Wallet info */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(6,6,18,0.8)', border: '1px solid #1F2937' }}>
                            <span style={{ fontSize: 13, color: '#6B7280' }}>Answering as <strong style={{ color: '#fff' }}>{wallet.username}</strong></span>
                            <span style={{ fontSize: 12, color: '#4B5563' }}>Fee: 1,000 PROOFH</span>
                        </div>

                        <button onClick={handleSubmitAnswer} disabled={loading} style={{
                            width: '100%', padding: '16px', borderRadius: 12,
                            background: loading ? '#1F2937' : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                            border: 'none', color: loading ? '#6B7280' : '#fff',
                            fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: 'Syne,sans-serif', boxShadow: loading ? 'none' : '0 0 30px rgba(99,102,241,0.3)'
                        }}>
                            {loading ? '⏳ Submitting to Canopy...' : '⛓️ Submit Answer Onchain →'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
