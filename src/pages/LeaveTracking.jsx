import { useState, useEffect, useRef } from 'react';
import {
    ClipboardList, CheckCircle2, Clock, XCircle,
    CalendarRange, Plus, ThumbsUp, ThumbsDown, Info
} from 'lucide-react';
import { employees, leaveData } from '../data';

const LEAVE_TYPES = ['Annual', 'Sick', 'Casual', 'Emergency', 'Mat/Pat'];
const MAX_BALANCES = { Annual: 21, Sick: 14, Casual: 7, Emergency: 5, 'Mat/Pat': 84 };
const STATUS_BADGE = { Pending: 'badge-amber', Approved: 'badge-green', Rejected: 'badge-red' };

export default function LeaveTracking({ actionTrigger }) {
    const [requests, setRequests] = useState(leaveData.requests);
    const [view, setView] = useState('requests');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ empId: 1, type: 'Annual', from: '', to: '', reason: '' });
    const lastTrigger = useRef(actionTrigger);

    useEffect(() => {
        if (actionTrigger > 0 && actionTrigger !== lastTrigger.current) {
            setShowModal(true);
        }
        lastTrigger.current = actionTrigger;
    }, [actionTrigger]);

    const handleApprove = id => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    const handleReject = id => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));

    const handleSubmit = () => {
        const from = new Date(form.from), to = new Date(form.to);
        const days = Math.max(1, Math.round((to - from) / 86400000) + 1);
        setRequests(prev => [...prev, {
            id: Date.now(), empId: Number(form.empId), type: form.type,
            from: form.from, to: form.to, days, reason: form.reason, status: 'Pending'
        }]);
        setShowModal(false);
    };

    const pending = requests.filter(r => r.status === 'Pending').length;
    const approved = requests.filter(r => r.status === 'Approved').length;

    return (
        <div className="fade-in section-gap">
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(107, 114, 128, 0.1)', color: '#6b7280',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <ClipboardList size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Total Requests</div><div className="kpi-value">{requests.length}</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CheckCircle2 size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Approved</div><div className="kpi-value">{approved}</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(186, 117, 23, 0.1)', color: '#BA7517',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Clock size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Pending</div><div className="kpi-value">{pending}</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(163, 45, 45, 0.1)', color: '#A32D2D',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <XCircle size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Rejected</div><div className="kpi-value">{requests.filter(r => r.status === 'Rejected').length}</div>
                </div>
            </div>

            <div className="flex-row gap-2">
                <button className={`btn-${view === 'requests' ? 'primary' : 'secondary'}`} onClick={() => setView('requests')}>Leave Requests</button>
                <button className={`btn-${view === 'balance' ? 'primary' : 'secondary'}`} onClick={() => setView('balance')}>Balance Tracker</button>
                <button className={`btn-${view === 'calendar' ? 'primary' : 'secondary'}`} onClick={() => setView('calendar')}>Team Calendar</button>
            </div>

            {view === 'requests' && (
                <div className="card">
                    <div className="card-title">Leave Requests</div>
                    <table className="data-table">
                        <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {requests.map(req => {
                                const emp = employees.find(e => e.id === req.empId);
                                return (
                                    <tr key={req.id}>
                                        <td>
                                            <div className="flex-row gap-2">
                                                <div className={`avatar ${emp.avClass}`}>{emp.initials}</div>
                                                <span style={{ fontWeight: 600 }}>{emp.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-blue">{req.type}</span></td>
                                        <td>{req.from}</td><td>{req.to}</td>
                                        <td>{req.days}d</td>
                                        <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.reason}</td>
                                        <td><span className={`badge ${STATUS_BADGE[req.status]}`}>{req.status}</span></td>
                                        <td>
                                            {req.status === 'Pending' && (
                                                <div className="flex-row gap-2">
                                                    <button className="btn-primary btn-sm" style={{ gap: 4 }} onClick={() => handleApprove(req.id)}><ThumbsUp size={11} /> Approve</button>
                                                    <button className="btn-danger btn-sm" style={{ gap: 4, display: 'inline-flex', alignItems: 'center' }} onClick={() => handleReject(req.id)}><ThumbsDown size={11} /> Reject</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'balance' && (
                <div className="card">
                    <div className="card-title">Leave Balance Tracker</div>
                    <table className="data-table">
                        <thead><tr><th>Employee</th>{LEAVE_TYPES.map(t => <th key={t}>{t}</th>)}</tr></thead>
                        <tbody>
                            {leaveData.balances.map(b => {
                                const emp = employees.find(e => e.id === b.empId);
                                return (
                                    <tr key={b.empId}>
                                        <td>
                                            <div className="flex-row gap-2">
                                                <div className={`avatar ${emp.avClass}`}>{emp.initials}</div>
                                                <div><div style={{ fontWeight: 600 }}>{emp.name}</div><div className="text-xs text-muted">{emp.role}</div></div>
                                            </div>
                                        </td>
                                        {LEAVE_TYPES.map(t => {
                                            const val = b[t] ?? 0;
                                            const max = MAX_BALANCES[t];
                                            const pct = Math.round((val / max) * 100);
                                            const cls = pct > 50 ? 'progress-green' : pct > 25 ? 'progress-amber' : 'progress-red';
                                            return (
                                                <td key={t}>
                                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{val} days</div>
                                                    <div className="progress-bar"><div className={`progress-fill ${cls}`} style={{ width: pct + '%' }} /></div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'calendar' && (
                <div className="card">
                    <div className="card-title">Team Leave Calendar — April 2026</div>
                    <div className="alert alert-info mb-4">
                        <Info size={15} />
                        <span>Approved leaves shown below. Avoid scheduling meetings on conflicting dates.</span>
                    </div>
                    {employees.map(emp => {
                        const empLeaves = requests.filter(r => r.empId === emp.id && r.status === 'Approved');
                        return (
                            <div key={emp.id} className="flex-row gap-3" style={{ padding: '12px 0', borderBottom: '0.5px solid var(--neutral-100)', flexWrap: 'wrap' }}>
                                <div style={{ width: 180 }} className="flex-row gap-2">
                                    <div className={`avatar ${emp.avClass}`}>{emp.initials}</div>
                                    <div><div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div><div className="text-xs text-muted">{emp.role}</div></div>
                                </div>
                                <div className="flex-row gap-2" style={{ flexWrap: 'wrap' }}>
                                    {empLeaves.length === 0
                                        ? <span className="text-sm text-muted">No approved leaves</span>
                                        : empLeaves.map(l => (
                                            <div key={l.id} style={{ background: 'var(--accent-light)', border: '1px solid #7ecdb5', padding: '4px 10px', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <CalendarRange size={12} color="var(--accent)" />
                                                {l.from} – {l.to}
                                                <span className="badge badge-blue" style={{ marginLeft: 2 }}>{l.type}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Submit Leave Request</div>
                        <div className="form-group">
                            <label className="form-label">Employee</label>
                            <select className="form-input form-select" value={form.empId} onChange={e => setForm(f => ({ ...f, empId: e.target.value }))}>
                                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Leave Type</label>
                            <select className="form-input form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="grid-2">
                            <div className="form-group"><label className="form-label">From</label><input type="date" className="form-input" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} /></div>
                            <div className="form-group"><label className="form-label">To</label><input type="date" className="form-input" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} /></div>
                        </div>
                        <div className="form-group"><label className="form-label">Reason</label><input className="form-input" placeholder="Brief reason..." value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} /></div>
                        <div className="flex-row gap-2" style={{ justifyContent: 'flex-end' }}>
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmit}>Submit Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
