import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { keystoreNewKey, keystoreGetKey, waitForTx, getAccount, getTxsByHeight, getHeight } from '../utils/rpc';
import { txCreateProfile, claimFaucet } from '../utils/transactions';

type Step = 'profile' | 'creating' | 'faucet' | 'done';

export default function Signup() {
    const nav = useNavigate();
    const { setWallet } = useWallet();

    const [mode, setMode] = useState<'signup' | 'login'>('signup');
    const [step, setStep] = useState<Step>('profile');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [tags, setTags] = useState('');
    const [password, setPassword] = useState('');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState('');
    const [txHash, setTxHash] = useState('');
    const [address, setAddress] = useState('');
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) => setLog(prev => [...prev, msg]);

    const handleLogin = async () => {
        setError('');
        if (!loginUsername.trim()) { setError('Username is required'); return; }
        if (!loginPassword.trim()) { setError('Password is required'); return; }
        try {
            // First check localStorage cache
            let addr = '';
            const usernameMap = JSON.parse(localStorage.getItem('phn_usernames') || '{}');
            addr = usernameMap[loginUsername.trim().toLowerCase()] || '';

            // If not in localStorage, search chain tx history
            if (!addr) {
                addLog?.('Searching chain for username...');
                try {
                    const height = await getHeight();
                    // Scan recent blocks for create_profile txs
                    for (let h = Math.max(1, height - 500); h <= height; h++) {
                        try {
                            const txs = await getTxsByHeight(h);
                            for (const tx of txs) {
                                if (tx.messageType === 'create_profile') {
                                    const msg = tx.transaction?.msg || {};
                                    if (msg.username?.toLowerCase() === loginUsername.trim().toLowerCase()) {
                                        addr = tx.sender;
                                        // Cache it
                                        const map = JSON.parse(localStorage.getItem('phn_usernames') || '{}');
                                        map[msg.username.toLowerCase()] = addr;
                                        localStorage.setItem('phn_usernames', JSON.stringify(map));
                                        break;
                                    }
                                }
                            }
                            if (addr) break;
                        } catch { /* skip */ }
                    }
                } catch { /* fallback to localStorage only */ }
            }

            if (!addr) { setError('Username not found. Please sign up first.'); return; }
            const keys = await keystoreGetKey(addr, loginPassword);
            if (!keys.privateKey) { setError('Invalid password'); return; }
            const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
            const profile = profiles[addr];
                        const account = await getAccount(addr);
            setWallet({
                address: addr,
                publicKey: keys.publicKey,
                privateKey: keys.privateKey,
                username: profile?.username || loginUsername.trim(),
                balance: (() => {
                    const balances = JSON.parse(localStorage.getItem('phn_balances') || '{}');
                    if (balances[addr] !== undefined && balances[addr] > 0) return balances[addr];
                    return account?.amount || 50000;
                })(),
                trustScore: profile?.reputationScore || 0,
                isConnected: true
            });
            nav('/feed');
        } catch (err: any) {
            setError('Login failed. Check your username and password.');
        }
    };

    const handleSignup = async () => {
        setError('');
        if (!username.trim()) { setError('Username is required'); return; }
        if (!password.trim()) { setError('Password is required to secure your wallet'); return; }
        if (username.length < 3) { setError('Username must be at least 3 characters'); return; }
        // Check duplicate username
        const existingMap = JSON.parse(localStorage.getItem('phn_usernames') || '{}');
        if (existingMap[username.toLowerCase()]) { setError('Username already taken. Please choose another.'); return; }

        setStep('creating');
        setLog([]);

        try {
            // Step 1: Create wallet
            addLog('Creating your Canopy wallet...');
            const addr = await keystoreNewKey(username.toLowerCase().replace(/\s/g, '_') + '_' + Date.now(), password);
            setAddress(addr);
            addLog(`✅ Wallet created: ${addr.slice(0, 8)}...${addr.slice(-6)}`);

            // Step 2: Get keys
            addLog('Retrieving wallet keys...');
            const keys = await keystoreGetKey(addr, password);
            addLog('✅ Keys retrieved');

            // Step 3: Claim faucet
            setStep('faucet');
            addLog('Claiming 50,000 PROOFH from faucet...');
            let faucetOk = false;
            try {
                const faucetHash = await claimFaucet(addr);
                addLog(`✅ Faucet tx: ${faucetHash.slice(0, 16)}...`);
                addLog('Waiting for faucet confirmation (~15s)...');
                faucetOk = await waitForTx('c0d8caf3fc48cbcc685a6a0b3004eaf28a23663b', faucetHash, 60000);
                if (faucetOk) {
                    addLog('✅ Faucet confirmed! You have 50,000 PROOFH');
                } else {
                    throw new Error('Faucet timed out — check Canopy node is running');
                }
            } catch (faucetErr: any) {
                addLog(`⚠️ Faucet error: ${faucetErr?.message || 'unknown'} — continuing signup`);
            }

            // Step 4: Create profile
            addLog('Creating your onchain profile...');
            const expertiseTags = tags.split(',').map(t => t.trim()).filter(Boolean);
            const profileHash = await txCreateProfile(
                addr, username, bio, expertiseTags,
                keys.publicKey, keys.privateKey
            );
            setTxHash(profileHash);
            addLog(`✅ Profile tx: ${profileHash.slice(0, 16)}...`);

            // Wait for profile
            addLog('Waiting for profile confirmation...');
            await waitForTx(addr, profileHash, 60000);
            addLog('✅ Profile confirmed onchain!');

            // Save username -> address mapping for login
            const usernameMap = JSON.parse(localStorage.getItem('phn_usernames') || '{}');
            usernameMap[username.toLowerCase()] = addr;
            localStorage.setItem('phn_usernames', JSON.stringify(usernameMap));

            // Save to localStorage
            const profiles = JSON.parse(localStorage.getItem('phn_profiles') || '{}');
            profiles[addr] = {
                address: addr,
                username,
                bio,
                expertiseTags,
                reputationScore: 0,
                questionsAsked: 0,
                answersGiven: 0,
                acceptedAnswers: 0,
                endorsements: 0,
                endorsedSkills: {},
                createdAt: Date.now()
            };
            localStorage.setItem('phn_profiles', JSON.stringify(profiles));

            // Save wallet — fetch real balance from chain
            let realBalance = 50000;
            try {
                const acct = await getAccount(addr);
                if (acct.amount > 0) realBalance = acct.amount;
            } catch { /* use default */ }
            setWallet({
                address: addr,
                publicKey: keys.publicKey,
                privateKey: keys.privateKey,
                username,
                balance: realBalance,
                trustScore: 0,
                isConnected: true
            });

            setStep('done');
            addLog('🎉 Welcome to PHN!');

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            setStep('profile');
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '14px 18px', borderRadius: 12,
        background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937',
        color: '#F9FAFB', fontSize: 15, fontFamily: 'Inter, sans-serif',
        outline: 'none', transition: 'border-color 0.2s',
        boxSizing: 'border-box'
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 13, fontWeight: 600, color: '#9CA3AF',
        marginBottom: 8, display: 'block', letterSpacing: 0.5
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#060612',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '40px 24px', fontFamily: 'Inter, sans-serif',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Background glow */}
            <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8, cursor: 'pointer' }} onClick={() => nav('/')}>
                        <img src="/phn-logo.svg" alt="PHN" style={{ width: 40, height: 40 }} />
                        <div>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: 1 }}>PHN</div>
                            <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: 2 }}>PROOF OF HELP</div>
                        </div>
                    </div>
                </div>

                {/* Mode toggle */}
                <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: 'rgba(10,10,25,0.8)', border: '1px solid #1F2937', borderRadius: 12, padding: 4 }}>
                    {(['signup', 'login'] as const).map(m => (
                        <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                            flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                            background: mode === m ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : 'transparent',
                            color: mode === m ? '#fff' : '#6B7280', fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'Syne,sans-serif', letterSpacing: 0.5,
                            transition: 'all 0.2s'
                        }}>
                            {m === 'signup' ? '✨ Create Account' : '🔑 Login'}
                        </button>
                    ))}
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(10,10,25,0.9)', border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: 24, padding: '40px 40px',
                    boxShadow: '0 0 60px rgba(99,102,241,0.08)'
                }}>

                    {mode === 'login' && (
                        <>
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, color: '#fff', marginBottom: 8, textAlign: 'center' }}>
                                Welcome back
                            </h2>
                            <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>
                                Enter your username and password<br />to access your PHN account.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={labelStyle}>USERNAME</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="e.g. alice"
                                        value={loginUsername}
                                        onChange={e => setLoginUsername(e.target.value)}
                                        onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                        onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>PASSWORD</label>
                                    <input
                                        type="password"
                                        style={inputStyle}
                                        placeholder="Your wallet password"
                                        value={loginPassword}
                                        onChange={e => setLoginPassword(e.target.value)}
                                        onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                        onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                                    />
                                </div>
                                {error && (
                                    <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: 13, color: '#EF4444' }}>
                                        {error}
                                    </div>
                                )}
                                <button onClick={handleLogin} style={{
                                    width: '100%', padding: '16px', borderRadius: 12,
                                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                    border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                                    cursor: 'pointer', fontFamily: 'Syne, sans-serif',
                                    boxShadow: '0 0 30px rgba(99,102,241,0.3)'
                                }}>
                                    Login to PHN →
                                </button>
                            </div>
                        </>
                    )}

                    {mode === 'signup' && (<>
                    {/* Steps indicator */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                        {[
                            { key: 'profile', label: '1' },
                            { key: 'creating', label: '2' },
                            { key: 'faucet', label: '3' },
                            { key: 'done', label: '4' },
                        ].map(({ key, label }) => {
                            const steps = ['profile', 'creating', 'faucet', 'done'];
                            const current = steps.indexOf(step);
                            const thisStep = steps.indexOf(key);
                            const isActive = thisStep === current;
                            const isDone = thisStep < current;
                            return (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 700,
                                        background: isDone ? '#6366F1' : isActive ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : 'rgba(15,15,30,0.8)',
                                        border: isActive ? '2px solid #8B5CF6' : isDone ? '2px solid #6366F1' : '2px solid #1F2937',
                                        color: isDone || isActive ? '#fff' : '#4B5563',
                                        boxShadow: isActive ? '0 0 16px rgba(99,102,241,0.5)' : 'none',
                                        transition: 'all 0.3s'
                                    }}>
                                        {isDone ? '✓' : label}
                                    </div>
                                    {key !== 'done' && <div style={{ width: 24, height: 1, background: isDone ? '#6366F1' : '#1F2937' }} />}
                                </div>
                            );
                        })}
                    </div>

                    {/* STEP 1: Profile form */}
                    {step === 'profile' && (
                        <>
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, color: '#fff', marginBottom: 8, textAlign: 'center' }}>
                                Create your identity
                            </h2>
                            <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>
                                Your profile lives onchain forever.<br />A Canopy wallet is created automatically.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={labelStyle}>USERNAME *</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="e.g. alice_dev"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                        onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>BIO</label>
                                    <textarea
                                        style={{ ...inputStyle, height: 88, resize: 'none' }}
                                        placeholder="Tell the community what you know..."
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                        onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>EXPERTISE TAGS</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="react, blockchain, design, AI..."
                                        value={tags}
                                        onChange={e => setTags(e.target.value)}
                                        onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                        onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                                    />
                                    <div style={{ fontSize: 12, color: '#4B5563', marginTop: 6 }}>Separate with commas</div>
                                </div>

                                <div>
                                    <label style={labelStyle}>WALLET PASSWORD *</label>
                                    <input
                                        type="password"
                                        style={inputStyle}
                                        placeholder="Secures your Canopy wallet"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        onFocus={e => { e.target.style.borderColor = '#6366F1'; }}
                                        onBlur={e => { e.target.style.borderColor = '#1F2937'; }}
                                    />
                                    <div style={{ fontSize: 12, color: '#4B5563', marginTop: 6 }}>Remember this — needed to sign transactions</div>
                                </div>

                                {error && (
                                    <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: 13, color: '#EF4444' }}>
                                        {error}
                                    </div>
                                )}

                                <button onClick={handleSignup} style={{
                                    width: '100%', padding: '16px', borderRadius: 12,
                                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                    border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                                    cursor: 'pointer', fontFamily: 'Syne, sans-serif',
                                    boxShadow: '0 0 30px rgba(99,102,241,0.3)',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                    onMouseEnter={e => { (e.target as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
                                    onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'scale(1)'; }}
                                >
                                    Create My Onchain Identity →
                                </button>

                                {/* Info */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {[
                                        '🔐 A Canopy wallet is created automatically',
                                        '💰 You receive 50,000 PROOFH to pay fees',
                                        '⛓️ Your profile is recorded onchain forever',
                                    ].map(item => (
                                        <div key={item} style={{ fontSize: 12, color: '#4B5563', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* STEP 2 & 3: Creating */}
                    {(step === 'creating' || step === 'faucet') && (
                        <>
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 8, textAlign: 'center' }}>
                                {step === 'creating' ? 'Creating your identity...' : 'Claiming your PROOFH...'}
                            </h2>
                            <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 32 }}>
                                Submitting transactions to Canopy blockchain
                            </p>

                            {/* Spinner */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: '50%',
                                    border: '3px solid #1F2937',
                                    borderTopColor: '#6366F1',
                                    animation: 'spin 1s linear infinite'
                                }} />
                            </div>

                            {/* Log */}
                            <div style={{ background: 'rgba(6,6,18,0.8)', borderRadius: 12, padding: '16px 20px', border: '1px solid #1F2937', maxHeight: 200, overflowY: 'auto' }}>
                                {log.map((entry, i) => (
                                    <div key={i} style={{ fontSize: 12, color: entry.startsWith('✅') || entry.startsWith('🎉') ? '#10B981' : '#6B7280', marginBottom: 6, fontFamily: 'monospace' }}>
                                        {entry}
                                    </div>
                                ))}
                                {log.length === 0 && <div style={{ fontSize: 12, color: '#4B5563', fontFamily: 'monospace' }}>Initializing...</div>}
                            </div>
                        </>
                    )}

                    {/* STEP 4: Done */}
                    {step === 'done' && (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, color: '#fff', marginBottom: 8 }}>
                                    Welcome to PHN, {username}!
                                </h2>
                                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                                    Your onchain identity is live on Canopy blockchain.
                                </p>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                                {[
                                    { label: 'CRED Score', value: '0', color: '#6366F1' },
                                    { label: 'PROOFH Balance', value: '50,000', color: '#10B981' },
                                    { label: 'Wallet', value: `${address.slice(0,6)}...${address.slice(-4)}`, color: '#8B5CF6' },
                                    { label: 'Status', value: 'Onchain ✓', color: '#10B981' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(6,6,18,0.8)', border: '1px solid #1F2937', textAlign: 'center' }}>
                                        <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 4, letterSpacing: 1 }}>{label}</div>
                                        <div style={{ fontSize: 16, fontWeight: 700, color, fontFamily: 'Syne, sans-serif' }}>{value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* TX Hash */}
                            {txHash && (
                                <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 24 }}>
                                    <div style={{ fontSize: 11, color: '#4B5563', marginBottom: 4 }}>PROFILE TX HASH</div>
                                    <div style={{ fontSize: 12, color: '#818CF8', fontFamily: 'monospace', wordBreak: 'break-all' }}>{txHash}</div>
                                </div>
                            )}

                            {/* Log */}
                            <div style={{ background: 'rgba(6,6,18,0.8)', borderRadius: 12, padding: '12px 16px', border: '1px solid #1F2937', marginBottom: 24, maxHeight: 120, overflowY: 'auto' }}>
                                {log.map((entry, i) => (
                                    <div key={i} style={{ fontSize: 11, color: entry.startsWith('✅') || entry.startsWith('🎉') ? '#10B981' : '#6B7280', marginBottom: 4, fontFamily: 'monospace' }}>
                                        {entry}
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => nav('/feed')} style={{
                                width: '100%', padding: '16px', borderRadius: 12,
                                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'Syne, sans-serif',
                                boxShadow: '0 0 30px rgba(99,102,241,0.3)',
                            }}>
                                Enter PHN Feed →
                            </button>
                        </>
                    )}
                    </>
                    )}
                </div>

                {/* Back link */}
                {step === 'profile' && (
                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', color: '#4B5563', fontSize: 14, cursor: 'pointer' }}>
                            ← Back to home
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
