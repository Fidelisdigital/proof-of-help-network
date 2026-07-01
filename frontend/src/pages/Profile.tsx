import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { getTxsBySender } from '../utils/rpc';
import { updateLocalCRED } from '../utils/state';
import { txFollowUser, txEndorseMember, txUpdateProfile } from '../utils/transactions';
import { waitForTx } from '../utils/rpc';

export default function Profile() {
    const nav = useNavigate();
    const { username } = useParams();
    const { wallet, blockHeight, updateBalance } = useWallet();
    // Resolve username to address
    const address = (() => {
        if (!username) return '';
        // Check if it looks like an address (40 hex chars)
        if (/^[0-9a-f]{40}$/i.test(username)) return username;
        // Look up by username
        const map = JSON.parse(localStorage.getItem('phn_usernames') || '{}');
        return map[username.toLowerCase()] || username;
    })();
    const [profile, setProfile] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<any[]>([]);
    const [txs, setTxs] = useState<any[]>([]);
    const [skill, setSkill] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('questions');
    const [editMode, setEditMode] = useState(false);
    const [editBio, setEditBio] = useState('');
    const [editTags, setEditTags] = useState('');
    const [chainStats, setChainStats] = useState({
        txCount: 0,
        joinBlock: 0,
        joinDate: '',
        isVerified: false,
        txTypes: {} as Record<string, number>
    });
    const [chainCRED, setChainCRED] = useState<number | null>(null);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const isOwn = wallet.address === address;

    useEffect(() => {
        if (!address) return;
        // Recalculate CRED from actual data
        // Fetch CRED from chain only — never from localStorage
        updateLocalCRED(address).then(score => {
            setChainCRED(score);
        }).catch(() => setChainCRED(0));
        const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
        setProfile(profiles[address]);
        const allQ = JSON.parse(localStorage.getItem('phn_questions') || '[]');
        setQuestions(allQ.filter((q: any) => q.authorAddress === address));
        const allA = JSON.parse(localStorage.getItem('phn_answers') || '[]');
        setAnswers(allA.filter((a: any) => a.authorAddress === address));
        // Count followers from chain — query all known users' follow_user txs
        const allProfiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
        const allAddresses = Object.keys(allProfiles);
        let followers = 0;
        let following = 0;
        Promise.all(allAddresses.map(async (addr) => {
            try {
                const txs = await getTxsBySender(addr, 100);
                txs.forEach((tx: any) => {
                    if (tx.messageType === 'follow_user') {
                        const msg = tx.transaction?.msg || {};
                        // This user is following someone
                        if (addr === address) following++;
                        // Someone is following this profile
                        if (tx.recipient === address && addr !== address) followers++;
                    }
                });
            } catch { /* skip */ }
        })).then(() => {
            setFollowerCount(followers);
            setFollowingCount(following);
        });

        // Fetch chain stats for identity
        getTxsBySender(address, 100).then(allTxs => {
            const txCount = allTxs.length;
            const isVerified = txCount >= 5;
            const profileTx = allTxs.find((tx: any) => tx.messageType === 'create_profile');
            const joinBlock = profileTx?.height || 0;
            const joinDate = joinBlock > 0 ? `Block #${joinBlock}` : 'Unknown';
            const txTypes: Record<string, number> = {};
            allTxs.forEach((tx: any) => {
                txTypes[tx.messageType] = (txTypes[tx.messageType] || 0) + 1;
            });
            setChainStats({ txCount, joinBlock, joinDate, isVerified, txTypes });
        }).catch(() => {});

        // Fetch sent txs + faucet received from validator
        const FAUCET_ADDR = 'c0d8caf3fc48cbcc685a6a0b3004eaf28a23663b';
        Promise.all([
            getTxsBySender(address, 20).catch(() => []),
            getTxsBySender(FAUCET_ADDR, 50).catch(() => [])
        ]).then(([sent, faucetTxs]) => {
            // Filter faucet txs where recipient is this address
            const received = faucetTxs.filter((tx: any) =>
                tx.recipient === address && tx.messageType === 'send'
            ).map((tx: any) => ({ ...tx, isReceived: true }));
            const all = [...sent, ...received];
            const seen = new Set();
            const unique = all.filter((tx: any) => {
                if (seen.has(tx.txHash)) return false;
                seen.add(tx.txHash);
                return true;
            });
            unique.sort((a: any, b: any) => (b.height || 0) - (a.height || 0));
            setTxs(unique);
        });
    }, [address]);

    const handleFollow = async () => {
        if (!wallet.isConnected || !address) return;
        setLoading(true);
        try {
            const hash = await txFollowUser(wallet.address, address, wallet.publicKey, wallet.privateKey);
            await waitForTx(wallet.address, hash, 60000);
            // Save to phn_follows for quick lookup
            const follows = JSON.parse(localStorage.getItem('phn_follows') || '{}');
            if (!follows[wallet.address]) follows[wallet.address] = [];
            if (!follows[wallet.address].includes(address)) {
                follows[wallet.address].push(address);
                localStorage.setItem('phn_follows', JSON.stringify(follows));
            }
            setFollowingCount(prev => prev + 1);
            setSuccess('Following! TX: ' + hash.slice(0, 16) + '...');
        } catch (e: any) { setSuccess('Error: ' + e.message); }
        setLoading(false);
    };

    const handleEndorse = async () => {
        if (!wallet.isConnected || !address || !skill.trim()) return;
        setLoading(true);
        try {
            const hash = await txEndorseMember(wallet.address, address, skill, wallet.publicKey, wallet.privateKey);
            await waitForTx(wallet.address, hash, 60000);
            // Update local profile
            const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
            if (profiles[address]) {
                profiles[address].endorsements = (profiles[address].endorsements || 0) + 1;
                profiles[address].reputationScore = (profiles[address].reputationScore || 0) + 15;
                if (!profiles[address].endorsedSkills) profiles[address].endorsedSkills = {};
                profiles[address].endorsedSkills[skill] = (profiles[address].endorsedSkills[skill] || 0) + 1;
                localStorage.setItem('phn_profiles', JSON.stringify(profiles));
                setProfile(profiles[address]);
            }
            setSuccess('Endorsed for ' + skill + '! TX: ' + hash.slice(0, 16) + '...');
            setSkill('');
        } catch (e: any) { setSuccess('Error: ' + e.message); }
        setLoading(false);
    };

    const handleSaveProfile = async () => {
        const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
        if (profiles[address!]) {
            profiles[address!].bio = editBio;
            profiles[address!].expertiseTags = editTags.split(',').map((t: string) => t.trim()).filter(Boolean);
            localStorage.setItem('phn_profiles', JSON.stringify(profiles));
            setProfile(profiles[address!]);
        }
        setEditMode(false);
        setSuccess('Profile updated!');
        // Fire update_profile tx onchain
        try {
            const tags = editTags.split(',').map((t: string) => t.trim()).filter(Boolean);
            await txUpdateProfile(address!, editBio, tags, wallet.publicKey, wallet.privateKey);
        } catch { /* non-blocking */ }
    };

    const getCredColor = (score: number) => {
        if (score >= 600) return '#A78BFA';
        if (score >= 300) return '#6366F1';
        if (score >= 100) return '#F59E0B';
        return '#10B981';
    };

    const timeAgo = (ts: number) => {
        const diff = Date.now() - ts;
        if (diff < 60000) return 'just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    };

    if (!profile) return (
        <div style={{ background: '#060612', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            Profile not found
        </div>
    );

    const credColor = getCredColor(chainCRED || 0);

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
                    <button onClick={() => nav('/feed')} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #1F2937', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>← Feed</button>
                </div>
            </nav>

            <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 60px' }}>

                {/* Profile Header */}
                <div style={{ background: 'rgba(10,10,25,0.8)', border: `1px solid ${credColor}30`, borderRadius: 24, padding: '40px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${credColor}08 0%, transparent 70%)`, pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                        {/* Avatar */}
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${credColor}, ${credColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: 'Syne,sans-serif', flexShrink: 0 }}>
                            {profile.username?.[0]?.toUpperCase()}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                                <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: '#fff', margin: 0 }}>{profile.username}</h1>
                                <div style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: `${credColor}15`, border: `1px solid ${credColor}40`, color: credColor }}>
                                    {chainCRED !== null ? chainCRED : '...'} CRED
                                </div>
                            </div>
                            <div style={{ fontSize: 12, color: '#4B5563', marginBottom: 10, fontFamily: 'monospace' }}>{address}</div>
                            {/* Onchain Identity Badges */}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                {chainStats.isVerified && (
                                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10B981' }}>
                                        ✅ Verified Onchain
                                    </span>
                                )}
                                {chainStats.joinBlock > 0 && (
                                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
                                        🔗 Joined {chainStats.joinDate}
                                    </span>
                                )}
                                {chainStats.txCount > 0 && (
                                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA' }}>
                                        ⛓️ {chainStats.txCount} onchain txs
                                    </span>
                                )}
                                <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, background: 'rgba(6,6,18,0.8)', border: '1px solid #1F2937', color: '#4B5563', fontFamily: 'monospace' }}>
                                    DID: {address.slice(0, 8)}...{address.slice(-6)}
                                </span>
                            </div>
                            {profile.bio && <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 16, maxWidth: 500 }}>{profile.bio}</p>}

                            {/* Tags */}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                                {(profile.expertiseTags || []).map((tag: string) => (
                                    <span key={tag} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>{tag}</span>
                                ))}
                            </div>

                            {/* Actions */}
                            {isOwn && (
                                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                    {!editMode ? (
                                        <button onClick={() => { setEditBio(profile.bio || ''); setEditTags((profile.expertiseTags || []).join(', ')); setEditMode(true); }} style={{ padding: '8px 20px', borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                            ✏️ Edit Profile
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                                            <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Bio..." style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(10,10,25,0.8)', border: '1px solid #6366F1', color: '#fff', fontSize: 13, fontFamily: 'Inter,sans-serif', resize: 'none', height: 80, outline: 'none' }} />
                                            <input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="Tags: react, web3, design..." style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(10,10,25,0.8)', border: '1px solid #6366F1', color: '#fff', fontSize: 13, fontFamily: 'Inter,sans-serif', outline: 'none' }} />
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={handleSaveProfile} style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
                                                <button onClick={() => setEditMode(false)} style={{ padding: '8px 16px', borderRadius: 10, background: 'transparent', border: '1px solid #1F2937', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!isOwn && wallet.isConnected && (
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    <button onClick={handleFollow} disabled={loading} style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                        {loading ? '...' : '+ Follow'}
                                    </button>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input value={skill} onChange={e => setSkill(e.target.value)} placeholder="Skill to endorse..." style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937', color: '#fff', fontSize: 13, outline: 'none', width: 160 }} />
                                        <button onClick={handleEndorse} disabled={loading || !skill.trim()} style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                            ✓ Endorse
                                        </button>
                                    </div>
                                </div>
                            )}
                            {success && <div style={{ marginTop: 12, fontSize: 12, color: '#10B981' }}>{success}</div>}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16, marginBottom: 24 }}>
                    {[
                        { label: 'CRED Score', value: chainCRED !== null ? chainCRED : '...', color: credColor },
                        { label: 'Questions', value: questions.length, color: '#6366F1' },
                        { label: 'Answers', value: answers.length, color: '#8B5CF6' },
                        { label: 'Followers', value: followerCount, color: '#10B981' },
                        { label: 'Following', value: followingCount, color: '#06B6D4' },
                        { label: 'Endorsements', value: profile.endorsements || 0, color: '#F59E0B' },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, padding: '20px 24px', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 32, color, marginBottom: 4 }}>{value}</div>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Onchain Identity Card */}
                {chainStats.txCount > 0 && (
                    <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', letterSpacing: 1, marginBottom: 16 }}>⛓️ ONCHAIN IDENTITY</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
                            {[
                                { label: 'Total Txs', value: chainStats.txCount, color: '#6366F1' },
                                { label: 'Joined', value: chainStats.joinDate, color: '#10B981' },
                                { label: 'Status', value: chainStats.isVerified ? '✅ Verified' : '⏳ Building', color: chainStats.isVerified ? '#10B981' : '#F59E0B' },
                            ].map(({ label, value, color }) => (
                                <div key={label} style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(6,6,18,0.8)', border: '1px solid #1F2937', textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 4 }}>{label}</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'Syne,sans-serif' }}>{value}</div>
                                </div>
                            ))}
                        </div>
                        {/* Tx type breakdown */}
                        <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 8 }}>TRANSACTION HISTORY</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {Object.entries(chainStats.txTypes).map(([type, count]) => (
                                <span key={type} style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#818CF8' }}>
                                    {type} ×{count}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* CRED Breakdown */}
                <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', letterSpacing: 1, marginBottom: 4 }}>TRUST SCORE BREAKDOWN</div>
                    <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 16 }}>
                        Accepted answer: +50pts · Helpful vote received: +5pts · Endorsement received: +15pts · Misleading vote: -5pts
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Accepted Answers', pts: (profile.acceptedAnswers || 0) * 50, color: '#10B981' },
                            { label: 'Helpful Votes', pts: answers.reduce((s: number, a: any) => s + (a.helpfulVotes || 0) * 5, 0), color: '#6366F1' },
                            { label: 'Endorsements', pts: (profile.endorsements || 0) * 15, color: '#8B5CF6' },
                        ].map(({ label, pts, color }) => (
                            <div key={label} style={{ flex: 1, minWidth: 140, padding: '14px 18px', borderRadius: 12, background: 'rgba(6,6,18,0.8)', border: `1px solid ${color}20` }}>
                                <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 4 }}>{label}</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'Syne,sans-serif' }}>+{pts} pts</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Endorsed Skills */}
                {profile.endorsedSkills && Object.keys(profile.endorsedSkills).length > 0 && (
                    <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', letterSpacing: 1, marginBottom: 16 }}>ENDORSED SKILLS</div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {Object.entries(profile.endorsedSkills).map(([s, count]: any) => (
                                <div key={s} style={{ padding: '6px 16px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 13, color: '#818CF8', fontWeight: 600 }}>{s}</span>
                                    <span style={{ fontSize: 11, color: '#4B5563' }}>×{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Joined Tribes */}
                {(() => {
                    const joinedTribes = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}')[address] || [];
                    const allTribes = JSON.parse(localStorage.getItem('phn_tribes') || '[]');
                    const myTribes = allTribes.filter((t: any) => joinedTribes.includes(t.id) || t.creatorAddress === address);
                    if (myTribes.length === 0) return null;
                    return (
                        <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', letterSpacing: 1, marginBottom: 16 }}>TRIBES</div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {myTribes.map((t: any) => (
                                    <div key={t.id} style={{ padding: '6px 16px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 13, color: '#818CF8', fontWeight: 600 }}>{t.name}</span>
                                        <span style={{ fontSize: 11, color: '#4B5563' }}>{t.category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                    {['questions', 'answers', 'onchain'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            padding: '8px 20px', borderRadius: 8, border: 'none',
                            background: activeTab === tab ? 'rgba(99,102,241,0.15)' : 'transparent',
                            color: activeTab === tab ? '#818CF8' : '#6B7280',
                            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif',
                            borderBottom: activeTab === tab ? '2px solid #6366F1' : '2px solid transparent'
                        }}>
                            {tab === 'questions' ? `Questions (${questions.length})` : tab === 'answers' ? `Answers (${answers.length})` : 'Onchain Activity'}
                        </button>
                    ))}
                </div>

                {/* Questions tab */}
                {activeTab === 'questions' && (
                    <div>
                        {questions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>No questions yet</div>
                        ) : questions.map(q => (
                            <div key={q.id} onClick={() => nav(`/question/${q.id}`)} style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 14, padding: '18px 22px', marginBottom: 12, cursor: 'pointer', transition: 'border-color 0.2s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1A1A2E'; }}
                            >
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', marginBottom: 8 }}>{q.title}</div>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, background: 'rgba(99,102,241,0.1)', color: '#818CF8' }}>{q.category}</span>
                                    <span style={{ fontSize: 12, color: '#4B5563' }}>{timeAgo(q.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Answers tab */}
                {activeTab === 'answers' && (
                    <div>
                        {answers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>No answers yet</div>
                        ) : answers.map(a => (
                            <div key={a.id} onClick={() => nav(`/question/${a.questionId}`)} style={{ background: 'rgba(10,10,25,0.8)', border: `1px solid ${a.isAccepted ? 'rgba(16,185,129,0.3)' : '#1A1A2E'}`, borderRadius: 14, padding: '18px 22px', marginBottom: 12, cursor: 'pointer' }}>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                                    {a.isAccepted && <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, background: 'rgba(16,185,129,0.15)', color: '#10B981', fontWeight: 700 }}>✅ ACCEPTED</span>}
                                    {a.stakeAmount > 0 && <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, background: 'rgba(139,92,246,0.1)', color: '#A78BFA' }}>🎯 {a.stakeAmount} staked</span>}
                                </div>
                                <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.content}</p>
                                <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: '#4B5563' }}>
                                    <span>👍 {a.helpfulVotes || 0}</span>
                                    <span>🎯 {a.accurateVotes || 0}</span>
                                    <span>{timeAgo(a.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Onchain Activity tab */}
                {activeTab === 'onchain' && (
                    <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #1A1A2E', fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', letterSpacing: 1 }}>
                            CANOPY CHAIN TRANSACTIONS
                        </div>
                        {txs.length === 0 ? (
                            <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>No onchain activity found</div>
                        ) : txs.map((tx, i) => {
                            const isReceived = tx.isReceived || (tx.recipient === address && tx.sender !== address && tx.sender === 'c0d8caf3fc48cbcc685a6a0b3004eaf28a23663b');
                            const typeColors: Record<string, string> = {
                                'create_profile': '#6366F1',
                                'create_question': '#8B5CF6',
                                'submit_answer': '#10B981',
                                'accept_answer': '#F59E0B',
                                'verify_answer': '#06B6D4',
                                'follow_user': '#EC4899',
                                'endorse_member': '#F97316',
                                'create_tribe': '#84CC16',
                                'join_tribe': '#84CC16',
                                'send': '#10B981',
                            };
                            const credEvents: Record<string, string> = {
                                'submit_answer': '+10 CRED',
                                'accept_answer': '+50 CRED',
                                'verify_answer': '+5 CRED',
                                'endorse_member': '+15 CRED',
                            };
                            const dotColor = typeColors[tx.messageType] || '#6B7280';
                            const credTag = isReceived && credEvents[tx.messageType];
                            const label = isReceived
                                ? tx.messageType === 'send' ? '📥 PROOFH Received' : `📥 ${tx.messageType}`
                                : tx.messageType;
                            return (
                                <div key={i} style={{ padding: '14px 24px', borderBottom: i < txs.length - 1 ? '1px solid #0D0D1E' : 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, boxShadow: `0 0 6px ${dotColor}`, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Syne,sans-serif' }}>{label}</div>
                                            {credTag && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.15)', color: '#818CF8', fontWeight: 700 }}>{credTag}</span>}
                                            {tx.messageType === 'send' && isReceived && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.15)', color: '#10B981', fontWeight: 700 }}>+{tx.transaction?.msg?.amount} PROOFH</span>}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#4B5563', fontFamily: 'monospace' }}>{tx.txHash?.slice(0, 32)}...</div>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#4B5563' }}>Block #{tx.height}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
