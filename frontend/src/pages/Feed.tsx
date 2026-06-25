import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { getHeight, getTxsBySender } from '../utils/rpc';
import { updateLocalCRED } from '../utils/state';

const CATEGORIES = ['All', 'Development', 'Crypto', 'Business', 'Design', 'Writing', 'General'];

function Navbar() {
    const nav = useNavigate();
    const { wallet, blockHeight, disconnect, isLoading } = useWallet();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            height: 60, display: 'flex', alignItems: 'center',
            padding: '0 24px', gap: 24,
            background: 'rgba(6,6,18,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(99,102,241,0.15)'
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }} onClick={() => nav('/feed')}>
                <img src="/phn-logo.svg" alt="PHN" style={{ width: 30, height: 30 }} />
                <div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 12, color: '#fff', letterSpacing: 1 }}>PHN NETWORK</div>
                    <div style={{ fontSize: 8, color: '#4B5563', letterSpacing: 2 }}>PROOF OF HELP</div>
                </div>
            </div>

            {/* Nav links */}
            <div style={{ display: 'flex', gap: 4 }}>
                {[
                    { label: 'FEED', path: '/feed' },
                    { label: 'ASK', path: '/ask' },
                    { label: 'TRIBES', path: '/tribes' },
                    { label: 'EXPLORER', path: '/explorer' },
                ].map(({ label, path }) => (
                    <button key={label} onClick={() => nav(path)} style={{
                        padding: '6px 14px', borderRadius: 8, border: 'none',
                        background: window.location.pathname === path ? 'rgba(99,102,241,0.15)' : 'transparent',
                        color: window.location.pathname === path ? '#818CF8' : '#6B7280',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'Syne,sans-serif', letterSpacing: 1,
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={e => { if (window.location.pathname !== path) (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF'; }}
                        onMouseLeave={e => { if (window.location.pathname !== path) (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}
                    >{label}</button>
                ))}
            </div>

            {/* Right side */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Block height */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                    <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>Height: #{blockHeight}</span>
                </div>

                {/* RPC status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                    <span style={{ fontSize: 11, color: '#10B981', fontFamily: 'monospace' }}>RPC CONNECTED</span>
                </div>

                {/* Wallet */}
                <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowMenu(!showMenu)} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 14px', borderRadius: 10,
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
                        cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                            {wallet.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif' }}>{wallet.username || 'Anonymous'}</div>
                            <div style={{ fontSize: 10, color: '#6366F1' }}>{wallet.trustScore} CRED</div>
                        </div>
                    </button>

                    {showMenu && (
                        <div style={{
                            position: 'absolute', top: '100%', right: 0, marginTop: 8,
                            background: '#0D0D1E', border: '1px solid #1F2937',
                            borderRadius: 12, padding: 8, minWidth: 180,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 200
                        }}>
                            <div style={{ padding: '8px 12px', borderBottom: '1px solid #1F2937', marginBottom: 4 }}>
                                <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>{wallet.address.slice(0,8)}...{wallet.address.slice(-6)}</div>
                                <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>{wallet.balance.toLocaleString()} PROOFH</div>
                            </div>
                            {[
                                { label: '👤 My Profile', action: () => { nav(`/profile/${wallet.username || wallet.address}`); setShowMenu(false); } },
                                { label: '🔍 Explorer', action: () => { nav('/explorer'); setShowMenu(false); } },
                                { label: '🚪 Disconnect', action: () => { disconnect(); nav('/'); } },
                            ].map(({ label, action }) => (
                                <button key={label} onClick={action} style={{
                                    width: '100%', padding: '8px 12px', borderRadius: 8,
                                    background: 'none', border: 'none', color: '#9CA3AF',
                                    fontSize: 13, cursor: 'pointer', textAlign: 'left',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF'; }}
                                >{label}</button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

function QuestionCard({ question, onClick }: { question: any; onClick: () => void }) {
    const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
    const author = profiles[question.authorAddress];
    const answers = JSON.parse(localStorage.getItem('phn_answers') || '[]');
    const answerCount = answers.filter((a: any) => a.questionId === question.id).length;
    const timeAgo = (ts: number) => {
        const diff = Date.now() - ts;
        if (diff < 60000) return 'just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    };

    return (
        <div onClick={onClick} style={{
            background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E',
            borderRadius: 16, padding: '20px 24px', cursor: 'pointer',
            transition: 'all 0.2s', marginBottom: 12
        }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1A1A2E'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                        {author?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{author?.username || question.authorAddress.slice(0, 8) + '...'}</span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 8, padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                            <span style={{ fontSize: 10, color: '#818CF8', fontWeight: 700 }}>{author?.reputationScore || 0} CRED</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.2)' }}>
                        {question.category}
                    </span>
                    <span style={{ fontSize: 11, color: '#4B5563' }}>{timeAgo(question.createdAt)}</span>
                </div>
            </div>

            {/* Title */}
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: '#F9FAFB', marginBottom: 10, lineHeight: 1.4 }}>
                {question.title}
            </h3>

            {/* Content preview */}
            {question.content && (
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {question.content}
                </p>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {(question.tags || []).map((tag: string) => (
                    <span key={tag} style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, color: '#6B7280', background: 'rgba(15,15,30,0.8)', border: '1px solid #1F2937' }}>
                        #{tag}
                    </span>
                ))}
                {question.tribeId && (() => {
                    const tribe = JSON.parse(localStorage.getItem('phn_tribes') || '[]').find((t: any) => t.id === question.tribeId);
                    if (!tribe) return null;
                    return (
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, color: '#A78BFA', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', fontWeight: 600 }}>
                            🏘️ {tribe.name}
                        </span>
                    );
                })()}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12, color: '#4B5563' }}>💬 {answerCount} {answerCount === 1 ? 'answer' : 'answers'}</span>
                </div>
                <span style={{ fontSize: 12, color: '#6366F1', fontWeight: 600 }}>SIGN ANSWER →</span>
            </div>
        </div>
    );
}

export default function Feed() {
    const nav = useNavigate();
    const { wallet, isLoading } = useWallet();
    const [questions, setQuestions] = useState<any[]>([]);
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [profiles, setProfiles] = useState<any>({});
    const [topUsers, setTopUsers] = useState<any[]>([]);
    const [trendingTags, setTrendingTags] = useState<string[]>([]);

    // Redirect if not connected
    useEffect(() => {
        if (!isLoading && !wallet.isConnected) nav('/');
    }, [wallet.isConnected, isLoading]);

    useEffect(() => {
        const q = JSON.parse(localStorage.getItem('phn_questions') || '[]');
        const p = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
        // Recalculate CRED for all users
        Object.keys(p).forEach(addr => updateLocalCRED(addr));
        const updatedP = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
        setQuestions(q.reverse());
        setProfiles(updatedP);

        // Top users by CRED
        const users = Object.values(updatedP) as any[];
        setTopUsers(users.sort((a: any, b: any) => (b.reputationScore || 0) - (a.reputationScore || 0)).slice(0, 5));

        // Trending tags
        const allTags = q.flatMap((q: any) => q.tags || []);
        const tagCount: Record<string, number> = {};
        allTags.forEach((t: string) => { tagCount[t] = (tagCount[t] || 0) + 1; });
        setTrendingTags(Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a]).slice(0, 8));
    }, []);

    const filtered = questions.filter(q => {
        const matchCat = category === 'All' || q.category === category;
        const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || (q.content || '').toLowerCase().includes(search.toLowerCase()) || (q.tags || []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
        return matchCat && matchSearch;
    });

    return (
        <div style={{ background: '#060612', minHeight: '100vh', fontFamily: 'Inter,sans-serif', color: '#F9FAFB' }}>
            <Navbar />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 40px', display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: 24 }}>

                {/* LEFT PANEL */}
                <div style={{ paddingTop: 16 }}>
                    {/* Profile card */}
                    {wallet.isConnected ? (
                        <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 16 }}>
                                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12, fontFamily: 'Syne,sans-serif' }}>
                                    {wallet.username?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{wallet.username}</div>
                                <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 6 }}>{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</div>
                                {(() => {
                                    const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
                                    const profile = profiles[wallet.address];
                                    const bio = profile?.bio;
                                    const joinedTribes = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}')[wallet.address] || [];
                                    const allTribes = JSON.parse(localStorage.getItem('phn_tribes') || '[]');
                                    const myTribes = allTribes.filter((t: any) => joinedTribes.includes(t.id) || t.creatorAddress === wallet.address);
                                    return (<>
                                        {bio && <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, lineHeight: 1.5 }}>{bio}</div>}
                                        {myTribes.length > 0 && (
                                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                                                {myTribes.map((t: any) => (
                                                    <span key={t.id} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
                                                        {t.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </>);
                                })()}
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: '#6366F1' }}>{wallet.trustScore}</div>
                                        <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: 1 }}>CRED</div>
                                    </div>
                                    <div style={{ width: 1, background: '#1F2937' }} />
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: '#10B981' }}>{wallet.balance.toLocaleString()}</div>
                                        <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: 1 }}>PROOFH</div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => nav(`/profile/${wallet.username || wallet.address}`)} style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                View Profile →
                            </button>
                        </div>
                    ) : (
                        <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937', borderRadius: 16, padding: 20, marginBottom: 16, textAlign: 'center' }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>🔐</div>
                            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#fff', marginBottom: 8 }}>No Wallet Connected</div>
                            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 16, lineHeight: 1.6 }}>Join PHN to ask questions, answer, and earn CRED reputation onchain.</div>
                            <button onClick={() => nav('/signup')} style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                Register Profile
                            </button>
                        </div>
                    )}

                    {/* Quick actions */}
                    <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, padding: 16 }}>
                        <div style={{ fontSize: 11, color: '#4B5563', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>QUICK ACTIONS</div>
                        {[
                            { icon: '✏️', label: 'Ask New Question', action: () => nav('/ask') },
                            { icon: '🏘️', label: 'Explore All Tribes', action: () => nav('/tribes') },
                            { icon: '🔍', label: 'Reputation Explorer', action: () => nav('/explorer') },
                            { icon: '👤', label: 'My Profile', action: () => nav(`/profile/${wallet.username || wallet.address}`) },
                        ].map(({ icon, label, action }) => (
                            <button key={label} onClick={action} style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 12px', borderRadius: 8, background: 'none',
                                border: 'none', color: '#9CA3AF', fontSize: 13, cursor: 'pointer',
                                textAlign: 'left', transition: 'all 0.2s', marginBottom: 2
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF'; }}
                            >
                                <span>{icon}</span>
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CENTER — FEED */}
                <div style={{ paddingTop: 16 }}>
                    {/* Search + Ask */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4B5563', fontSize: 14 }}>🔍</span>
                            <input
                                style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 12, background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937', color: '#F9FAFB', fontSize: 14, fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box' }}
                                placeholder="Search questions, subjects, or tags..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                            />
                        </div>
                        <button onClick={() => nav('/ask')} style={{
                            padding: '12px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                            border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            fontFamily: 'Syne,sans-serif', whiteSpace: 'nowrap'
                        }}>
                            ✏️ Ask Question
                        </button>
                    </div>

                    {/* Category filter */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setCategory(cat)} style={{
                                padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                                border: category === cat ? '1px solid #6366F1' : '1px solid #1F2937',
                                background: category === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
                                color: category === cat ? '#818CF8' : '#6B7280',
                                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Syne,sans-serif'
                            }}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Questions */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16 }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 8 }}>No questions yet</div>
                            <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>Be the first to ask a question on PHN</div>
                            <button onClick={() => nav('/ask')} style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                Ask First Question →
                            </button>
                        </div>
                    ) : (
                        filtered.map(q => (
                            <QuestionCard key={q.id} question={q} onClick={() => nav(`/question/${q.id}`)} />
                        ))
                    )}
                </div>

                {/* RIGHT PANEL */}
                <div style={{ paddingTop: 16 }}>
                    {/* Trending tags */}
                    <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span>🏷️</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', letterSpacing: 1 }}>TRENDING TAGS</span>
                        </div>
                        {trendingTags.length === 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {['#bls12-381', '#canopy', '#typescript', '#web3', '#react', '#blockchain', '#defi', '#socialfi'].map(tag => (
                                    <button key={tag} onClick={() => setSearch(tag.replace('#', ''))} style={{
                                        padding: '5px 12px', borderRadius: 999, fontSize: 12,
                                        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                                        color: '#818CF8', cursor: 'pointer', fontFamily: 'monospace'
                                    }}>{tag}</button>
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {trendingTags.map(tag => (
                                    <button key={tag} onClick={() => setSearch(tag)} style={{
                                        padding: '5px 12px', borderRadius: 999, fontSize: 12,
                                        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                                        color: '#818CF8', cursor: 'pointer', fontFamily: 'monospace'
                                    }}>#{tag}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Top CRED users */}
                    <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span>🏆</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Syne,sans-serif', letterSpacing: 1 }}>TOP CRED ORACLES</span>
                        </div>
                        {topUsers.length === 0 ? (
                            <div style={{ fontSize: 12, color: '#4B5563', textAlign: 'center', padding: '20px 0' }}>
                                No users yet. Be the first!
                            </div>
                        ) : (
                            topUsers.map((user, i) => (
                                <div key={user.address} onClick={() => nav(`/profile/${user.address}`)} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '10px 0', borderBottom: i < topUsers.length - 1 ? '1px solid #1A1A2E' : 'none',
                                    cursor: 'pointer'
                                }}>
                                    <span style={{ fontSize: 12, color: '#4B5563', width: 16, textAlign: 'center' }}>#{i + 1}</span>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                                        {user.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user.username}</div>
                                        <div style={{ fontSize: 11, color: '#4B5563' }}>{user.address.slice(0, 8)}...</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#6366F1', fontFamily: 'Syne,sans-serif' }}>{user.reputationScore}</div>
                                        <div style={{ fontSize: 10, color: '#4B5563' }}>CRED</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* PHN info */}
                    <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 16, padding: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#818CF8', fontFamily: 'Syne,sans-serif', marginBottom: 10 }}>PHN CONSENSUS</div>
                        <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.7 }}>
                            PHN reputation is calculated decentralized. High score curators earn higher verify coefficients when auditing dispute state values.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
