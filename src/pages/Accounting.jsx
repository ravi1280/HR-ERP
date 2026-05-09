import { useState, useEffect, useRef } from 'react';
import {
    TrendingUp, TrendingDown, BarChart2, Percent,
    TriangleAlert, Plus, X, Save, CheckCircle2,
    FileText, Printer, Calendar, Building2
} from 'lucide-react';
import { accountingData } from '../data';

const CATEGORIES = ['Revenue', 'Payroll', 'Facilities', 'Marketing', 'IT', 'Utilities', 'Other'];
const TYPES = ['Credit', 'Debit'];

const EMPTY_TXN = {
    date: new Date().toISOString().slice(0, 10),
    description: '',
    category: CATEGORIES[0],
    type: TYPES[0],
    amount: '',
};

const EMPTY_INV = {
    client: '',
    amount: '',
    due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // Default 30 days
};

/* ─── Add Invoice Modal ──────────────────────────── */
function AddInvoiceModal({ onSave, onClose }) {
    const [form, setForm] = useState({ ...EMPTY_INV });
    const [errors, setErrors] = useState({});

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

    const validate = () => {
        const e = {};
        if (!form.client.trim()) e.client = 'Client name is required';
        if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
            e.amount = 'Valid amount required';
        if (!form.due) e.due = 'Due date is required';
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        onSave({
            id: `INV-2026-${Date.now().toString().slice(-4)}`,
            client: form.client.trim(),
            amount: Number(form.amount),
            due: form.due,
            status: 'Pending',
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex-between mb-4">
                    <div className="modal-title" style={{ marginBottom: 0 }}>Create New Invoice</div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-500)', display: 'flex' }}>
                        <X size={18} />
                    </button>
                </div>

                <div className="form-group mb-4">
                    <label className="form-label">Client Name *</label>
                    <input className={`form-input ${errors.client ? 'input-error' : ''}`}
                        placeholder="e.g. Acme Corp"
                        value={form.client} onChange={e => set('client', e.target.value)} />
                    {errors.client && <div className="field-error">{errors.client}</div>}
                </div>

                <div className="grid-2 mb-4" style={{ gap: 12 }}>
                    <div className="form-group">
                        <label className="form-label">Amount (USD) *</label>
                        <input className={`form-input ${errors.amount ? 'input-error' : ''}`}
                            type="number" min="0" placeholder="0.00"
                            value={form.amount} onChange={e => set('amount', e.target.value)} />
                        {errors.amount && <div className="field-error">{errors.amount}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Due Date *</label>
                        <input className={`form-input ${errors.due ? 'input-error' : ''}`}
                            type="date"
                            value={form.due} onChange={e => set('due', e.target.value)} />
                        {errors.due && <div className="field-error">{errors.due}</div>}
                    </div>
                </div>

                <div className="flex-row gap-2" style={{ justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--neutral-200)' }}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" style={{ gap: 6 }} onClick={handleSave}>
                        <Save size={14} /> Create Invoice
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Add Transaction Modal ──────────────────────────── */
function AddTransactionModal({ onSave, onClose }) {
    const [form, setForm] = useState({ ...EMPTY_TXN });
    const [errors, setErrors] = useState({});

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

    const validate = () => {
        const e = {};
        if (!form.description.trim()) e.description = 'Description is required';
        if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
            e.amount = 'Valid amount required';
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        onSave({
            id: Date.now(),
            date: form.date,
            description: form.description.trim(),
            category: form.category,
            type: form.type,
            amount: Number(form.amount),
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex-between mb-4">
                    <div className="modal-title" style={{ marginBottom: 0 }}>Add Transaction</div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-500)', display: 'flex' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Type toggle */}
                <div className="flex-row gap-2 mb-4">
                    {TYPES.map(t => (
                        <button key={t}
                            className={form.type === t ? 'btn-primary' : 'btn-secondary'}
                            style={{ flex: 1, gap: 6, justifyContent: 'center' }}
                            onClick={() => set('type', t)}>
                            {t === 'Credit' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {t === 'Credit' ? 'Income / Credit' : 'Expense / Debit'}
                        </button>
                    ))}
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                        <label className="form-label">Description *</label>
                        <input className={`form-input ${errors.description ? 'input-error' : ''}`}
                            placeholder="e.g. Client Invoice — TechCorp"
                            value={form.description} onChange={e => set('description', e.target.value)} />
                        {errors.description && <div className="field-error">{errors.description}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Amount (USD) *</label>
                        <input className={`form-input ${errors.amount ? 'input-error' : ''}`}
                            type="number" min="0" placeholder="0.00"
                            value={form.amount} onChange={e => set('amount', e.target.value)} />
                        {errors.amount && <div className="field-error">{errors.amount}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input className="form-input" type="date"
                            value={form.date} onChange={e => set('date', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                        <label className="form-label">Category</label>
                        <select className="form-input form-select"
                            value={form.category} onChange={e => set('category', e.target.value)}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Preview tag */}
                <div style={{
                    marginTop: 4, padding: '10px 14px', borderRadius: 8,
                    background: form.type === 'Credit' ? 'var(--accent-light)' : 'var(--danger-light)',
                    color: form.type === 'Credit' ? '#0f6648' : 'var(--danger)',
                    fontSize: 13, fontWeight: 600,
                }}>
                    {form.type === 'Credit' ? '+' : '-'}${form.amount ? Number(form.amount).toLocaleString() : '0'}
                    {' · '}{form.category}{' · '}{form.date}
                </div>

                <div className="flex-row gap-2" style={{ justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--neutral-200)' }}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" style={{ gap: 6 }} onClick={handleSave}>
                        <Save size={14} /> Add Transaction
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Invoice View Modal ─────────────────────────────── */
const INV_STATUS_COLOR = { Paid: 'badge-green', Pending: 'badge-amber', Overdue: 'badge-red', Draft: 'badge-gray' };

function InvoiceViewModal({ inv, onClose, onMarkPaid }) {
    const isOverdue = inv.status === 'Overdue';
    const subtotal = inv.amount;
    const tax = Math.round(subtotal * 0.10);     // 10% VAT (demo)
    const total = subtotal + tax;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ width: 540, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex-between mb-4">
                    <div className="flex-row gap-2">
                        <FileText size={18} color="var(--accent)" />
                        <div className="modal-title" style={{ marginBottom: 0 }}>{inv.id}</div>
                    </div>
                    <div className="flex-row gap-2">
                        <span className={`badge ${INV_STATUS_COLOR[inv.status]}`} style={{ fontSize: 12 }}>{inv.status}</span>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-500)', display: 'flex' }}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* From / To */}
                <div className="grid-2" style={{ gap: 16, marginBottom: 20 }}>
                    <div>
                        <div className="form-label" style={{ marginBottom: 6 }}>From</div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--accent)' }}>NexaHR</div>
                        <div className="text-sm text-muted">SME Suite · billing@nexahr.com</div>
                        <div className="text-sm text-muted">Colombo, Sri Lanka</div>
                    </div>
                    <div>
                        <div className="form-label" style={{ marginBottom: 6 }}>Bill To</div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{inv.client}</div>
                        <div className="text-sm text-muted">accounts@{inv.client.toLowerCase().replace(/\s+/g, '') + '.com'}</div>
                    </div>
                </div>

                {/* Meta row */}
                <div className="flex-row gap-4" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
                    <div className="flex-row gap-2">
                        <Calendar size={14} color="var(--neutral-400)" />
                        <span className="text-sm text-muted">Due: <strong style={{ color: isOverdue ? 'var(--danger)' : 'var(--neutral-800)' }}>{inv.due}</strong></span>
                    </div>
                    <div className="flex-row gap-2">
                        <Building2 size={14} color="var(--neutral-400)" />
                        <span className="text-sm text-muted">Net 30 · USD</span>
                    </div>
                </div>

                {/* Line items */}
                <table className="data-table" style={{ marginBottom: 16 }}>
                    <thead><tr><th>Description</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <div style={{ fontWeight: 600 }}>Professional Services</div>
                                <div className="text-xs text-muted">Consulting & delivery — April 2026</div>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>${subtotal.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Totals */}
                <div style={{ background: 'var(--neutral-50)', borderRadius: 8, padding: '12px 16px' }}>
                    <div className="flex-between" style={{ padding: '5px 0', fontSize: 13 }}>
                        <span className="text-muted">Subtotal</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex-between" style={{ padding: '5px 0', fontSize: 13 }}>
                        <span className="text-muted">VAT (10%)</span>
                        <span>${tax.toLocaleString()}</span>
                    </div>
                    <div className="flex-between" style={{ padding: '8px 0 0', fontWeight: 700, fontSize: 15, borderTop: '1px solid var(--neutral-200)', marginTop: 4 }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--accent)' }}>${total.toLocaleString()}</span>
                    </div>
                </div>

                {isOverdue && (
                    <div className="alert alert-danger" style={{ marginTop: 12 }}>
                        <TriangleAlert size={14} />
                        <span>This invoice is <strong>overdue</strong>. Please follow up with the client immediately.</span>
                    </div>
                )}

                {/* Footer buttons */}
                <div className="flex-row gap-2" style={{ justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--neutral-200)' }}>
                    <button className="btn-secondary" style={{ gap: 5 }} onClick={() => window.print()}>
                        <Printer size={13} /> Print
                    </button>
                    <button className="btn-secondary" onClick={onClose}>Close</button>
                    {inv.status !== 'Paid' && (
                        <button className="btn-primary" style={{ gap: 5 }} onClick={() => { onMarkPaid(inv.id); onClose(); }}>
                            <CheckCircle2 size={13} /> Mark as Paid
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────── */
export default function Accounting({ actionTrigger }) {
    const [view, setView] = useState('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [showInvModal, setShowInvModal] = useState(false);
    const [transactions, setTxns] = useState(accountingData.transactions);
    const [invoices, setInvoices] = useState(accountingData.invoices);
    const [viewInvoice, setViewInvoice] = useState(null);
    const [toast, setToast] = useState('');
    const { summary } = accountingData;
    const lastTrigger = useRef(actionTrigger);

    useEffect(() => {
        if (actionTrigger > 0 && actionTrigger !== lastTrigger.current) {
            setShowModal(true);
        }
        lastTrigger.current = actionTrigger;
    }, [actionTrigger]);

    const INV_BADGE = { Paid: 'badge-green', Pending: 'badge-amber', Overdue: 'badge-red', Draft: 'badge-gray' };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const handleAddTxn = (txn) => {
        setTxns(prev => [txn, ...prev]);
        setShowModal(false);
        setView('ledger');          // jump to ledger to see the new entry
        showToast(`✓ Transaction "${txn.description}" added`);
    };

    const handleMarkPaid = (invId) => {
        setInvoices(prev => prev.map(i => i.id === invId ? { ...i, status: 'Paid' } : i));
        showToast('✓ Invoice marked as Paid');
    };

    const handleAddInvoice = (inv) => {
        setInvoices(prev => [inv, ...prev]);
        setShowInvModal(false);
        showToast(`✓ Invoice ${inv.id} created for ${inv.client}`);
    };

    /* live totals including newly added transactions */
    const liveRevenue = transactions.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0);
    const liveExpenses = transactions.filter(t => t.type === 'Debit').reduce((s, t) => s + t.amount, 0);
    const liveProfit = liveRevenue - liveExpenses;
    const liveMargin = liveRevenue ? Math.round((liveProfit / liveRevenue) * 100) : 0;

    const monthly = [
        { month: 'Jan', rev: 128000, exp: 89000 },
        { month: 'Feb', rev: 135000, exp: 92000 },
        { month: 'Mar', rev: 139000, exp: 95000 },
        { month: 'Apr', rev: liveRevenue, exp: liveExpenses },
    ];

    return (
        <div className="fade-in section-gap">
            {/* KPI Cards — live */}
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <TrendingUp size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Revenue</div>
                    <div className="kpi-value">${(liveRevenue / 1000).toFixed(0)}k</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(163, 45, 45, 0.1)', color: '#A32D2D',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <TrendingDown size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Expenses</div>
                    <div className="kpi-value">${(liveExpenses / 1000).toFixed(0)}k</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <BarChart2 size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Net Profit</div>
                    <div className="kpi-value">${(liveProfit / 1000).toFixed(0)}k</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Percent size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Margin</div>
                    <div className="kpi-value">{liveMargin}%</div>
                </div>
            </div>

            {invoices.some(i => i.status === 'Overdue') && (
                <div className="alert alert-danger">
                    <TriangleAlert size={16} />
                    <span>You have {invoices.filter(i => i.status === 'Overdue').length} overdue invoice(s). Total: ${invoices.filter(i => i.status === 'Overdue').reduce((a, i) => a + i.amount, 0).toLocaleString()}</span>
                </div>
            )}

            {/* Tab bar + Add button */}
            <div className="flex-row gap-2">
                {['dashboard', 'ledger', 'invoices', 'pl'].map(v => (
                    <button key={v} className={`btn-${view === v ? 'primary' : 'secondary'}`} onClick={() => setView(v)}>
                        {{ dashboard: 'Overview', ledger: 'Ledger', invoices: 'Invoices', pl: 'P&L' }[v]}
                    </button>
                ))}
            </div>

            {/* Dashboard view */}
            {view === 'dashboard' && (
                <div className="grid-2">
                    <div className="card">
                        <div className="card-title">Revenue vs Expenses</div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 120 }}>
                            {monthly.map(m => {
                                const maxVal = 165000;
                                const revH = Math.max((m.rev / maxVal) * 100, 2);
                                const expH = Math.max((m.exp / maxVal) * 100, 2);
                                return (
                                    <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
                                            <div style={{ width: 16, height: revH + '%', background: 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: 0.85 }} title={`Rev: $${(m.rev / 1000).toFixed(0)}k`} />
                                            <div style={{ width: 16, height: expH + '%', background: 'var(--danger)', borderRadius: '3px 3px 0 0', opacity: 0.7 }} title={`Exp: $${(m.exp / 1000).toFixed(0)}k`} />
                                        </div>
                                        <div className="bar-label">{m.month}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex-row gap-4 mt-4">
                            <div className="flex-row gap-2"><div style={{ width: 12, height: 12, background: 'var(--accent)', borderRadius: 2 }} /><span className="text-sm text-muted">Revenue</span></div>
                            <div className="flex-row gap-2"><div style={{ width: 12, height: 12, background: 'var(--danger)', borderRadius: 2 }} /><span className="text-sm text-muted">Expenses</span></div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-title">Expense Breakdown</div>
                        {[['Payroll', 81300], ['Facilities', 3200], ['Marketing', 6200], ['IT & Software', 890], ['Utilities', 450]].map(([cat, amt]) => (
                            <div key={cat}>
                                <div className="flex-between" style={{ marginBottom: 4 }}>
                                    <span className="text-sm">{cat}</span>
                                    <span className="text-sm" style={{ fontWeight: 600 }}>${amt.toLocaleString()}</span>
                                </div>
                                <div className="progress-bar" style={{ marginBottom: 10 }}>
                                    <div className="progress-fill progress-blue" style={{ width: `${Math.round(amt / liveExpenses * 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Ledger view */}
            {view === 'ledger' && (
                <div className="card">
                    <div className="flex-between mb-3">
                        <div className="card-title" style={{ marginBottom: 0 }}>Transaction Ledger — April 2026</div>
                        <span className="text-sm text-muted">{transactions.length} transactions</span>
                    </div>
                    <table className="data-table">
                        <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th></tr></thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id}>
                                    <td>{t.date}</td>
                                    <td style={{ fontWeight: 500 }}>{t.description}</td>
                                    <td><span className="badge badge-gray">{t.category}</span></td>
                                    <td><span className={`badge ${t.type === 'Credit' ? 'badge-green' : 'badge-red'}`}>{t.type}</span></td>
                                    <td style={{ fontWeight: 700, color: t.type === 'Credit' ? 'var(--accent)' : 'var(--danger)' }}>
                                        {t.type === 'Credit' ? '+' : '-'}${t.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Invoices view */}
            {view === 'invoices' && (
                <div className="card">
                    <div className="flex-between mb-4">
                        <div className="card-title" style={{ marginBottom: 0 }}>Invoice Management</div>
                    </div>
                    <table className="data-table">
                        <thead><tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{inv.id}</td>
                                    <td>{inv.client}</td>
                                    <td style={{ fontWeight: 600 }}>${inv.amount.toLocaleString()}</td>
                                    <td style={{ color: inv.status === 'Overdue' ? 'var(--danger)' : undefined }}>{inv.due}</td>
                                    <td><span className={`badge ${INV_BADGE[inv.status]}`}>{inv.status}</span></td>
                                    <td>
                                        <div className="flex-row gap-2">
                                            <button className="btn-secondary btn-sm" style={{ gap: 4 }} onClick={() => setViewInvoice(inv)}>
                                                <FileText size={12} /> View
                                            </button>
                                            {inv.status !== 'Paid' && (
                                                <button className="btn-primary btn-sm" style={{ gap: 4 }}
                                                    onClick={() => handleMarkPaid(inv.id)}>
                                                    <CheckCircle2 size={12} /> Mark Paid
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* P&L view */}
            {view === 'pl' && (
                <div className="card" style={{ maxWidth: 480 }}>
                    <div className="card-title">Profit &amp; Loss Summary — April 2026</div>
                    <div style={{ fontWeight: 600, color: 'var(--neutral-600)', marginBottom: 8 }}>Revenue</div>
                    <div className="payroll-line"><span>Service Revenue</span><span style={{ color: 'var(--accent)' }}>${liveRevenue.toLocaleString()}</span></div>
                    <div className="payroll-line" style={{ fontWeight: 700 }}><span>Total Revenue</span><span style={{ color: 'var(--accent)' }}>${liveRevenue.toLocaleString()}</span></div>
                    <div style={{ fontWeight: 600, color: 'var(--neutral-600)', marginTop: 12, marginBottom: 8 }}>Expenses</div>
                    {[['Payroll', 81300], ['Rent', 3200], ['Marketing', 6200], ['IT & Software', 890], ['Utilities', 450], ['Other', 6060]].map(([l, v]) => (
                        <div key={l} className="payroll-line"><span>{l}</span><span style={{ color: 'var(--danger)' }}>-${v.toLocaleString()}</span></div>
                    ))}
                    <div className="payroll-line" style={{ fontWeight: 700 }}><span>Total Expenses</span><span style={{ color: 'var(--danger)' }}>-${liveExpenses.toLocaleString()}</span></div>
                    <div className="payroll-total"><span>Net Profit</span><span style={{ color: 'var(--accent)' }}>${liveProfit.toLocaleString()}</span></div>
                    <div style={{ background: 'var(--accent-light)', padding: '10px 14px', borderRadius: 8, marginTop: 8 }}>
                        <div className="flex-between"><span className="text-sm">Net Profit Margin</span><span style={{ fontWeight: 700, color: 'var(--accent)' }}>{liveMargin}%</span></div>
                    </div>
                </div>
            )}

            {/* Add Transaction Modal */}
            {showModal && <AddTransactionModal onSave={handleAddTxn} onClose={() => setShowModal(false)} />}

            {/* Invoice View Modal */}
            {viewInvoice && (
                <InvoiceViewModal
                    inv={viewInvoice}
                    onClose={() => setViewInvoice(null)}
                    onMarkPaid={(id) => { handleMarkPaid(id); setViewInvoice(null); }}
                />
            )}

            {/* Add Invoice Modal */}
            {showInvModal && (
                <AddInvoiceModal
                    onSave={handleAddInvoice}
                    onClose={() => setShowInvModal(false)}
                />
            )}

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
