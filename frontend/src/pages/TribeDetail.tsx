import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { txJoinTribe } from '../utils/transactions';
import { getTribeMembersFromChain, hasJoinedTribeFromChain } from '../utils/state';
import { waitForTx } from '../utils/rpc';

const CATEGORY_COLORS: Record<string, string> = {
    Builders: '#6366F1', Writers: '#8B5CF6', Designers: '#EC4899',
    Crypto: '#F59E0B', Business: '#10B981', AI: '#06B6D4',
    Web3: '#A78BFA', General: '#9CA3AF'
};

const CATEGORY_ICONS: Record<string, string> = {
    Builders: '🔨', Writers: '✍️', Designers: '🎨',
    Crypto: '₿', Business: '💼', AI: '🤖', Web3: '🔗', General: '🏘️'
};

export default function TribeDetail() {
    const nav = useNavigate();
    const { id } = useParams();
    const { wallet, blockHeight, deductFee } = useWallet();
    const [tribe, setTribe] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [pinnedQuestion, setPinnedQuestion] = useState<any>(null);
    const [pinVotes, setPinVotes] = useState<Record<string, string[]>>({});
    const [showPinModal, setShowPinModal] = useState(false);
    const [selectedPinQ, setSelectedPinQ] = useState('');

    useEffect(() => {
        const tribes = JSON.parse(localStorage.getItem('phn_tribes') || '[]');
        const t = tribes.find((t: any) => t.id === id);
        setTribe(t);
        if (!t) return;

        // Get joined status from chain
        const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
        hasJoinedTribeFromChain(wallet.address, id!).then(joined => {
            setIsJoined(joined || t.creatorAddress === wallet.address);
        }).catch(() => {
            // Fallback to localStorage
            const localJoined = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
            setIsJoined((localJoined[wallet.address] || []).includes(id) || t.creatorAddress === wallet.address);
        });

        // Get tribe members from chain
        getTribeMembersFromChain(id!).then(memberAddresses => {
            // Deduplicate
            const unique = [...new Set([t.creatorAddress, ...memberAddresses].filter(Boolean))];
            memberAddresses = unique;
            const memberList = memberAddresses.map(addr => ({
                address: addr,
                ...profiles[addr],
                isCreator: addr === t.creatorAddress
            })).sort((a, b) => (b.reputationScore || 0) - (a.reputationScore || 0));
            setMembers(memberList);
        }).catch(() => {
            // Fallback to localStorage
            const localJoined = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
            const memberAddresses: string[] = t.creatorAddress ? [t.creatorAddress] : [];
            Object.entries(localJoined).forEach(([addr, tribeIds]: any) => {
                if (tribeIds.includes(id) && !memberAddresses.includes(addr)) {
                    memberAddresses.push(addr);
                }
            });
            const memberList = memberAddresses.map(addr => ({
                address: addr,
                ...profiles[addr],
                isCreator: addr === t.creatorAddress
            })).sort((a: any, b: any) => (b.reputationScore || 0) - (a.reputationScore || 0));
            setMembers(memberList);
        });

        // Get questions for this tribe category
        const allQ = JSON.parse(localStorage.getItem('phn_questions') || '[]');
        const tribeQ = allQ.filter((q: any) =>
            q.category?.toLowerCase() === t.category?.toLowerCase() ||
            q.tribeId === id
        );
        setQuestions(tribeQ);

        // Load pinned question + votes
        const pinData = JSON.parse(localStorage.getItem('phn_pin_votes') || '{}');
        const tribePin = pinData[id!] || {};
        setPinVotes(tribePin);
        if (t.pinnedQuestionId) {
            const pinned = allQ.find((q: any) => q.id === t.pinnedQuestionId);
            setPinnedQuestion(pinned || null);
        }
    }, [id, wallet.address]);

    const handleJoin = async () => {
        if (!wallet.isConnected) { nav('/signup'); return; }
        // Tribe gating — require 500 PROOFH to join
        if (wallet.balance < 500) {
            setError('You need at least 500 PROOFH to join this tribe.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const hash = await txJoinTribe(wallet.address, id!, wallet.publicKey, wallet.privateKey);
            await waitForTx(wallet.address, hash, 60000);
            deductFee(1000);
            // Save joined
            const joined = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
            if (!joined[wallet.address]) joined[wallet.address] = [];
            if (!joined[wallet.address].includes(id)) joined[wallet.address].push(id);
            localStorage.setItem('phn_joined_tribes', JSON.stringify(joined));
            // Update member count
            const tribes = JSON.parse(localStorage.getItem('phn_tribes') || '[]');
            const idx = tribes.findIndex((t: any) => t.id === id);
            if (idx !== -1) {
                tribes[idx].memberCount = (tribes[idx].memberCount || 0) + 1;
                localStorage.setItem('phn_tribes', JSON.stringify(tribes));
                setTribe(tribes[idx]);
            }
            setIsJoined(true);
            setSuccess('Joined! TX: ' + hash.slice(0, 16) + '...');
            // Add self to members
            const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
            const me = { address: wallet.address, ...profiles[wallet.address] };
            setMembers(prev => [...prev, me].sort((a, b) => (b.reputationScore || 0) - (a.reputationScore || 0)));
        } catch (e: any) { setSuccess('Error: ' + e.message); }
        setLoading(false);
    };

    const timeAgo = (ts: number) => {
        const diff = Date.now() - ts;
        if (diff < 60000) return 'just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        return `${Math.floor(diff / 3600000)}h ago`;
    };

    const handleVotePin = (questionId: string) => {
        if (!isJoined) { setError('Join the tribe to vote on pinned questions'); return; }
        const pinData = JSON.parse(localStorage.getItem('phn_pin_votes') || '{}');
        if (!pinData[id!]) pinData[id!] = {};
        if (!pinData[id!][questionId]) pinData[id!][questionId] = [];
        // Toggle vote
        const voters: string[] = pinData[id!][questionId];
        const myIdx = voters.indexOf(wallet.address);
        if (myIdx === -1) {
            voters.push(wallet.address);
        } else {
            voters.splice(myIdx, 1);
        }
        pinData[id!][questionId] = voters;
        localStorage.setItem('phn_pin_votes', JSON.stringify(pinData));
        setPinVotes({...pinData[id!]});
        // If question gets 2+ votes, pin it
        if (voters.length >= 2) {
            const tribes = JSON.parse(localStorage.getItem('phn_tribes') || '[]');
            const tIdx = tribes.findIndex((t: any) => t.id === id);
            if (tIdx !== -1) {
                tribes[tIdx].pinnedQuestionId = questionId;
                localStorage.setItem('phn_tribes', JSON.stringify(tribes));
                const allQ = JSON.parse(localStorage.getItem('phn_questions') || '[]');
                const pinned = allQ.find((q: any) => q.id === questionId);
                setPinnedQuestion(pinned || null);
                setSuccess(`Question pinned! ${voters.length} members voted.`);
            }
        } else {
            setSuccess(`Vote recorded! ${voters.length}/2 votes to pin.`);
        }
    };

    if (!tribe) return (
        <div style={{ background: '#060612', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            Tribe not found
        </div>
    );

    const color = CATEGORY_COLORS[tribe.category] || '#6366F1';

    return (
        <div style={{ background: '#060612', minHeight: '100vh', fontFamily: 'Inter,sans-serif', color: '#F9FAFB' }}>
            {/* Navbar */}
            <nav style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 32px', background: 'rgba(6,6,18,0.95)', borderBottom: '1px solid rgba(99,102,241,0.15)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => nav('/feed')}>
                    <img src="/phn-logo.svg" alt="PHN" style={{ width: 28, height: 28 }} />
                    <div><div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: 1 }}>PHN</div><div style={{ fontSize: 9, color: '#4B5563', letterSpacing: 2 }}>PROOF OF HELP</div></div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>Block #{blockHeight}</span>
                    </div>
                    <button onClick={() => nav('/tribes')} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #1F2937', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>← Tribes</button>
                </div>
            </nav>

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 60px' }}>

                {/* Tribe Header */}
                <div style={{ background: 'rgba(10,10,25,0.8)', border: `1px solid ${color}30`, borderRadius: 24, padding: 36, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, position: 'relative', zIndex: 1 }}>
                        <div style={{ width: 72, height: 72, borderRadius: 18, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
                            {CATEGORY_ICONS[tribe.category] || '🏘️'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: '#fff', margin: 0 }}>{tribe.name}</h1>
                                <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: `${color}15`, border: `1px solid ${color}40`, color }}>{tribe.category}</span>
                            </div>
                            <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 16 }}>{tribe.description}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                <span style={{ fontSize: 13, color: '#6B7280' }}>👥 {tribe.memberCount || 1} members</span>
                                <span style={{ fontSize: 13, color: '#6B7280' }}>❓ {questions.length} questions</span>
                                {isJoined ? (
                                    <span style={{ padding: '8px 20px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 13, fontWeight: 700 }}>
                                        ✅ {tribe.creatorAddress === wallet.address ? 'Creator' : 'Member'}
                                    </span>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                        <button onClick={handleJoin} disabled={loading || wallet.balance < 500} style={{ padding: '8px 20px', borderRadius: 10, background: wallet.balance >= 500 ? `linear-gradient(135deg, ${color}, ${color}88)` : 'rgba(107,114,128,0.3)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: wallet.balance >= 500 ? 'pointer' : 'not-allowed', fontFamily: 'Syne,sans-serif' }}>
                                            {loading ? '⏳ Joining...' : '+ Join Tribe'}
                                        </button>
                                        <span style={{ fontSize: 11, color: wallet.balance >= 500 ? '#10B981' : '#EF4444' }}>
                                            {wallet.balance >= 500 ? `✅ ${wallet.balance} PROOFH — eligible` : `❌ Need 500 PROOFH (have ${wallet.balance})`}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {success && <div style={{ marginTop: 12, fontSize: 12, color: '#10B981' }}>✅ {success}</div>}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

                    {/* Questions */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', margin: 0 }}>Tribe Questions</h2>
                            <button onClick={() => nav(`/ask?tribeId=${id}`)} style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                + Ask Question
                            </button>
                        </div>
                        {questions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40, background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, color: '#6B7280' }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
                                No questions in this tribe yet. Be the first!
                            </div>
                        ) : questions.map(q => (
                            <div key={q.id} onClick={() => nav(`/question/${q.id}`)} style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 14, padding: '18px 22px', marginBottom: 12, cursor: 'pointer', transition: 'border-color 0.2s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}40`; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1A1A2E'; }}
                            >
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', marginBottom: 8 }}>{q.title}</div>
                                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{q.content}</div>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, color: '#4B5563' }}>
                                    <span>💬 {q.answerCount || 0} answers</span>
                                    <span>{timeAgo(q.createdAt)}</span>
                                    {(q.tags || []).map((tag: string) => (
                                        <span key={tag} style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.08)', color: '#6366F1', fontSize: 11 }}>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar - Top Members */}
                    <div>
                        <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
                            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1A1A2E', fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', letterSpacing: 1 }}>
                                🏆 TOP MEMBERS
                            </div>
                            {members.length === 0 ? (
                                <div style={{ padding: 20, fontSize: 13, color: '#6B7280', textAlign: 'center' }}>No members yet</div>
                            ) : members.slice(0, 10).map((m, i) => (
                                <div key={m.address} onClick={() => nav(`/profile/${m.username || m.address}`)} style={{ padding: '12px 20px', borderBottom: i < members.length - 1 ? '1px solid #0D0D1E' : 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.05)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                                >
                                    <div style={{ fontSize: 12, color: '#4B5563', width: 16, textAlign: 'center' }}>#{i + 1}</div>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                                        {m.username?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                                            {m.username || m.address?.slice(0, 8)}
                                            {m.isCreator && <span style={{ fontSize: 10, color, marginLeft: 6 }}>creator</span>}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#4B5563' }}>{m.reputationScore || 0} CRED</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tribe Stats */}
                        <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, padding: 20 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', letterSpacing: 1, marginBottom: 16 }}>TRIBE STATS</div>
                            {[
                                { label: 'Members', value: tribe.memberCount || 1 },
                                { label: 'Questions', value: questions.length },
                                { label: 'Category', value: tribe.category },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                                    <span style={{ color: '#6B7280' }}>{label}</span>
                                    <span style={{ color: '#fff', fontWeight: 600 }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
