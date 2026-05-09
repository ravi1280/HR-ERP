import { useState } from 'react';
import { Eye, EyeOff, LogIn, Briefcase, Users, CalendarDays, CircleDollarSign, BarChart3, Package } from 'lucide-react';

const FEATURES = [
    { Icon: Users, title: 'Employee Management', sub: 'Profiles, contracts, departments', color: '#60a5fa' },
    { Icon: CalendarDays, title: 'Attendance & Leave', sub: 'Daily tracking with approvals', color: '#34d399' },
    { Icon: CircleDollarSign, title: 'Payroll & Payslips', sub: 'Automated processing & EPF/ETF', color: '#fbbf24' },
    { Icon: BarChart3, title: 'Accounting & Reports', sub: 'Revenue, expenses, P&L', color: '#a78bfa' },
    { Icon: Package, title: 'Inventory Control', sub: 'Stock alerts & reorder workflow', color: '#818cf8' },
];

const DEMO_USERS = [
    { email: 'nisha@nexahr.com', password: 'hr123', name: 'Nisha Perera', role: 'HR Manager', initials: 'NP', avClass: 'av-blue' },
    { email: 'saman@nexahr.com', password: 'dev123', name: 'Saman Kumara', role: 'Sr. Developer', initials: 'SK', avClass: 'av-teal' },
    { email: 'admin@nexahr.com', password: 'admin123', name: 'Admin', role: 'Administrator', initials: 'AD', avClass: 'av-purple' },
];

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            const user = DEMO_USERS.find(u => u.email === email && u.password === password);
            if (user) {
                onLogin(user);
            } else {
                setError('Invalid email or password. Try nisha@nexahr.com / hr123');
                setLoading(false);
            }
        }, 800);
    };

    const fillDemo = (u) => { setEmail(u.email); setPassword(u.password); setError(''); };

    return (
        <div className="login-root">
            {/* Left panel — branding */}
            <div className="login-left">
                <div className="login-brand">
                    <div className="login-logo-icon">
                        <Briefcase size={28} color="#fff" strokeWidth={1.8} />
                    </div>
                    <h1>NexaHR</h1>
                    <p className="login-tagline">SME Suite · v2.0</p>
                </div>
                <div className="login-features">
                    {FEATURES.map(({ Icon, title, sub, color }) => (
                        <div key={title} className="login-feature-row">
                            <div className="login-feature-icon-wrapper" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Icon size={18} strokeWidth={2} />
                            </div>
                            <div>
                                <div className="login-feature-title">{title}</div>
                                <div className="login-feature-sub">{sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="login-left-footer">
                    © 2026 NexaHR — Built for SMEs
                </div>
            </div>

            {/* Right panel — form */}
            <div className="login-right">
                <div className="login-card">
                    <div className="login-card-header">
                        <h2>Welcome back</h2>
                        <p>Sign in to your NexaHR workspace</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="you@company.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{ paddingRight: 40 }}
                                />
                                <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="login-error">{error}</div>
                        )}

                        <button type="submit" className="btn-primary login-submit" disabled={loading}>
                            {loading
                                ? <><span className="login-spinner" /> Signing in…</>
                                : <><LogIn size={16} /> Sign In</>
                            }
                        </button>
                    </form>

                    <div className="login-divider"><span>Demo Accounts</span></div>
                    <div className="login-demos">
                        {DEMO_USERS.map(u => (
                            <button key={u.email} className="login-demo-btn" onClick={() => fillDemo(u)}>
                                <div className={`avatar ${u.avClass}`} style={{ width: 28, height: 28, fontSize: 11 }}>{u.initials}</div>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>{u.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--neutral-500)' }}>{u.role}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
