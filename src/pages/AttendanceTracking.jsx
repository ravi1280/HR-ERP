import { useState, useEffect, useRef } from 'react';
import {
    CheckCircle2, Monitor, Clock, XCircle,
    AlertTriangle, Download
} from 'lucide-react';
import { employees, attendanceData } from '../data';

const STATUS_MAP = {
    P: { label: 'P', cls: 'cal-present', full: 'Present' },
    A: { label: 'A', cls: 'cal-absent', full: 'Absent' },
    L: { label: 'L', cls: 'cal-late', full: 'Late' },
    WFH: { label: 'W', cls: 'cal-wfh', full: 'WFH' },
};

const DAYS_IN_MONTH = 30;
const MONTH_START_DOW = 2; // April 2026 starts on Wednesday

export default function AttendanceTracking({ actionTrigger }) {
    const [view, setView] = useState('table');
    const [selectedEmp, setSelectedEmp] = useState(1);
    const [todayAttendance, setTodayAttendance] = useState(attendanceData.today);
    const lastTrigger = useRef(actionTrigger);

    useEffect(() => {
        if (actionTrigger > 0 && actionTrigger !== lastTrigger.current) {
            exportCSV();
        }
        lastTrigger.current = actionTrigger;
    }, [actionTrigger]);

    const handleMark = (empId, status) =>
        setTodayAttendance(prev => prev.map(d => d.empId === empId ? { ...d, status } : d));

    const todayStats = {
        Present: todayAttendance.filter(d => d.status === 'Present').length,
        WFH: todayAttendance.filter(d => d.status === 'WFH').length,
        Late: todayAttendance.filter(d => d.status === 'Late').length,
        Absent: todayAttendance.filter(d => d.status === 'Absent').length,
    };

    const exportCSV = () => {
        const rows = [['Employee', 'Date', 'Status']];
        employees.forEach(emp => {
            const monthly = attendanceData.monthly[emp.id] || {};
            Object.entries(monthly).forEach(([day, status]) => {
                rows.push([emp.name, `2026-04-${String(day).padStart(2, '0')}`, status]);
            });
        });
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'attendance_april2026.csv';
        a.click();
    };

    const calData = attendanceData.monthly[selectedEmp] || {};

    return (
        <div className="fade-in section-gap">
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
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
                    <div className="kpi-label">Present Today</div><div className="kpi-value">{todayStats.Present}</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Monitor size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Working Remotely</div><div className="kpi-value">{todayStats.WFH}</div>
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
                    <div className="kpi-label">Late Arrivals</div><div className="kpi-value">{todayStats.Late}</div>
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
                    <div className="kpi-label">Total Absent</div><div className="kpi-value">{todayStats.Absent}</div>
                </div>
            </div>

            {todayStats.Late > 0 && (
                <div className="alert alert-warning">
                    <AlertTriangle size={16} />
                    <span><strong>Late Arrival Alert:</strong> {todayAttendance.filter(d => d.status === 'Late').map(d => employees.find(e => e.id === d.empId)?.name).join(', ')} arrived late today.</span>
                </div>
            )}

            <div className="flex-row gap-2">
                <button className={`btn-${view === 'table' ? 'primary' : 'secondary'}`} onClick={() => setView('table')}>Daily Log</button>
                <button className={`btn-${view === 'cal' ? 'primary' : 'secondary'}`} onClick={() => setView('cal')}>Calendar View</button>
            </div>

            {view === 'table' && (
                <div className="card">
                    <div className="card-title">Today's Attendance — April 10, 2026</div>
                    <table className="data-table">
                        <thead><tr><th>Employee</th><th>Department</th><th>Status</th><th>Mark As</th></tr></thead>
                        <tbody>
                            {todayAttendance.map(d => {
                                const emp = employees.find(e => e.id === d.empId);
                                const badgeCls = { Present: 'badge-green', WFH: 'badge-blue', Late: 'badge-amber', Absent: 'badge-red' }[d.status];
                                return (
                                    <tr key={d.empId}>
                                        <td>
                                            <div className="flex-row gap-2">
                                                <div className={`avatar ${emp.avClass}`}>{emp.initials}</div>
                                                <div><div style={{ fontWeight: 600 }}>{emp.name}</div><div className="text-xs text-muted">{emp.role}</div></div>
                                            </div>
                                        </td>
                                        <td>{emp.department}</td>
                                        <td><span className={`badge ${badgeCls}`}>{d.status}</span></td>
                                        <td>
                                            <div className="flex-row gap-2">
                                                {['Present', 'Late', 'WFH', 'Absent'].map(s => (
                                                    <button key={s} onClick={() => handleMark(emp.id, s)}
                                                        className={d.status === s ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}>{s}</button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'cal' && (
                <div className="card">
                    <div className="flex-between mb-4">
                        <div className="card-title" style={{ marginBottom: 0 }}>Monthly Calendar — April 2026</div>
                        <select className="form-input form-select" style={{ width: 200 }} value={selectedEmp} onChange={e => setSelectedEmp(Number(e.target.value))}>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                        </select>
                    </div>
                    <div className="flex-row gap-3 mb-4">
                        {[['P', 'cal-present', 'Present'], ['A', 'cal-absent', 'Absent'], ['L', 'cal-late', 'Late'], ['W', 'cal-wfh', 'WFH']].map(([l, cls, full]) => (
                            <div key={l} className="flex-row gap-2">
                                <div className={`cal-cell ${cls}`} style={{ width: 28, height: 24, fontSize: 11 }}>{l}</div>
                                <span className="text-sm text-muted">{full}</span>
                            </div>
                        ))}
                    </div>
                    <div className="cal-grid">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="cal-header">{d}</div>)}
                        {Array.from({ length: MONTH_START_DOW }).map((_, i) => <div key={'b' + i} className="cal-cell cal-blank" />)}
                        {Array.from({ length: DAYS_IN_MONTH }).map((_, i) => {
                            const day = i + 1;
                            const dow = (MONTH_START_DOW + i) % 7;
                            const isWeekend = dow >= 5;
                            const status = calData[day];
                            const meta = status ? STATUS_MAP[status] : null;
                            return (
                                <div key={day}
                                    className={`cal-cell ${meta ? meta.cls : isWeekend ? 'cal-weekend' : 'cal-blank'}`}
                                    title={meta ? meta.full : ''}>
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
