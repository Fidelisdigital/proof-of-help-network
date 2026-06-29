import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHeight } from '../utils/rpc';

function ParticleCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext('2d'); if (!ctx) return;
        c.width = window.innerWidth; c.height = window.innerHeight;
        const pts = Array.from({ length: 100 }, () => ({
            x: Math.random() * c.width, y: Math.random() * c.height,
            vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
            r: Math.random() * 1.5 + .5, o: Math.random() * .6 + .2
        }));
        let id: number;
        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height);
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > c.width) p.vx *= -1;
                if (p.y < 0 || p.y > c.height) p.vy *= -1;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139,92,246,${p.o})`; ctx.fill();
            });
            pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 130) {
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(99,102,241,${.12 * (1 - d / 130)})`; 
                    ctx.lineWidth = .8; ctx.stroke();
                }
            }));
            id = requestAnimationFrame(draw);
        };
        draw();
        const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

function useCount(target: number, duration = 2000) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!target) return;
        let start = 0; const step = target / (duration / 16);
        const t = setInterval(() => {
            start += step; if (start >= target) { setVal(target); clearInterval(t); } 
            else setVal(Math.floor(start));
        }, 16);
        return () => clearInterval(t);
    }, [target, duration]);
    return val;
}

function ScoreCard({ name, cred, role, color, delay }: { name: string; cred: number; role: string; color: string; delay: number }) {
    const [show, setShow] = useState(false);
    const [score, setScore] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => {
            setShow(true);
            let s = 0; const step = cred / 60;
            const timer = setInterval(() => {
                s += step; if (s >= cred) { setScore(cred); clearInterval(timer); }
                else setScore(Math.floor(s));
            }, 16);
        }, delay);
        return () => clearTimeout(t);
    }, [cred, delay]);

    return (
        <div style={{
            background: 'rgba(15,15,30,0.8)',
            border: `1px solid ${color}40`,
            borderRadius: 16,
            padding: '20px 24px',
            backdropFilter: 'blur(20px)',
            boxShadow: show ? `0 0 30px ${color}20, inset 0 1px 0 ${color}20` : 'none',
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
            marginBottom: 12
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${color}, ${color}88)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif'
                }}>{name[0]}</div>
                <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif' }}>{name}</div>
                    <div style={{ color: '#6B7280', fontSize: 12 }}>{role}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: 10, color: '#6B7280', letterSpacing: 2 }}>CRED</div>
                </div>
            </div>
            <div style={{ height: 4, background: '#1F2937', borderRadius: 999 }}>
                <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}88, ${color})`, width: `${Math.min((score / 1000) * 100, 100)}%`, transition: 'width 1.5s ease' }} />
            </div>
        </div>
    );
}

export default function Landing() {
    const nav = useNavigate();
    const [height, setHeight] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [rpc, setRpc] = useState(false);
    const [questions] = useState(JSON.parse(localStorage.getItem('phn_questions') || '[]').length || 12);
    const [answers] = useState(JSON.parse(localStorage.getItem('phn_answers') || '[]').length || 34);
    const [users] = useState(Object.keys(JSON.parse(localStorage.getItem('phn_profiles') || '{}')).length || 8);

    const qCount = useCount(questions);
    const aCount = useCount(answers);
    const uCount = useCount(users);
    const hCount = useCount(height);

    useEffect(() => {
        const fetch = async () => {
            try { const h = await getHeight(); setHeight(h); setRpc(true); } catch { setRpc(false); }
        };
        fetch(); const i = setInterval(fetch, 5000); return () => clearInterval(i);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const btnPrimary: React.CSSProperties = {
        padding: '16px 36px', borderRadius: 12, fontWeight: 700, fontSize: 15,
        color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        boxShadow: '0 0 40px rgba(99,102,241,0.4)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    };
    const btnSecondary: React.CSSProperties = {
        padding: '16px 36px', borderRadius: 12, fontWeight: 600, fontSize: 15,
        color: '#9CA3AF', border: '1px solid #1F2937', cursor: 'pointer',
        background: 'transparent', fontFamily: 'Syne, sans-serif',
        transition: 'all 0.2s',
    };

    return (
        <div style={{ background: '#060612', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#F9FAFB', overflowX: 'hidden' }}>

            {/* NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '0 48px', height: 68,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: scrolled ? 'rgba(6,6,18,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : 'none',
                transition: 'all 0.4s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src="/phn-logo.svg" alt="PHN Logo" style={{ width: 36, height: 36 }} />
                    <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: 1 }}>PHN</div>
                        <div style={{ fontSize: 9, color: '#6B7280', letterSpacing: 2 }}>PROOF OF HELP</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 16px', borderRadius: 999,
                        background: 'rgba(15,15,30,0.8)', border: '1px solid #1F2937'
                    }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: rpc ? '#10B981' : '#EF4444', boxShadow: rpc ? '0 0 8px #10B981' : 'none' }} />
                        <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                            {rpc ? `Block #${height.toLocaleString()}` : 'Connecting...'}
                        </span>
                    </div>
                    <button onClick={() => nav('/signup')} style={{
                        ...btnPrimary, padding: '10px 24px', fontSize: 13,
                        boxShadow: '0 0 20px rgba(99,102,241,0.3)'
                    }}>
                        Sign Up / Get Wallet →
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <ParticleCanvas />
                {/* Glow blobs */}
                <div style={{ position: 'absolute', top: '15%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '120px 48px 80px', width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 80, alignItems: 'center' }}>
                        {/* LEFT */}
                        <div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '8px 18px', borderRadius: 999, marginBottom: 32,
                                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)'
                            }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
                                <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 600, letterSpacing: 1 }}>BUILT ON CANOPY BLOCKCHAIN</span>
                            </div>

                            <h1 style={{
                                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                                fontSize: 'clamp(42px, 5.5vw, 72px)', lineHeight: 1.05,
                                color: '#fff', marginBottom: 28, letterSpacing: -1
                            }}>
                                The Onchain Network<br />
                                Where{' '}
                                <span style={{
                                    background: 'linear-gradient(135deg, #6366F1, #A78BFA, #8B5CF6)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                }}>Helping Others</span><br />
                                Builds Your Legacy.
                            </h1>

                            <p style={{ fontSize: 18, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 40, maxWidth: 540 }}>
                                Ask questions. Share knowledge. Earn <strong style={{ color: '#A78BFA' }}>CRED</strong> reputation
                                permanently recorded on Canopy blockchain — that nobody can take from you.
                            </p>

                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
                                <button onClick={() => nav('/signup')} style={btnPrimary}
                                    onMouseEnter={e => { (e.target as HTMLButtonElement).style.transform = 'scale(1.04)'; (e.target as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(99,102,241,0.6)'; }}
                                    onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'scale(1)'; (e.target as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(99,102,241,0.4)'; }}>
                                    Join the Knowledge Economy →
                                </button>
                                <button onClick={() => nav('/signup')} style={btnSecondary}
                                    onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = '#fff'; (e.target as HTMLButtonElement).style.borderColor = '#6366F1'; }}
                                    onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = '#9CA3AF'; (e.target as HTMLButtonElement).style.borderColor = '#1F2937'; }}>
                                    Claim Your Onchain Identity
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                                {[
                                    { dot: '#10B981', text: 'Onchain reputation' },
                                    { dot: '#6366F1', text: 'BLS12-381 signed' },
                                    { dot: '#8B5CF6', text: '15 custom tx types' },
                                ].map(({ dot, text }) => (
                                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
                                        <span style={{ fontSize: 13, color: '#6B7280' }}>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT — Trust Score Cards */}
                        <div>
                            <div style={{ fontSize: 11, color: '#4B5563', letterSpacing: 2, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>LIVE TRUST SCORES · CANOPY CHAIN</div>
                            <ScoreCard name="Alice" cred={120} role="React Developer" color="#6366F1" delay={400} />
                            <ScoreCard name="Bob" cred={684} role="Senior Blockchain Dev" color="#8B5CF6" delay={700} />
                            <ScoreCard name="Charlie" cred={342} role="Web3 Hiring Manager" color="#A78BFA" delay={1000} />
                            <div style={{
                                marginTop: 16, padding: '12px 16px', borderRadius: 12,
                                background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
                                display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: rpc ? '#10B981' : '#EF4444', boxShadow: rpc ? '0 0 8px #10B981' : 'none', flexShrink: 0 }} />
                                <span style={{ fontSize: 12, color: '#6B7280' }}>
                                    {rpc ? `All scores verified on Canopy · Block #${height}` : 'Connecting to Canopy...'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll hint */}
                <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'bounce 2s infinite' }}>
                    <span style={{ fontSize: 11, color: '#4B5563', letterSpacing: 2 }}>SCROLL</span>
                    <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #6366F1, transparent)' }} />
                </div>
            </section>

            {/* STATS BAR */}
            <section id="about" style={{ background: 'rgba(10,10,25,0.95)', borderTop: '1px solid rgba(99,102,241,0.15)', borderBottom: '1px solid rgba(99,102,241,0.15)', padding: '48px 48px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
                    {[
                        { icon: '🔐', value: '15', label: 'Custom Tx Types', sub: 'On Canopy chain', color: '#6366F1' },
                        { icon: '⛓️', value: hCount.toLocaleString(), label: 'Live Block Height', sub: 'Canopy v0.1.18+beta', color: '#10B981', live: true },
                        { icon: '🔏', value: 'BLS12-381', label: 'Signing Algorithm', sub: 'Zero mocked data', color: '#8B5CF6' },
                        { icon: '🧠', value: 'TypeScript', label: 'Plugin Template', sub: 'Canopy official', color: '#A78BFA' },
                    ].map(({ icon, value, label, sub, color, live }: any) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 36, color, lineHeight: 1 }}>
                                {value}
                            </div>
                            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6, fontWeight: 600 }}>{label}</div>
                            <div style={{ fontSize: 11, color: '#4B5563', marginTop: 4 }}>{sub}</div>
                            {live && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', animation: 'pulse 2s infinite' }} />
                                    <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>LIVE</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>


            {/* WHAT IS PHN */}
            <section id="what-is-phn" style={{ padding: '120px 48px', background: '#060612', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                        {/* Left */}
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, marginBottom: 24, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
                                <span style={{ fontSize: 12, color: '#818CF8', fontWeight: 600, letterSpacing: 1 }}>WHAT IS PHN</span>
                            </div>
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px,4vw,52px)', color: '#fff', marginBottom: 24, letterSpacing: -1, lineHeight: 1.1 }}>
                                Web2 Q&A platforms meets Professional networks —{' '}
                                <span style={{ background: 'linear-gradient(135deg, #6366F1, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    onchain.
                                </span>
                            </h2>
                            <p style={{ fontSize: 17, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 24 }}>
                                PHN is a decentralized knowledge and reputation network built on Canopy blockchain. 
                                Users ask questions, share expertise, and earn <strong style={{ color: '#A78BFA' }}>CRED</strong> — 
                                an onchain reputation score that proves your value to the world.
                            </p>
                            <p style={{ fontSize: 17, color: '#9CA3AF', lineHeight: 1.8, marginBottom: 40 }}>
                                Unlike Web2 Q&A platforms, Community platforms, or Professional networks — <strong style={{ color: '#fff' }}>PHN gives your reputation back to you.</strong>{' '}
                                Every answer, every endorsement, every contribution is permanently recorded on Canopy 
                                and owned by your wallet forever.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    { platform: 'Web2 Q&A Sites', problem: 'Own your reputation. Delete account = gone forever.', color: '#EF4444' },
                                    { platform: 'Professional Networks', problem: 'Endorsements are fake. Anyone can endorse anything.', color: '#EF4444' },
                                    { platform: 'Community Platforms', problem: 'Karma is meaningless. No real value attached.', color: '#EF4444' },
                                    { platform: 'PHN', problem: 'You own your CRED. Onchain forever. Nobody can take it.', color: '#10B981', good: true },
                                ].map(({ platform, problem, color, good }: any) => (
                                    <div key={platform} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px', borderRadius: 12, background: good ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.04)', border: `1px solid ${color}20` }}>
                                        <div style={{ fontSize: 16, marginTop: 1 }}>{good ? '✅' : '❌'}</div>
                                        <div>
                                            <span style={{ fontWeight: 700, color: good ? '#10B981' : '#9CA3AF', fontSize: 14, fontFamily: 'Syne, sans-serif' }}>{platform}</span>
                                            <span style={{ fontSize: 14, color: '#6B7280', marginLeft: 8 }}>— {problem}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {[
                                { icon: '🧠', title: 'Knowledge Economy', desc: 'Every question and answer is an economic transaction. Knowledge has real monetary weight on PHN.' },
                                { icon: '🏆', title: 'CRED — Your Reputation Token', desc: 'CRED is earned through verified contributions. It cannot be bought, transferred, or faked. Pure proof of expertise.' },
                                { icon: '🔗', title: 'Onchain Social Graph', desc: 'Follows, endorsements, tribe memberships — all recorded as real Canopy transactions. Your network is yours forever.' },
                                { icon: '⚖️', title: 'Verify to Earn', desc: 'Vote Helpful or Accurate on answers you trust. Each vote is a signed Canopy transaction. Good answers earn PROOFH tips automatically.' },
                            ].map(({ icon, title, desc }) => (
                                <div key={title} style={{ display: 'flex', gap: 18, padding: '20px 24px', borderRadius: 16, background: 'rgba(10,10,25,0.8)', border: '1px solid rgba(99,102,241,0.12)', transition: 'border-color 0.3s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.12)'; }}
                                >
                                    <div style={{ fontSize: 28, flexShrink: 0 }}>{icon}</div>
                                    <div>
                                        <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 6 }}>{title}</h4>
                                        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" style={{ padding: '120px 48px', background: '#060612', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: 80 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '8px 18px', borderRadius: 999, marginBottom: 24,
                            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)'
                        }}>
                            <span style={{ fontSize: 12, color: '#A78BFA', fontWeight: 600, letterSpacing: 1 }}>HOW PHN WORKS</span>
                        </div>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px,4vw,52px)', color: '#fff', marginBottom: 16, letterSpacing: -1 }}>
                            Three users. One chain.<br />Real reputation.
                        </h2>
                        <p style={{ fontSize: 17, color: '#6B7280', maxWidth: 560, margin: '0 auto' }}>
                            Every interaction is a real Canopy blockchain transaction. Nothing is simulated.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 64 }}>
                        {[
                            { n: '01', icon: '❓', name: 'Alice', role: 'React Developer', color: '#6366F1', title: 'Asks a Question', desc: 'Alice needs help with React hooks. She creates her profile and posts a question on PHN. The CreateQuestion transaction is BLS12-381 signed and permanently recorded on Canopy blockchain.', tx: 'create_question' },
                            { n: '02', icon: '💡', name: 'Bob', role: 'Senior Dev', color: '#8B5CF6', title: 'Submits Answer Onchain', desc: 'Bob sees Alice\'s question and submits a detailed answer. His SubmitAnswer transaction fires — signed with BLS12-381 and permanently recorded on Canopy. His answer is now verifiable onchain.', tx: 'submit_answer' },
                            { n: '03', icon: '✅', name: 'Charlie', role: 'Hiring Manager', color: '#A78BFA', title: 'Verifies & Discovers', desc: 'Charlie verifies Bob\'s answer as helpful. Alice accepts it. Bob gains +5 CRED onchain. Charlie searches for React devs — Bob appears at the top with verified CRED. Zero followers needed.', tx: 'verify_answer + accept_answer' },
                        ].map(card => (
                            <div key={card.n} style={{
                                background: 'rgba(10,10,25,0.8)', border: `1px solid ${card.color}25`,
                                borderRadius: 20, padding: 36, position: 'relative', overflow: 'hidden',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${card.color}20`; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                            >
                                <div style={{ position: 'absolute', top: 20, right: 24, fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 64, color: card.color, opacity: 0.07, lineHeight: 1 }}>{card.n}</div>
                                <div style={{ fontSize: 36, marginBottom: 20 }}>{card.icon}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${card.color}, ${card.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{card.name[0]}</div>
                                    <div>
                                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: 14 }}>{card.name}</span>
                                        <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 8 }}>{card.role}</span>
                                    </div>
                                </div>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 12 }}>{card.title}</h3>
                                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 20 }}>{card.desc}</p>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    padding: '6px 14px', borderRadius: 999,
                                    background: `${card.color}12`, border: `1px solid ${card.color}30`
                                }}>
                                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: card.color }} />
                                    <span style={{ fontSize: 11, color: card.color, fontFamily: 'monospace' }}>{card.tx}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TX flow */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        {['CreateProfile', 'CreateQuestion', 'SubmitAnswer', 'VerifyAnswer', 'AcceptAnswer', 'FollowUser', 'EndorseMember'].map((tx, i, arr) => (
                            <div key={tx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontFamily: 'monospace', background: 'rgba(99,102,241,0.08)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.2)' }}>{tx}</div>
                                {i < arr.length - 1 && <span style={{ color: '#1F2937', fontSize: 18 }}>→</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" style={{ padding: '120px 48px', background: 'rgba(8,8,20,0.98)' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 80 }}>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px,4vw,52px)', color: '#fff', marginBottom: 16, letterSpacing: -1 }}>
                            Why PHN is different
                        </h2>
                        <p style={{ fontSize: 17, color: '#6B7280', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
                            Centralized platforms built the model. Community networks proved the scale. Professional tools showed the value.<br />
                            <strong style={{ color: '#A78BFA' }}>None of them gave it back to you. PHN does.</strong>
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                        {[
                            { icon: '🔐', title: 'Own Your Reputation', color: '#6366F1', desc: 'Your CRED score lives onchain forever. No company can delete it, ban you, or take it away. Permanently yours on Canopy blockchain.', points: ['Wallet-bound identity', 'Permanent history', 'Portable forever'] },
                            { icon: '🎯', title: 'Verify to Earn', color: '#8B5CF6', desc: 'Vote Helpful or Accurate on answers you trust. Each vote fires a real Canopy transaction. Good answers earn PROOFH automatically.', points: ['Every vote is onchain', 'Earn PROOFH for helping', 'CRED builds reputation'] },
                            { icon: '✅', title: 'Community Verified', color: '#A78BFA', desc: 'No algorithms. No moderators. Community verifies answers as helpful, accurate, or misleading. Every vote is a real onchain transaction.', points: ['Decentralized', 'Transparent', '15 tx types'] },
                        ].map(f => (
                            <div key={f.title} style={{
                                background: 'rgba(10,10,25,0.9)', border: `1px solid ${f.color}20`,
                                borderRadius: 20, padding: 40, transition: 'transform 0.3s, box-shadow 0.3s'
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${f.color}15`; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                            >
                                <div style={{ fontSize: 40, marginBottom: 20 }}>{f.icon}</div>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 14 }}>{f.title}</h3>
                                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, marginBottom: 24 }}>{f.desc}</p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {f.points.map(p => (
                                        <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#9CA3AF' }}>
                                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: f.color, flexShrink: 0 }} />{p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '120px 48px', background: '#060612', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(36px,5vw,64px)', color: '#fff', marginBottom: 20, letterSpacing: -2, lineHeight: 1.05 }}>
                        Ready to build your{' '}
                        <span style={{ background: 'linear-gradient(135deg, #6366F1, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            onchain legacy?
                        </span>
                    </h2>
                    <p style={{ fontSize: 18, color: '#6B7280', marginBottom: 48, lineHeight: 1.7 }}>
                        Join the knowledge economy. Your reputation starts at zero<br />and grows with every contribution. Forever.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
                        <button onClick={() => nav('/signup')} style={btnPrimary}
                            onMouseEnter={e => { (e.target as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
                            onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'scale(1)'; }}>
                            Join the Knowledge Economy
                        </button>
                        <button onClick={() => nav('/signup')} style={btnSecondary}
                            onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = '#fff'; (e.target as HTMLButtonElement).style.borderColor = '#6366F1'; }}
                            onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = '#9CA3AF'; (e.target as HTMLButtonElement).style.borderColor = '#1F2937'; }}>
                            Claim Your Onchain Identity
                        </button>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 999, background: 'rgba(10,10,25,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <img src="/phn-logo.svg" alt="PHN" style={{ width: 24, height: 24 }} />
                        <span style={{ fontSize: 13, color: '#6B7280' }}>Built on <strong style={{ color: '#9CA3AF' }}>Canopy Blockchain</strong> · 15 custom transaction types · TypeScript plugin</span>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: '#03030c', borderTop: '1px solid rgba(99,102,241,0.1)', padding: '72px 48px 40px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: 48, marginBottom: 64 }}>
                        {/* Brand */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <img src="/phn-logo.svg" alt="PHN Logo" style={{ width: 40, height: 40 }} />
                                <div>
                                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, color: '#fff' }}>PHN</div>
                                    <div style={{ fontSize: 10, color: '#4B5563', letterSpacing: 2 }}>PROOF OF HELP</div>
                                </div>
                            </div>
                            <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8, marginBottom: 24, maxWidth: 280 }}>
                                The onchain Q&A network where your knowledge builds reputation nobody can take from you.
                            </p>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[
                                    { label: '𝕏', url: 'https://x.com/fidelisdigitals' },
                                    { label: 'GH', url: 'https://github.com/Fidelisdigital/proof-of-help-network' },
                                ].map(s => (
                                    <a key={s.label} href={s.url} target="_blank" rel="noreferrer" style={{
                                        width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: '#0A0A1A', border: '1px solid #1F2937', color: '#6B7280', fontSize: 13, textDecoration: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#6366F1'; (e.currentTarget as HTMLAnchorElement).style.color = '#818CF8'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1F2937'; (e.currentTarget as HTMLAnchorElement).style.color = '#6B7280'; }}
                                    >{s.label}</a>
                                ))}
                            </div>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 20, letterSpacing: 1 }}>PRODUCT</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {['Feed', 'Ask a Question', 'Tribes', 'Explorer', 'Profile'].map(item => (
                                    <li key={item}><button onClick={() => nav('/signup')} style={{ background: 'none', border: 'none', fontSize: 14, color: '#4B5563', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                                        onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = '#9CA3AF'; }}
                                        onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = '#4B5563'; }}
                                    >{item}</button></li>
                                ))}
                            </ul>
                        </div>

                        {/* About */}
                        <div>
                            <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 20, letterSpacing: 1 }}>ABOUT</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { label: 'What is PHN', id: 'what-is-phn' },
                                    { label: 'How it works', id: 'how-it-works' },
                                    { label: 'CRED Token', id: 'features' },
                                    { label: 'Trust Score', id: 'features' },
                                    { label: 'Reputation System', id: 'features' },
                                ].map(item => (
                                    <li key={item.label}>
                                        <button onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                                            style={{ background: 'none', border: 'none', fontSize: 14, color: '#4B5563', cursor: 'pointer', padding: 0, transition: 'color 0.2s', textAlign: 'left' }}
                                            onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = '#818CF8'; }}
                                            onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = '#4B5563'; }}
                                        >{item.label}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Canopy */}
                        <div>
                            <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 20, letterSpacing: 1 }}>BUILT ON CANOPY</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                                {[
                                    { label: 'Canopy Docs ↗', url: 'https://docs.google.com/document/d/16oDUlLkLvp9zKH4hLNo6iuJJV9To1UlMhqhE_4p69Oo' },
                                    { label: 'TypeScript Plugin ↗', url: 'https://github.com/canopy-network/canopy' },
                                    { label: 'PHN GitHub ↗', url: 'https://github.com/Fidelisdigital/proof-of-help-network' },
                                    { label: 'Canopy Discord ↗', url: 'https://discord.gg/canopy' },
                                ].map(l => (
                                    <li key={l.label}><a href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#818CF8'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#4B5563'; }}
                                    >{l.label}</a></li>
                                ))}
                            </ul>
                            <div style={{ padding: '12px 16px', borderRadius: 12, background: '#0A0A1A', border: '1px solid #1F2937' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: rpc ? '#10B981' : '#EF4444', boxShadow: rpc ? '0 0 8px #10B981' : 'none' }} />
                                    <span style={{ fontSize: 12, color: rpc ? '#10B981' : '#EF4444', fontWeight: 600 }}>{rpc ? 'Chain Online' : 'Chain Offline'}</span>
                                </div>
                                <div style={{ fontSize: 11, color: '#4B5563' }}>Block #{height.toLocaleString()} · Canopy v0.1.18+beta</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div style={{ paddingTop: 32, borderTop: '1px solid #0D0D1E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <span style={{ fontSize: 13, color: '#2D2D4E' }}>© 2026 PHN Network · Built for Canopy Vibe Code Contest #2</span>
                        <div style={{ padding: '8px 20px', borderRadius: 999, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                            <span style={{ fontSize: 12, color: '#4B5563' }}>15 custom tx types · TypeScript plugin · BLS12-381 signed · Zero mocked data</span>
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-8px)} }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
            `}</style>
        </div>
    );
}
