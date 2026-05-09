import { useState, useEffect, useRef } from 'react';
import {
    DollarSign, CheckCircle2, ReceiptText, Gift,
    Printer, History, Download
} from 'lucide-react';
import { employees, payrollData } from '../data';

export default function Payroll({ actionTrigger }) {
    const [view, setView] = useState('run');
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [toast, setToast] = useState('');
    const { summary, employees: payEs, history } = payrollData;
    const lastTrigger = useRef(actionTrigger);

    useEffect(() => {
        if (actionTrigger > 0 && actionTrigger !== lastTrigger.current) {
            setToast('✓ April 2026 Payroll Processed Successfully');
            setTimeout(() => setToast(''), 3000);
        }
        lastTrigger.current = actionTrigger;
    }, [actionTrigger]);

    /* ─── CSV download for any history row ────────────── */
    const downloadPayrollCSV = (historyRow) => {
        // Scale April actuals proportionally to match the history month totals
        const ratio = historyRow.gross / summary.gross;

        const headers = ['Employee', 'Role', 'Department', 'Basic', 'Overtime', 'Bonus', 'EPF', 'ETF', 'Tax', 'Net Pay'];
        const rows = payEs.map(pe => {
            const emp = employees.find(e => e.id === pe.empId);
            const scale = v => Math.round(v * ratio);
            return [
                emp.name,
                emp.role,
                emp.department,
                scale(pe.basic),
                scale(pe.overtime),
                scale(pe.bonus),
                scale(pe.epf),
                scale(pe.etf),
                scale(pe.tax),
                scale(pe.net),
            ];
        });

        // Totals row
        rows.push([
            'TOTAL', '', '',
            rows.reduce((s, r) => s + r[3], 0),
            rows.reduce((s, r) => s + r[4], 0),
            rows.reduce((s, r) => s + r[5], 0),
            rows.reduce((s, r) => s + r[6], 0),
            rows.reduce((s, r) => s + r[7], 0),
            rows.reduce((s, r) => s + r[8], 0),
            rows.reduce((s, r) => s + r[9], 0),
        ]);

        const csvContent = [
            [`NexaHR Payroll Report — ${historyRow.month}`],
            [`Generated: ${new Date().toLocaleString()}`],
            [],
            headers,
            ...rows,
        ].map(r => r.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `payroll_${historyRow.month.replace(' ', '_')}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const renderPayslip = (emp, pe) => (
        <div className="modal-overlay" onClick={() => setSelectedEmp(null)}>
            <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>NexaHR</div>
                    <div style={{ fontSize: 13, color: 'var(--neutral-500)' }}>Pay Slip — April 2026</div>
                </div>
                <div className="flex-row gap-3 mb-4" style={{ background: 'var(--neutral-50)', padding: '12px 16px', borderRadius: 8 }}>
                    <div className={`avatar avatar-lg ${emp.avClass}`}>{emp.initials}</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{emp.name}</div>
                        <div className="text-muted">{emp.role} · {emp.department}</div>
                        <div className="text-sm text-muted">Emp ID: EMP-00{emp.id}</div>
                    </div>
                </div>
                <div className="card-title">Earnings</div>
                {[['Basic Salary', pe.basic], ['Overtime', pe.overtime], ['Bonus', pe.bonus]].map(([l, v]) => (
                    <div key={l} className="payroll-line"><span>{l}</span><span>${v.toLocaleString()}</span></div>
                ))}
                <div className="payroll-line" style={{ fontWeight: 600 }}><span>Gross Total</span><span>${(pe.basic + pe.overtime + pe.bonus).toLocaleString()}</span></div>
                <div className="card-title mt-4">Deductions</div>
                {[['EPF (Employee 8%)', pe.epf], ['ETF (Employer 3%)', pe.etf], ['Income Tax', pe.tax]].map(([l, v]) => (
                    <div key={l} className="payroll-line" style={{ color: 'var(--danger)' }}><span>{l}</span><span>-${v.toLocaleString()}</span></div>
                ))}
                <div className="payroll-total">
                    <span>Net Pay</span>
                    <span style={{ color: 'var(--accent)' }}>${pe.net.toLocaleString()}</span>
                </div>
                <div className="flex-row gap-2 mt-4" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn-secondary" onClick={() => setSelectedEmp(null)}>Close</button>
                    <button className="btn-primary" style={{ gap: 6 }} onClick={() => window.print()}>
                        <Printer size={14} /> Print Payslip
                    </button>
                </div>
            </div>
        </div>
    );

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
                            <DollarSign size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Gross Payroll</div><div className="kpi-value">${(summary.gross / 1000).toFixed(1)}k</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CheckCircle2 size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Net Payroll</div><div className="kpi-value">${(summary.net / 1000).toFixed(1)}k</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(186, 117, 23, 0.1)', color: '#BA7517',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <ReceiptText size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Total Tax</div><div className="kpi-value">${(summary.tax / 1000).toFixed(1)}k</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Gift size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Bonuses Paid</div><div className="kpi-value">${summary.bonus.toLocaleString()}</div>
                </div>
            </div>

            <div className="flex-row gap-2">
                <button className={`btn-${view === 'run' ? 'primary' : 'secondary'}`} onClick={() => setView('run')}>Current Month</button>
                <button className={`btn-${view === 'history' ? 'primary' : 'secondary'}`} style={{ gap: 6 }} onClick={() => setView('history')}>
                    <History size={14} /> History
                </button>
            </div>

            <div className="alert alert-success">
                <CheckCircle2 size={15} />
                <span>April 2026 payroll has been processed and linked to accounting expenses.</span>
            </div>

            {view === 'run' && (
                <div className="card">
                    <div className="card-title">Employee Payroll Breakdown — April 2026</div>
                    <table className="data-table">
                        <thead><tr><th>Employee</th><th>Basic</th><th>Overtime</th><th>Bonus</th><th>EPF</th><th>ETF</th><th>Tax</th><th>Net Pay</th><th>Payslip</th></tr></thead>
                        <tbody>
                            {payEs.map(pe => {
                                const emp = employees.find(e => e.id === pe.empId);
                                return (
                                    <tr key={pe.empId}>
                                        <td>
                                            <div className="flex-row gap-2">
                                                <div className={`avatar ${emp.avClass}`}>{emp.initials}</div>
                                                <div><div style={{ fontWeight: 600 }}>{emp.name}</div><div className="text-xs text-muted">{emp.role}</div></div>
                                            </div>
                                        </td>
                                        <td>${pe.basic.toLocaleString()}</td>
                                        <td>${pe.overtime.toLocaleString()}</td>
                                        <td>${pe.bonus.toLocaleString()}</td>
                                        <td style={{ color: 'var(--danger)' }}>-${pe.epf}</td>
                                        <td style={{ color: 'var(--danger)' }}>-${pe.etf}</td>
                                        <td style={{ color: 'var(--danger)' }}>-${pe.tax}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--accent)' }}>${pe.net.toLocaleString()}</td>
                                        <td>
                                            <button className="btn-secondary btn-sm" onClick={() => setSelectedEmp({ emp, pe })}>View Payslip</button>
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr style={{ background: 'var(--neutral-50)', fontWeight: 700 }}>
                                <td>TOTAL</td>
                                <td>${payEs.reduce((a, p) => a + p.basic, 0).toLocaleString()}</td>
                                <td>${payEs.reduce((a, p) => a + p.overtime, 0).toLocaleString()}</td>
                                <td>${payEs.reduce((a, p) => a + p.bonus, 0).toLocaleString()}</td>
                                <td colSpan={3} style={{ color: 'var(--danger)' }}>-${payEs.reduce((a, p) => a + p.deductTotal, 0).toLocaleString()}</td>
                                <td style={{ color: 'var(--accent)' }}>${payEs.reduce((a, p) => a + p.net, 0).toLocaleString()}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'history' && (
                <div className="card">
                    <div className="card-title">Payroll History &amp; Audit Log</div>
                    <table className="data-table">
                        <thead><tr><th>Month</th><th>Gross</th><th>Net</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {[{ month: 'April 2026', gross: summary.gross, net: summary.net, status: 'Paid' }, ...history].map(h => (
                                <tr key={h.month}>
                                    <td style={{ fontWeight: 600 }}>{h.month}</td>
                                    <td>${h.gross.toLocaleString()}</td>
                                    <td>${h.net.toLocaleString()}</td>
                                    <td><span className="badge badge-green">{h.status}</span></td>
                                    <td>
                                        <button
                                            className="btn-secondary btn-sm"
                                            style={{ gap: 5 }}
                                            onClick={() => downloadPayrollCSV(h)}
                                        >
                                            <Download size={12} /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedEmp && renderPayslip(selectedEmp.emp, selectedEmp.pe)}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, background: 'var(--accent)',
                    color: '#fff', padding: '12px 20px', borderRadius: 8, fontSize: 13,
                    zIndex: 2000, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s ease'
                }}>{toast}</div>
            )}
        </div>
    );
}
