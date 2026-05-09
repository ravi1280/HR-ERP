import React from 'react';
import {
  TrendingUp, TrendingDown, Activity, DollarSign, Users, Target,
  ArrowUpRight, ArrowDownRight, Zap, Briefcase, PieChart,
  BarChart3, Globe, ShieldCheck, Clock, Layers, Sparkles, Lightbulb
} from 'lucide-react';

const METRICS = [
  { label: 'EBITDA', value: '$84,200', trend: '+5.4%', positive: true, icon: DollarSign, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { label: 'LTV (Avg)', value: '$12,800', trend: '+12%', positive: true, icon: Target, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { label: 'Project Margin', value: '42%', trend: '+4.2%', positive: true, icon: Briefcase, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { label: 'Churn Rate', value: '1.2%', trend: '+0.4%', positive: false, icon: Activity, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
];

export default function Analytics() {
  return (
    <div className="section-gap fade-in">
      {/* Premium KPI Grid */}
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {METRICS.map(m => (
          <div key={m.label} className="kpi-card">
            <div className="flex-between mb-4">
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: m.bg, color: m.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <m.icon size={22} />
              </div>
              <span className={`text-xs ${m.positive ? 'text-green' : 'text-red'} flex-row gap-1`} style={{ fontWeight: 600 }}>
                {m.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {m.trend}
              </span>
            </div>
            <div className="kpi-label">{m.label}</div>
            <div className="kpi-value">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="section-gap">
          {/* Main Performance Chart */}
          <div className="card">
            <div className="flex-between mb-6">
              <h3 className="card-title" style={{ margin: 0 }}>Company Revenue Flow</h3>
              <div className="flex-row gap-2">
                <button className="btn-secondary btn-sm">Daily</button>
                <button className="btn-secondary btn-sm active">Monthly</button>
                <button className="btn-secondary btn-sm">Yearly</button>
              </div>
            </div>

            <div className="bar-chart" style={{ height: 250, display: 'flex', gap: 12, alignItems: 'stretch' }}>
              {[
                { label: 'Jan', val: 45, target: 50 }, { label: 'Feb', val: 52, target: 50 },
                { label: 'Mar', val: 48, target: 55 }, { label: 'Apr', val: 70, target: 60 },
                { label: 'May', val: 65, target: 65 }, { label: 'Jun', val: 85, target: 75 },
                { label: 'Jul', val: 78, target: 80 }, { label: 'Aug', val: 92, target: 85 },
                { label: 'Sep', val: 105, target: 90 }, { label: 'Oct', val: 98, target: 95 },
                { label: 'Nov', val: 115, target: 100 }, { label: 'Dec', val: 125, target: 110 }
              ].map((item, i) => (
                <div key={i} className="bar-col" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2, justifyContent: 'center' }}>
                    <div className="bar" title={`Target: $${item.target}k`} style={{
                      width: 6, height: `${(item.target / 130) * 100}%`,
                      background: 'var(--neutral-100)', borderRadius: '4px 4px 0 0'
                    }}></div>
                    <div className="bar" title={`Revenue: $${item.val}k`} style={{
                      width: 10, height: `${(item.val / 130) * 100}%`,
                      background: i === 8 ? 'var(--accent)' : 'var(--neutral-400)',
                      borderRadius: '4px 4px 0 0',
                      opacity: i === 8 ? 1 : 0.7
                    }}></div>
                  </div>
                  <div className="bar-label" style={{ fontSize: 10, marginTop: 8, textAlign: 'center' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex-row gap-4 justify-center">
              <div className="flex-row gap-2">
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--neutral-400)', opacity: 0.6 }}></div>
                <span className="text-xs text-muted">Revenue</span>
              </div>
              <div className="flex-row gap-2">
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--neutral-200)' }}></div>
                <span className="text-xs text-muted">Target</span>
              </div>
              <div className="flex-row gap-2">
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)' }}></div>
                <span className="text-xs text-muted">Current Month</span>
              </div>
            </div>
          </div>

          {/* Operational Efficiency Grid */}
          <div className="grid-2">
            <div className="card">
              <h3 className="card-title" style={{ fontSize: 14 }}>Lead Conversion Funnel</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { stage: 'Awareness', value: '12,420', pct: 100, color: '#3b82f6' },
                  { stage: 'Interest', value: '8,120', pct: 65, color: '#6366f1' },
                  { stage: 'Decision', value: '2,400', pct: 19, color: '#8b5cf6' },
                  { stage: 'Action', value: '840', pct: 7, color: '#a855f7' },
                ].map(s => (
                  <div key={s.stage}>
                    <div className="flex-between mb-1 text-xs">
                      <span className="font-600">{s.stage}</span>
                      <span className="text-muted">{s.value}</span>
                    </div>
                    <div className="progress-bar" style={{ height: 12, background: 'var(--neutral-50)', borderRadius: 4 }}>
                      <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color, borderRadius: 4 }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ fontSize: 14 }}>Workload Distribution</h3>
              <div className="section-gap">
                {[
                  { dept: 'Development', active: 12, capacity: 15 },
                  { dept: 'Design', active: 8, capacity: 10 },
                  { dept: 'Marketing', active: 5, capacity: 8 },
                ].map(d => (
                  <div key={d.dept}>
                    <div className="flex-between mb-1 text-xs font-600">
                      <span>{d.dept}</span>
                      <span>{d.active}/{d.capacity}</span>
                    </div>
                    <div className="progress-bar" style={{ height: 6 }}>
                      <div className="progress-fill progress-blue" style={{ width: `${(d.active / d.capacity) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="section-gap">
          {/* Intelligence Score */}
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div className="text-xs kpi-label mb-4">Overall Efficiency Score</div>
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px' }}>
              <svg width="140" height="140" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--neutral-100)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent)" strokeWidth="8"
                  strokeDasharray="210 282" strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ fontSize: 32, fontWeight: 800 }}>82</div>
                <div className="text-xs text-muted">EXCELLENT</div>
              </div>
            </div>
            <p className="text-xs text-muted">Your operations are 12% more efficient than last month.</p>
          </div>

          {/* Business Health */}
          <div className="card">
            <h3 className="card-title">Business Health Index</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Security Compliance', status: 'Healthy', icon: ShieldCheck, color: 'text-green' },
                { label: 'Server Availability', status: '99.98%', icon: Globe, color: 'text-green' },
                { label: 'Tech Debt', status: 'Low', icon: Zap, color: 'text-amber' },
              ].map((item, i) => (
                <div key={i} className="flex-between p-3" style={{ background: 'var(--neutral-50)', borderRadius: 10 }}>
                  <div className="flex-row gap-3">
                    <item.icon size={16} className="text-muted" />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                  </div>
                  <span className={`text-xs font-700 ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart AI Tips */}
          <div className="card" style={{
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20, width: 80, height: 80,
              background: 'var(--accent)', opacity: 0.05, borderRadius: '50%'
            }}></div>

            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} color="var(--accent)" /> AI Optimization Tips
            </h3>
            <div className="section-gap">
              <div className="flex-row gap-3 p-3" style={{ background: 'var(--neutral-50)', borderRadius: 12, border: '1px solid var(--neutral-100)' }}>
                <div style={{ color: 'var(--accent)' }}><Lightbulb size={18} /></div>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Redesigning the project flow could save <strong style={{ color: 'var(--accent)' }}>14% monthly cost</strong>.
                </div>
              </div>
              <div className="flex-row gap-3 p-3" style={{ background: 'var(--neutral-50)', borderRadius: 12, border: '1px solid var(--neutral-100)' }}>
                <div style={{ color: '#3b82f6' }}><Zap size={18} /></div>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                  Lead conversion is peaking between <strong style={{ color: 'var(--accent)' }}>2 PM - 5 PM</strong> daily.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
