import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { getHeight, getTxsByHeight } from '../utils/rpc';

const TX_COLORS: Record<string, string> = {
    create_profile: '#10B981',
    update_profile: '#10B981',
    create_question: '#6366F1',
    submit_answer: '#8B5CF6',
    accept_answer: '#10B981',
    dispute_answer: '#EF4444',
    verify_answer: '#F59E0B',
    stake_reputation: '#A78BFA',
    reward_reputation: '#10B981',
    penalty_reputation: '#EF4444',
    follow_user: '#6366F1',
    endorse_member: '#8B5CF6',
    create_tribe: '#F59E0B',
    join_tribe: '#F59E0B',
    send: '#9CA3AF',
};

export default function Explorer() {
    const nav = useNavigate();
    const { wallet, blockHeight } = useWallet();
    const [txs, setTxs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [scannedHeight, setScannedHeight] = useState(0);

    useEffect(() => {
        loadTxs();
        const interval = setInterval(loadTxs, 8000);
        return () => clearInterval(interval);
    }, [blockHeight]);

    const loadTxs = async () => {
        try {
            const h = await getHeight();
            const allTxs: any[] = [];
            const start = Math.max(1, h - 30);
            for (let i = h; i >= start; i--) {
                const blockTxs = await getTxsByHeight(i);
                if (blockTxs && blockTxs.length > 0) {
                    allTxs.push(...blockTxs.map((tx: any) => ({ ...tx, blockHeight: i })));
                }
            }
            setTxs(allTxs);
            setScannedHeight(h);
        } catch { /* ignore */ }
        setLoading(false);
    };

    const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
    const getUsername = (addr: string) => profiles[addr]?.username || addr?.slice(0, 8) + '...' || 'unknown';

    const filtered = filter === 'all' ? txs : txs.filter(tx => tx.messageType === filter);

    const txTypes = [...new Set(txs.map(tx => tx.messageType).filter(Boolean))];

    return (
        <div style={{ background: '#060612', minHeight: '100vh', fontFamily: 'Inter,sans-serif', color: '#F9FAFB' }}>
            {/* Navbar */}
            <nav style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 32px', background: 'rgba(6,6,18,0.95)', borderBottom: '1px solid rgba(99,102,241,0.15)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => nav('/feed')}>
                    <img src="/phn-logo.svg" alt="PHN" style={{ width: 28, height: 28 }} />
                    <div><div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: 1 }}>PHN</div><div style={{ fontSize: 9, color: '#4B5563', letterSpacing: 2 }}>PROOF OF HELP</div></div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(10,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>LIVE · Block #{blockHeight}</span>
                    </div>
                    <button onClick={() => nav('/feed')} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #1F2937', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>← Feed</button>
                </div>
            </nav>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px' }}>
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 32, color: '#fff', marginBottom: 8 }}>Reputation Explorer</h1>
                    <p style={{ fontSize: 15, color: '#6B7280' }}>Every PHN transaction permanently recorded on Canopy blockchain.</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                    {[
                        { label: 'Total Transactions', value: txs.length, color: '#6366F1' },
                        { label: 'Blocks Scanned', value: scannedHeight > 0 ? 30 : 0, color: '#8B5CF6' },
                        { label: 'Current Block', value: blockHeight, color: '#10B981' },
                        { label: 'PHN Tx Types', value: txTypes.length, color: '#F59E0B' },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color, marginBottom: 4 }}>{value}</div>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                    <button onClick={() => setFilter('all')} style={{ padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, border: filter === 'all' ? '1px solid #6366F1' : '1px solid #1F2937', background: filter === 'all' ? 'rgba(99,102,241,0.15)' : 'transparent', color: filter === 'all' ? '#818CF8' : '#6B7280', cursor: 'pointer' }}>
                        All ({txs.length})
                    </button>
                    {txTypes.map(type => (
                        <button key={type} onClick={() => setFilter(type)} style={{
                            padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                            border: filter === type ? `1px solid ${TX_COLORS[type] || '#6366F1'}` : '1px solid #1F2937',
                            background: filter === type ? `${TX_COLORS[type] || '#6366F1'}15` : 'transparent',
                            color: filter === type ? (TX_COLORS[type] || '#818CF8') : '#6B7280', cursor: 'pointer'
                        }}>
                            {type} ({txs.filter(t => t.messageType === type).length})
                        </button>
                    ))}
                </div>

                {/* Transactions */}
                <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid #1A1A2E', borderRadius: 20, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #1A1A2E', display: 'flex', gap: 16, fontSize: 11, fontWeight: 700, color: '#4B5563', letterSpacing: 1 }}>
                        <div style={{ width: 120 }}>TYPE</div>
                        <div style={{ flex: 1 }}>TX HASH</div>
                        <div style={{ width: 120 }}>SENDER</div>
                        <div style={{ width: 80, textAlign: 'right' }}>BLOCK</div>
                    </div>

                    {loading ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>⛓️</div>
                            Scanning Canopy blocks...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>
                            No transactions found
                        </div>
                    ) : (
                        filtered.map((tx, i) => {
                            const color = TX_COLORS[tx.messageType] || '#6B7280';
                            return (
                                <div key={i} style={{ padding: '14px 24px', borderBottom: i < filtered.length - 1 ? '1px solid #0D0D1E' : 'none', display: 'flex', gap: 16, alignItems: 'center', transition: 'background 0.2s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.04)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                                >
                                    <div style={{ width: 120 }}>
                                        <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: `${color}15`, color, border: `1px solid ${color}30`, fontFamily: 'monospace' }}>
                                            {tx.messageType || 'send'}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1, fontSize: 12, color: '#818CF8', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {tx.txHash}
                                    </div>
                                    <div style={{ width: 120, fontSize: 12, color: '#9CA3AF', cursor: 'pointer' }} onClick={() => nav(`/profile/${tx.sender}`)}>
                                        {getUsername(tx.sender)}
                                    </div>
                                    <div style={{ width: 80, fontSize: 12, color: '#4B5563', textAlign: 'right', fontFamily: 'monospace' }}>
                                        #{tx.height || tx.blockHeight}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div style={{ marginTop: 16, fontSize: 12, color: '#4B5563', textAlign: 'center' }}>
                    Auto-refreshing every 8 seconds · Showing last 100 blocks · Canopy v0.1.18+beta
                </div>

                {/* Terminal display */}
                <div style={{ marginTop: 24, background: '#000', border: '1px solid #10B981', borderRadius: 16, overflow: 'hidden' }}>
                    <div style={{ padding: '10px 20px', borderBottom: '1px solid #0D2B1A', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                        <span style={{ marginLeft: 8, fontSize: 11, color: '#10B981', fontFamily: 'monospace' }}>canopy@phn ~ transaction-stream</span>
                    </div>
                    <div style={{ padding: '16px 20px', maxHeight: 280, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
                        {filtered.length === 0 ? (
                            <div style={{ color: '#10B981' }}>$ Waiting for transactions...</div>
                        ) : filtered.slice(0, 30).map((tx, i) => {
                            const color = TX_COLORS[tx.messageType] || '#6B7280';
                            return (
                                <div key={i} style={{ marginBottom: 6, lineHeight: 1.6 }}>
                                    <span style={{ color: '#4B5563' }}>[block:{tx.height || tx.blockHeight}] </span>
                                    <span style={{ color }}>TX:{tx.messageType} </span>
                                    <span style={{ color: '#6B7280' }}>from:{tx.sender?.slice(0,8)}... </span>
                                    <span style={{ color: '#818CF8' }}>hash:{tx.txHash?.slice(0,12)}...</span>
                                </div>
                            );
                        })}
                        <div style={{ color: '#10B981', marginTop: 8 }}>$ _</div>
                    </div>
                </div>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
    );
}
