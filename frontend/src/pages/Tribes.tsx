import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { txCreateTribe, txJoinTribe } from '../utils/transactions';
import { waitForTx } from '../utils/rpc';

const TRIBE_CATEGORIES = ['Builders', 'Writers', 'Designers', 'Crypto', 'Business', 'AI', 'Web3', 'General'];

export default function Tribes() {
    const nav = useNavigate();
    const { wallet, blockHeight } = useWallet();
    const [tribes, setTribes] = useState<any[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Builders');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const t = JSON.parse(localStorage.getItem('phn_tribes') || '[]');
        setTribes(t);
    }, []);

    const handleCreate = async () => {
        if (!wallet.isConnected) { nav('/'); return; }
        if (!name.trim()) return;
        setLoading(true);
        try {
            const hash = await txCreateTribe(wallet.address, name, description, category, wallet.publicKey, wallet.privateKey);
            await waitForTx(wallet.address, hash, 60000);
            const tribeId = `t_${wallet.address.slice(0, 8)}_${Date.now()}`;
            const newTribe = { id: tribeId, creatorAddress: wallet.address, name, description, category, memberCount: 1, createdAt: Date.now() };
            const updated = [...tribes, newTribe];
            localStorage.setItem('phn_tribes', JSON.stringify(updated));
            setTribes(updated);
            setSuccess('Tribe created! TX: ' + hash.slice(0, 16) + '...');
            setShowCreate(false);
            setName(''); setDescription('');
        } catch (e: any) { setSuccess('Error: ' + e.message); }
        setLoading(false);
    };

    const handleJoin = async (tribeId: string) => {
        if (!wallet.isConnected) { nav('/'); return; }
        setLoading(true);
        try {
            const hash = await txJoinTribe(wallet.address, tribeId, wallet.publicKey, wallet.privateKey);
            await waitForTx(wallet.address, hash, 60000);
            const updated = tribes.map(t => t.id === tribeId ? { ...t, memberCount: (t.memberCount || 0) + 1 } : t);
            localStorage.setItem('phn_tribes', JSON.stringify(updated));
            setTribes(updated);
            // Save joined tribes per user
            const joined = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
            if (!joined[wallet.address]) joined[wallet.address] = [];
            if (!joined[wallet.address].includes(tribeId)) joined[wallet.address].push(tribeId);
            localStorage.setItem('phn_joined_tribes', JSON.stringify(joined));
            setSuccess('Joined tribe! TX: ' + hash.slice(0, 16) + '...');
        } catch (e: any) { setSuccess('Error: ' + e.message); }
        setLoading(false);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 16px', borderRadius: 10,
        background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937',
        color: '#F9FAFB', fontSize: 14, fontFamily: 'Inter,sans-serif',
        outline: 'none', boxSizing: 'border-box'
    };

    const allTribes = tribes;

    const CATEGORY_COLORS: Record<string, string> = {
        Builders: '#6366F1', Writers: '#8B5CF6', Designers: '#EC4899',
        Crypto: '#F59E0B', Business: '#10B981', AI: '#06B6D4',
        Web3: '#A78BFA', General: '#9CA3AF'
    };

    return (
        <div style={{ background: '#060612', minHeight: '100vh', fontFamily: 'Inter,sans-serif', color: '#F9FAFB' }}>
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

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 32, color: '#fff', marginBottom: 8 }}>Tribes</h1>
                        <p style={{ fontSize: 15, color: '#6B7280' }}>Communities where knowledge builds collective reputation.</p>
                    </div>
                    <button onClick={() => setShowCreate(!showCreate)} style={{ padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                        + Create Tribe
                    </button>
                </div>

                {success && (
                    <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: 20, fontSize: 13, color: '#10B981' }}>
                        ✅ {success}
                    </div>
                )}

                {/* Create tribe form */}
                {showCreate && (
                    <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: 28, marginBottom: 24 }}>
                        <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 20 }}>Create a New Tribe</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <input style={inputStyle} placeholder="Tribe name" value={name} onChange={e => setName(e.target.value)}
                                onFocus={e => { e.target.style.borderColor = '#6366F1'; }} onBlur={e => { e.target.style.borderColor = '#1F2937'; }} />
                            <textarea style={{ ...inputStyle, height: 80, resize: 'none' }} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}
                                onFocus={e => { e.target.style.borderColor = '#6366F1'; }} onBlur={e => { e.target.style.borderColor = '#1F2937'; }} />
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {TRIBE_CATEGORIES.map(cat => (
                                    <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, border: category === cat ? `1px solid ${CATEGORY_COLORS[cat]}` : '1px solid #1F2937', background: category === cat ? `${CATEGORY_COLORS[cat]}15` : 'transparent', color: category === cat ? CATEGORY_COLORS[cat] : '#6B7280', cursor: 'pointer' }}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={handleCreate} disabled={loading || !name.trim()} style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                    {loading ? '⏳ Creating...' : '⛓️ Create Tribe Onchain'}
                                </button>
                                <button onClick={() => setShowCreate(false)} style={{ padding: '12px 20px', borderRadius: 10, background: 'transparent', border: '1px solid #1F2937', color: '#9CA3AF', fontSize: 14, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tribes grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                    {allTribes.map(tribe => {
                        const color = CATEGORY_COLORS[tribe.category] || '#6366F1';
                        return (
                            <div key={tribe.id} onClick={() => nav(`/tribe/${tribe.id}`)} style={{ background: 'rgba(10,10,25,0.8)', border: `1px solid ${color}20`, borderRadius: 18, padding: 24, transition: 'all 0.2s', cursor: 'pointer' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}50`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}20`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                        {tribe.category === 'Builders' ? '🔨' : tribe.category === 'Web3' ? '🔗' : tribe.category === 'AI' ? '🤖' : tribe.category === 'Writers' ? '✍️' : tribe.category === 'Crypto' ? '₿' : '🏘️'}
                                    </div>
                                    <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: `${color}15`, color, border: `1px solid ${color}30` }}>
                                        {tribe.category}
                                    </span>
                                </div>
                                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 8 }}>{tribe.name}</h3>
                                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 16 }}>{tribe.description}</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 13, color: '#4B5563' }}>👥 {tribe.memberCount} members</span>
                                    {(() => {
                                        const joined = JSON.parse(localStorage.getItem('phn_joined_tribes') || '{}');
                                        const isJoined = joined[wallet.address]?.includes(tribe.id);
                                        const isCreator = tribe.creatorAddress === wallet.address;
                                        return isJoined || isCreator ? (
                                            <span style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 12, fontWeight: 700 }}>
                                                ✅ {isCreator ? 'Creator' : 'Joined'}
                                            </span>
                                        ) : (
                                            <button onClick={() => handleJoin(tribe.id)} disabled={loading} style={{ padding: '7px 16px', borderRadius: 8, background: `${color}15`, border: `1px solid ${color}30`, color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                                Join →
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
