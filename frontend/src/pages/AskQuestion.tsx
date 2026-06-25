import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { txCreateQuestion } from '../utils/transactions';
import { waitForTx } from '../utils/rpc';

const CATEGORIES = ['Development', 'Crypto', 'Business', 'Design', 'Writing', 'General'];

export default function AskQuestion() {
    const nav = useNavigate();
    const { wallet, updateBalance, deductFee } = useWallet();
    const [searchParams] = useSearchParams();
    const tribeId = searchParams.get('tribeId') || '';
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Development');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [txHash, setTxHash] = useState('');
    const [done, setDone] = useState(false);

    const handleSubmit = async () => {
        if (!wallet.isConnected) { nav('/'); return; }
        if (!title.trim()) { setError('Title is required'); return; }
        if (!content.trim()) { setError('Question content is required'); return; }
        setError('');
        setLoading(true);
        try {
            const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
            const hash = await txCreateQuestion(
                wallet.address, title, content, category, tagList,
                wallet.publicKey, wallet.privateKey, tribeId
            );
            setTxHash(hash);
            await waitForTx(wallet.address, hash, 60000);
            deductFee(1000);
            setDone(true);
        } catch (err: any) {
            setError(err.message || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '14px 18px', borderRadius: 12,
        background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937',
        color: '#F9FAFB', fontSize: 15, fontFamily: 'Inter, sans-serif',
        outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
    };

    return (
        <div style={{ background: '#060612', minHeight: '100vh', fontFamily: 'Inter,sans-serif', color: '#F9FAFB' }}>
            {/* Simple navbar */}
            <nav style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 32px', background: 'rgba(6,6,18,0.95)', borderBottom: '1px solid rgba(99,102,241,0.15)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => nav('/feed')}>
                    <img src="/phn-logo.svg" alt="PHN" style={{ width: 28, height: 28 }} />
                    <div><div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: 1 }}>PHN</div><div style={{ fontSize: 9, color: '#4B5563', letterSpacing: 2 }}>PROOF OF HELP</div></div>
                </div>
                <button onClick={() => nav('/feed')} style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #1F2937', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>
                    {tribeId ? '← Back to Tribe' : '← Back to Feed'}
                </button>
            </nav>

            <div style={{ maxWidth: 720, margin: '0 auto', padding: '90px 24px 60px' }}>
                {!done ? (
                    <>
                        <div style={{ marginBottom: 32 }}>
                            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 32, color: '#fff', marginBottom: 8 }}>Ask a Question</h1>
                            <p style={{ fontSize: 15, color: '#6B7280' }}>Your question will be permanently recorded on Canopy blockchain.</p>
                        </div>

                        <div style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Title */}
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8, display: 'block' }}>QUESTION TITLE *</label>
                                <input style={inputStyle} placeholder="What is your question? Be specific."
                                    value={title} onChange={e => setTitle(e.target.value)}
                                    onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                    onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8, display: 'block' }}>DETAILS *</label>
                                <textarea style={{ ...inputStyle, height: 180, resize: 'vertical' }}
                                    placeholder="Explain your question in detail. Include what you've tried, what you expect, and what actually happens..."
                                    value={content} onChange={e => setContent(e.target.value)}
                                    onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                    onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8, display: 'block' }}>CATEGORY</label>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {CATEGORIES.map(cat => (
                                        <button key={cat} onClick={() => setCategory(cat)} style={{
                                            padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                                            border: category === cat ? '1px solid #6366F1' : '1px solid #1F2937',
                                            background: category === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
                                            color: category === cat ? '#818CF8' : '#6B7280',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}>{cat}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, marginBottom: 8, display: 'block' }}>TAGS</label>
                                <input style={inputStyle} placeholder="react, hooks, typescript..."
                                    value={tags} onChange={e => setTags(e.target.value)}
                                    onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                    onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                                />
                                <div style={{ fontSize: 12, color: '#4B5563', marginTop: 6 }}>Separate with commas</div>
                            </div>

                            {/* Wallet info */}
                            <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(6,6,18,0.8)', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                                        {wallet.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{wallet.username}</div>
                                        <div style={{ fontSize: 11, color: '#4B5563' }}>{wallet.trustScore} CRED · {wallet.balance.toLocaleString()} PROOFH</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: 12, color: '#4B5563' }}>Fee: 1,000 PROOFH</div>
                            </div>

                            {error && (
                                <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: 13, color: '#EF4444' }}>
                                    {error}
                                </div>
                            )}

                            <button onClick={handleSubmit} disabled={loading} style={{
                                width: '100%', padding: '16px', borderRadius: 12,
                                background: loading ? '#1F2937' : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                                border: 'none', color: loading ? '#6B7280' : '#fff',
                                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                fontFamily: 'Syne,sans-serif', transition: 'all 0.2s',
                                boxShadow: loading ? 'none' : '0 0 30px rgba(99,102,241,0.3)'
                            }}>
                                {loading ? '⏳ Submitting to Canopy...' : '⛓️ Post Question Onchain →'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(10,10,25,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20 }}>
                        <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: '#fff', marginBottom: 12 }}>Question Posted Onchain!</h2>
                        <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 24, lineHeight: 1.6 }}>
                            Your question is permanently recorded on Canopy blockchain.
                            The community can now answer and earn CRED.
                        </p>
                        <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(6,6,18,0.8)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 28, textAlign: 'left' }}>
                            <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 4 }}>TX HASH</div>
                            <div style={{ fontSize: 12, color: '#818CF8', fontFamily: 'monospace', wordBreak: 'break-all' }}>{txHash}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button onClick={() => nav('/feed')} style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne,sans-serif' }}>
                                View Feed →
                            </button>
                            <button onClick={() => { setDone(false); setTitle(''); setContent(''); setTags(''); setTxHash(''); }} style={{ padding: '12px 28px', borderRadius: 12, background: 'transparent', border: '1px solid #1F2937', color: '#9CA3AF', fontSize: 14, cursor: 'pointer' }}>
                                Ask Another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
