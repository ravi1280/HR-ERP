import { useState, useEffect, useRef } from 'react';
import {
    Package, CheckCircle2, AlertTriangle, Siren,
    Search, Plus, RefreshCw, X, Save
} from 'lucide-react';
import { inventoryData } from '../data';

const STATUS_BADGE = { OK: 'badge-green', Low: 'badge-amber', Critical: 'badge-red' };
const CATS = ['Stationery', 'IT', 'Facilities'];
const CATEGORIES = ['All', ...CATS];

const EMPTY_ITEM = {
    name: '', sku: '', category: CATS[0],
    qty: 0, maxQty: 10, reorder: 5, supplier: ''
};

function InventoryModal({ item, onSave, onClose }) {
    const isEdit = !!item;
    const [form, setForm] = useState(isEdit ? {
        name: item.name,
        sku: item.sku,
        category: item.category,
        qty: String(item.qty),
        maxQty: String(item.maxQty),
        reorder: String(item.reorder),
        supplier: item.supplier
    } : { ...EMPTY_ITEM });
    const [errors, setErrors] = useState({});

    const set = (k, v) => {
        setForm(f => ({ ...f, [k]: v }));
        if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.sku.trim()) e.sku = 'SKU is required';
        if (!form.supplier.trim()) e.supplier = 'Supplier is required';
        if (isNaN(Number(form.qty))) e.qty = 'Must be a number';
        if (isNaN(Number(form.maxQty))) e.maxQty = 'Must be a number';
        if (isNaN(Number(form.reorder))) e.reorder = 'Must be a number';
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }

        const q = Number(form.qty);
        const r = Number(form.reorder);
        let status = 'OK';
        if (q === 0) status = 'Critical';
        else if (q <= r) status = 'Low';

        onSave({
            name: form.name.trim(),
            sku: form.sku.trim().toUpperCase(),
            category: form.category,
            qty: q,
            maxQty: Number(form.maxQty),
            reorder: r,
            supplier: form.supplier.trim(),
            status
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ width: 520 }} onClick={ev => ev.stopPropagation()}>
                <div className="flex-between mb-4">
                    <div className="modal-title" style={{ marginBottom: 0 }}>
                        {isEdit ? `Edit — ${item.name}` : 'Add New Inventory Item'}
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-500)' }}>
                        <X size={18} />
                    </button>
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Item Name *</label>
                        <input className={`form-input ${errors.name ? 'input-error' : ''}`}
                            placeholder="e.g. Dell Latitude 5420"
                            value={form.name} onChange={e => set('name', e.target.value)} />
                        {errors.name && <div className="field-error">{errors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">SKU Code *</label>
                        <input className={`form-input ${errors.sku ? 'input-error' : ''}`}
                            placeholder="e.g. IT-001"
                            value={form.sku} onChange={e => set('sku', e.target.value)} />
                        {errors.sku && <div className="field-error">{errors.sku}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-input form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                            {CATS.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Current Quantity</label>
                        <input className={`form-input ${errors.qty ? 'input-error' : ''}`}
                            type="number"
                            value={form.qty} onChange={e => set('qty', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Max Capacity</label>
                        <input className={`form-input ${errors.maxQty ? 'input-error' : ''}`}
                            type="number"
                            value={form.maxQty} onChange={e => set('maxQty', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Reorder Threshold</label>
                        <input className={`form-input ${errors.reorder ? 'input-error' : ''}`}
                            type="number"
                            value={form.reorder} onChange={e => set('reorder', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Supplier *</label>
                        <input className={`form-input ${errors.supplier ? 'input-error' : ''}`}
                            placeholder="Supplier Name"
                            value={form.supplier} onChange={e => set('supplier', e.target.value)} />
                        {errors.supplier && <div className="field-error">{errors.supplier}</div>}
                    </div>
                </div>

                <div className="flex-row gap-2" style={{ justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--neutral-200)' }}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" style={{ gap: 6 }} onClick={handleSave}>
                        <Save size={14} /> {isEdit ? 'Save Changes' : 'Add Item'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Inventory({ actionTrigger }) {
    const [items, setItems] = useState(inventoryData);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [reorderModal, setReorderModal] = useState(null);
    const [modal, setModal] = useState(null); // null | 'add' | item
    const [toast, setToast] = useState('');
    const lastTrigger = useRef(actionTrigger);

    useEffect(() => {
        if (actionTrigger > 0 && actionTrigger !== lastTrigger.current) {
            setModal('add');
        }
        lastTrigger.current = actionTrigger;
    }, [actionTrigger]);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const filtered = items.filter(i => {
        const matchCat = filter === 'All' || i.category === filter;
        const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const critical = items.filter(i => i.status === 'Critical').length;
    const low = items.filter(i => i.status === 'Low').length;
    const ok = items.filter(i => i.status === 'OK').length;

    const handleReorder = id => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.maxQty, status: 'OK' } : i));
        setReorderModal(null);
    };

    const handleSave = (form) => {
        if (modal === 'add') {
            const newItem = {
                id: Date.now(),
                ...form
            };
            setItems(prev => [...prev, newItem]);
            showToast(`✓ ${form.name} added to inventory`);
        } else {
            setItems(prev => prev.map(i => i.id === modal.id ? { ...i, ...form } : i));
            showToast(`✓ ${form.name} updated successfully`);
        }
        setModal(null);
    };

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
                            <Package size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Total SKUs</div><div className="kpi-value">{items.length}</div>
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
                    <div className="kpi-label">OK Stock</div><div className="kpi-value">{ok}</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(186, 117, 23, 0.1)', color: '#BA7517',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <AlertTriangle size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Low Stock</div><div className="kpi-value">{low}</div>
                </div>
                <div className="kpi-card" style={{ borderColor: 'var(--danger)' }}>
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(163, 45, 45, 0.1)', color: '#A32D2D',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Siren size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Critical</div><div className="kpi-value" style={{ color: 'var(--danger)' }}>{critical}</div>
                </div>
            </div>

            {critical > 0 && (
                <div className="alert alert-danger">
                    <Siren size={16} />
                    <span><strong>Critical Stock Alert:</strong> {items.filter(i => i.status === 'Critical').map(i => `${i.name} (${i.qty} left)`).join(', ')} — Immediate reorder required.</span>
                </div>
            )}
            {low > 0 && (
                <div className="alert alert-warning">
                    <AlertTriangle size={16} />
                    <span><strong>Low Stock:</strong> {items.filter(i => i.status === 'Low').map(i => i.name).join(', ')} — Below reorder threshold.</span>
                </div>
            )}

            <div className="card">
                <div className="flex-between mb-4">
                    <div className="flex-row gap-2">
                        <div style={{ position: 'relative' }}>
                            <Search size={14} color="var(--neutral-400)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input className="search-input" style={{ paddingLeft: 30 }} placeholder="Search SKU or name..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="form-input form-select" style={{ width: 140 }} value={filter} onChange={e => setFilter(e.target.value)}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr><th>SKU</th><th>Item</th><th>Category</th><th>Stock Level</th><th>Qty / Max</th><th>Reorder At</th><th>Supplier</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filtered.map(item => {
                            const pct = Math.round((item.qty / item.maxQty) * 100);
                            const barCls = item.status === 'OK' ? 'progress-green' : item.status === 'Low' ? 'progress-amber' : 'progress-red';
                            return (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--neutral-500)', fontSize: 12 }}>{item.sku}</td>
                                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                                    <td><span className="badge badge-gray">{item.category}</span></td>
                                    <td style={{ minWidth: 120 }}>
                                        <div className="progress-bar"><div className={`progress-fill ${barCls}`} style={{ width: pct + '%' }} /></div>
                                        <div className="text-xs text-muted" style={{ marginTop: 3 }}>{pct}% stocked</div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{item.qty} <span className="text-muted">/ {item.maxQty}</span></td>
                                    <td>{item.reorder}</td>
                                    <td>{item.supplier}</td>
                                    <td><span className={`badge ${STATUS_BADGE[item.status]}`}>{item.status}</span></td>
                                    <td>
                                        <div className="flex-row gap-2">
                                            {item.status !== 'OK' && (
                                                <button className="btn-primary btn-sm" style={{ gap: 4 }} onClick={() => setReorderModal(item)}>
                                                    <RefreshCw size={11} /> Reorder
                                                </button>
                                            )}
                                            <button className="btn-secondary btn-sm" onClick={() => setModal(item)}>Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {reorderModal && (
                <div className="modal-overlay" onClick={() => setReorderModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Reorder — {reorderModal.name}</div>
                        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
                            <AlertTriangle size={15} />
                            <span>Current stock: <strong>{reorderModal.qty} units</strong> · Threshold: <strong>{reorderModal.reorder} units</strong></span>
                        </div>
                        {[['SKU', reorderModal.sku], ['Supplier', reorderModal.supplier], ['Category', reorderModal.category], ['Restock to', `${reorderModal.maxQty} units`]].map(([l, v]) => (
                            <div key={l} className="stat-row"><span className="stat-label">{l}</span><span className="stat-value">{v}</span></div>
                        ))}
                        <div className="flex-row gap-2" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
                            <button className="btn-secondary" onClick={() => setReorderModal(null)}>Cancel</button>
                            <button className="btn-primary" style={{ gap: 6 }} onClick={() => handleReorder(reorderModal.id)}>
                                <CheckCircle2 size={14} /> Confirm Reorder
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {modal && (
                <InventoryModal
                    item={modal === 'add' ? null : modal}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                />
            )}

            {/* In-page toast */}
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
