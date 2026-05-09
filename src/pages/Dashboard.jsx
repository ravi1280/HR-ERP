import {
    Users, CheckCircle2, Clock, DollarSign,
    CheckCheck, Monitor, AlertCircle, XCircle,
    ThumbsUp, ThumbsDown,
    UserCheck, Activity, FileText, CreditCard, TriangleAlert, FileWarning,
    Briefcase, TrendingUp, Layers
} from 'lucide-react';
import { employees, attendanceData, leaveData, activityFeed } from '../data';

function KpiCard({ label, value, sub, icon: Icon, iconColor, accent }) {
    return (
        <div className={`kpi-card${accent ? ' kpi-accent' : ''}`}>
            <div className="kpi-icon">
                <Icon size={22} color={accent ? 'rgba(255,255,255,0.85)' : (iconColor || 'var(--accent)')} strokeWidth={1.8} />
            </div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            {sub && <div className="kpi-sub">{sub}</div>}
        </div>
    );
}

function AttBar({ pct, day }) {
    return (
        <div className="bar-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8 }}>
                <div className="bar" style={{ 
                    height: `${Math.max(pct, 5)}%`, 
                    width: '18px', 
                    background: 'var(--accent)', 
                    borderRadius: '6px 6px 0 0',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}></div>
            </div>
            <div className="bar-label" style={{ marginTop: 4, fontWeight: 700, fontSize: 12 }}>{day}</div>
            <div className="text-xs text-muted" style={{ fontSize: 10, fontWeight: 600 }}>{pct}%</div>
        </div>
    );
}

const ACTIVITY_ICONS = {
    success: <CheckCheck size={16} color="var(--accent)" />,
    warning: <Clock size={16} color="var(--warning)" />,
    info: <FileText size={16} color="var(--info)" />,
    danger: <TriangleAlert size={16} color="var(--danger)" />,
};

export default function Dashboard() {
    const pendingLeaves = leaveData.requests.filter(r => r.status === 'Pending').length;
    const presentToday = attendanceData.today.filter(d => d.status === 'Present' || d.status === 'WFH').length;

    return (
        <div className="fade-in section-gap">
            {/* KPI grid */}
            <div className="kpi-grid">
                <KpiCard icon={Users} label="Employees" value="124" sub="+4 this month" />
                <KpiCard icon={Briefcase} accent label="Active Projects" value="12" sub="3 due this week" />
                <KpiCard icon={TrendingUp} iconColor="var(--accent)" label="Total Revenue" value="$428.5k" sub="+12.5% growth" />
                <KpiCard icon={Layers} iconColor="var(--info)" label="CRM Leads" value="48" sub="15 new leads" />
            </div>

            <div className="grid-2">
                {/* Attendance bar chart */}
                <div className="card">
                    <div className="flex-between mb-4">
                        <div className="card-title" style={{ marginBottom: 0 }}>Weekly Attendance</div>
                        <span className="badge badge-green">This Week</span>
                    </div>
                    <div className="bar-chart" style={{ height: 200, display: 'flex', gap: 12, alignItems: 'stretch', marginTop: 20 }}>
                        {attendanceData.week.map(d => <AttBar key={d.day} pct={d.pct} day={d.day} />)}
                    </div>
                </div>

                {/* Pending approvals */}
                <div className="card">
                    <div className="card-title">Pending Approvals</div>
                    {leaveData.requests.filter(r => r.status === 'Pending').map(req => {
                        const emp = employees.find(e => e.id === req.empId);
                        return (
                            <div key={req.id} className="flex-between" style={{ padding: '10px 0', borderBottom: '0.5px solid var(--neutral-100)' }}>
                                <div className="flex-row gap-2">
                                    <div className={`avatar ${emp.avClass}`}>{emp.initials}</div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</div>
                                        <div className="text-sm text-muted">{req.type} Leave · {req.days} day{req.days > 1 ? 's' : ''}</div>
                                    </div>
                                </div>
                                <div className="flex-row gap-2">
                                    <button className="btn-primary btn-sm" style={{ gap: 4 }}>
                                        <ThumbsUp size={12} /> Approve
                                    </button>
                                    <button className="btn-danger btn-sm" style={{ gap: 4, display: 'inline-flex', alignItems: 'center' }}>
                                        <ThumbsDown size={12} /> Reject
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid-2">
                {/* Project Status Snapshots */}
                <div className="card">
                    <div className="flex-between mb-4">
                        <h3 className="card-title" style={{ margin: 0 }}>Project Health</h3>
                        <button className="btn-secondary btn-sm">View All</button>
                    </div>
                    {[
                        { name: 'Brand Refresh', progress: 65, status: 'On Track' },
                        { name: 'Q3 Audit', progress: 90, status: 'Complete' },
                        { name: 'HR Portal V2', progress: 40, status: 'At Risk' },
                        { name: 'Logistics Opt.', progress: 20, status: 'Planning' },
                    ].map(p => (
                        <div key={p.name} style={{ padding: '12px 0', borderBottom: '0.5px solid var(--neutral-100)' }}>
                            <div className="flex-between mb-1">
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                                <span className={`badge ${p.status === 'At Risk' ? 'badge-red' : 'badge-green'}`} style={{ fontSize: 10 }}>{p.status}</span>
                            </div>
                            <div className="progress-bar">
                                <div className={`progress-fill ${p.status === 'At Risk' ? 'progress-red' : 'progress-green'}`} style={{ width: `${p.progress}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Activity feed */}
                <div className="card">
                    <div className="card-title">Recent Activity</div>
                    {activityFeed.map(a => (
                        <div key={a.id} className="flex-row gap-3" style={{ padding: '8px 0', borderBottom: '0.5px solid var(--neutral-100)', alignItems: 'flex-start' }}>
                            <div style={{ marginTop: 1, flexShrink: 0 }}>{ACTIVITY_ICONS[a.type]}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13 }}>{a.text}</div>
                                <div className="text-xs text-muted">{a.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
