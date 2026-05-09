import { useState, useRef, useEffect } from 'react';
import {
    Users, UserCheck, AlertTriangle, Building2,
    Search, Eye, Pencil, FileText, Mail, Phone,
    X, Plus, Save, UploadCloud, Trash2
} from 'lucide-react';
import { employees as initialEmployees } from '../data';

const DEPARTMENTS = ['Engineering', 'Human Resources', 'Finance', 'Sales', 'Operations', 'Marketing', 'Design'];
const ROLES = ['Sr. Developer', 'Jr. Developer', 'HR Manager', 'HR Executive', 'Accountant', 'Finance Lead', 'Sales Lead', 'Sales Executive', 'Operations', 'Marketing Lead', 'Designer'];
const STATUSES = ['Active', 'Probation', 'Resigned', 'Terminated'];

const STATUS_BADGE = {
    Active: 'badge-green',
    Probation: 'badge-amber',
    Resigned: 'badge-gray',
    Terminated: 'badge-red',
};

const AV_CLASSES = ['av-teal', 'av-blue', 'av-purple', 'av-orange', 'av-pink'];

function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const EMPTY_FORM = {
    name: '', email: '', phone: '', role: ROLES[0], department: DEPARTMENTS[0],
    startDate: new Date().toISOString().slice(0, 10), salary: '', status: 'Active',
};

/* ─── Add / Edit Modal ──────────────────────────────────── */
function EmployeeModal({ emp, onSave, onClose }) {
    const isEdit = !!emp;
    const [form, setForm] = useState(isEdit ? {
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        role: emp.role,
        department: emp.department,
        startDate: emp.startDate,
        salary: String(emp.salary),
        status: emp.status,
    } : { ...EMPTY_FORM });
    const [errors, setErrors] = useState({});

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.includes('@')) e.email = 'Valid email required';
        if (!form.salary || isNaN(Number(form.salary))) e.salary = 'Valid salary required';
        return e;
    };

    const handleSave = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        onSave(form);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ width: 560, maxHeight: '90vh', overflowY: 'auto' }} onClick={ev => ev.stopPropagation()}>
                {/* Header */}
                <div className="flex-between mb-4">
                    <div className="modal-title" style={{ marginBottom: 0 }}>
                        {isEdit ? `Edit — ${emp.name}` : 'Add New Employee'}
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-500)', display: 'flex' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Form grid */}
                <div className="grid-2" style={{ gap: 12 }}>
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input className={`form-input ${errors.name ? 'input-error' : ''}`}
                            placeholder="e.g. Kavitha Perera"
                            value={form.name} onChange={e => set('name', e.target.value)} />
                        {errors.name && <div className="field-error">{errors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input className={`form-input ${errors.email ? 'input-error' : ''}`}
                            type="email" placeholder="name@company.com"
                            value={form.email} onChange={e => set('email', e.target.value)} />
                        {errors.email && <div className="field-error">{errors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input className="form-input" placeholder="+94 77 000 0000"
                            value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Monthly Salary (USD) *</label>
                        <input className={`form-input ${errors.salary ? 'input-error' : ''}`}
                            type="number" placeholder="2500"
                            value={form.salary} onChange={e => set('salary', e.target.value)} />
                        {errors.salary && <div className="field-error">{errors.salary}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Department</label>
                        <select className="form-input form-select" value={form.department} onChange={e => set('department', e.target.value)}>
                            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Role / Job Title</label>
                        <select className="form-input form-select" value={form.role} onChange={e => set('role', e.target.value)}>
                            {ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input className="form-input" type="date"
                            value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Employment Status</label>
                        <select className="form-input form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="flex-row gap-2" style={{ justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '0.5px solid var(--neutral-200)' }}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" style={{ gap: 6 }} onClick={handleSave}>
                        <Save size={14} /> {isEdit ? 'Save Changes' : 'Add Employee'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ────────────────────────────────────── */
export default function EmployeeManagement({ actionTrigger }) {
    const [employees, setEmployees] = useState(initialEmployees);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [selected, setSelected] = useState(null);   // profile view
    const [modal, setModal] = useState(null);          // null | 'add' | empObject
    const [toast, setToast] = useState('');
    const [documentsMap, setDocumentsMap] = useState({}); // empId → [{name,size,url,type}]
    const lastTrigger = useRef(actionTrigger);

    useEffect(() => {
        if (actionTrigger > 0 && actionTrigger !== lastTrigger.current) {
            setModal('add');
        }
        lastTrigger.current = actionTrigger;
    }, [actionTrigger]);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const departments = ['All', ...new Set(employees.map(e => e.department))];
    const filtered = employees.filter(e => {
        const q = search.toLowerCase();
        const match = e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
        return match && (filter === 'All' || e.department === filter);
    });

    /* Save handler for both Add and Edit */
    const handleSave = (form) => {
        if (modal === 'add') {
            const newEmp = {
                id: Date.now(),
                name: form.name.trim(), email: form.email.trim(),
                phone: form.phone.trim() || 'N/A', role: form.role,
                department: form.department, startDate: form.startDate,
                salary: Number(form.salary), status: form.status,
                initials: getInitials(form.name),
                avClass: AV_CLASSES[Math.floor(Math.random() * AV_CLASSES.length)],
            };
            setEmployees(prev => [...prev, newEmp]);
            showToast(`✓ ${newEmp.name} added successfully`);
        } else {
            setEmployees(prev => prev.map(e =>
                e.id === modal.id
                    ? {
                        ...e, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || 'N/A',
                        role: form.role, department: form.department, startDate: form.startDate,
                        salary: Number(form.salary), status: form.status, initials: getInitials(form.name)
                    }
                    : e
            ));
            if (selected?.id === modal.id) {
                setSelected(prev => ({
                    ...prev, name: form.name.trim(), email: form.email.trim(),
                    phone: form.phone.trim() || 'N/A', role: form.role, department: form.department,
                    startDate: form.startDate, salary: Number(form.salary), status: form.status
                }));
            }
            showToast(`✓ ${form.name} updated successfully`);
        }
        setModal(null);
    };

    /* ─── Document helpers ─────────────────────── */
    const getDocsForEmp = (empId) => documentsMap[empId] || [];

    const handleFileDrop = (empId, files) => {
        const fileArr = Array.from(files);
        const newDocs = fileArr.map(f => ({
            name: f.name, size: f.size,
            url: URL.createObjectURL(f),
            type: f.type || 'application/octet-stream',
        }));
        setDocumentsMap(prev => ({ ...prev, [empId]: [...(prev[empId] || []), ...newDocs] }));
        showToast(`✓ ${fileArr.length} file(s) uploaded`);
    };

    const deleteDoc = (empId, idx) => {
        setDocumentsMap(prev => ({
            ...prev,
            [empId]: prev[empId].filter((_, i) => i !== idx)
        }));
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    /* ─── Profile view ─────────────────────────── */
    if (selected) {
        const emp = employees.find(e => e.id === selected.id) || selected;
        return (
            <div className="fade-in section-gap">
                <div className="flex-row gap-3 mb-4">
                    <button className="btn-secondary btn-sm" onClick={() => setSelected(null)}>← Back</button>
                    <span className="text-muted">Employee Profile</span>
                </div>
                <div className="grid-2">
                    <div className="card">
                        <div className="flex-row gap-3 mb-4">
                            <div className={`avatar avatar-lg ${emp.avClass}`}>{emp.initials}</div>
                            <div>
                                <div style={{ fontSize: 17, fontWeight: 700 }}>{emp.name}</div>
                                <div className="text-muted">{emp.role} · {emp.department}</div>
                                <span className={`badge ${STATUS_BADGE[emp.status]}`} style={{ marginTop: 4 }}>{emp.status}</span>
                            </div>
                        </div>
                        <div className="divider" />
                        <div className="card-title" style={{ marginTop: 12 }}>Personal Information</div>
                        {[['Email', emp.email, Mail], ['Phone', emp.phone, Phone], ['Department', emp.department, Building2], ['Role', emp.role, UserCheck]].map(([l, v, Icon]) => (
                            <div key={l} className="stat-row">
                                <span className="stat-label flex-row gap-2"><Icon size={13} /> {l}</span>
                                <span className="stat-value">{v}</span>
                            </div>
                        ))}
                        <div className="flex-row gap-2 mt-4">
                            <button className="btn-primary btn-sm" style={{ gap: 5 }} onClick={() => setModal(emp)}>
                                <Pencil size={12} /> Edit Profile
                            </button>
                        </div>
                    </div>
                    <div className="section-gap">
                        <div className="card">
                            <div className="card-title">Employment Details</div>
                            {[['Start Date', emp.startDate], ['Status', emp.status], ['Monthly Salary', `$${emp.salary.toLocaleString()}`], ['Annual CTC', `$${(emp.salary * 12).toLocaleString()}`]].map(([l, v]) => (
                                <div key={l} className="stat-row"><span className="stat-label">{l}</span><span className="stat-value">{v}</span></div>
                            ))}
                        </div>
                        <div className="card">
                            <div className="flex-between mb-3">
                                <div className="card-title" style={{ marginBottom: 0 }}>Documents</div>
                                <button className="btn-secondary btn-sm" style={{ gap: 5 }}
                                    onClick={() => fileInputRef.current?.click()}>
                                    <UploadCloud size={13} /> Upload
                                </button>
                                <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                    onChange={e => { handleFileDrop(emp.id, e.target.files); e.target.value = ''; }} />
                            </div>

                            {/* Drop zone */}
                            <div
                                className={`doc-dropzone ${dragOver ? 'doc-dropzone-active' : ''}`}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={e => { e.preventDefault(); setDragOver(false); handleFileDrop(emp.id, e.dataTransfer.files); }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <UploadCloud size={22} color={dragOver ? 'var(--accent)' : 'var(--neutral-400)'} strokeWidth={1.6} />
                                <div style={{ fontSize: 12, color: 'var(--neutral-500)', marginTop: 6, textAlign: 'center' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Click to upload</span> or drag &amp; drop<br />
                                    <span style={{ fontSize: 11 }}>PDF, DOC, XLS, JPG, PNG</span>
                                </div>
                            </div>

                            {/* Seeded default docs */}
                            {['Employment Contract.pdf', 'NIC Copy.pdf', 'Bank Details.pdf'].map(doc => (
                                <div key={doc} className="doc-row">
                                    <div className="flex-row gap-2">
                                        <FileText size={15} color="var(--neutral-500)" />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>{doc}</div>
                                            <div className="text-xs text-muted">Default • PDF</div>
                                        </div>
                                    </div>
                                    <span className="badge badge-gray">View</span>
                                </div>
                            ))}

                            {/* Uploaded docs */}
                            {getDocsForEmp(emp.id).map((doc, idx) => (
                                <div key={idx} className="doc-row">
                                    <div className="flex-row gap-2">
                                        <FileText size={15} color="var(--accent)" />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                                            <div className="text-xs text-muted">Uploaded • {formatSize(doc.size)}</div>
                                        </div>
                                    </div>
                                    <div className="flex-row gap-2">
                                        <a href={doc.url} target="_blank" rel="noreferrer" className="btn-secondary btn-sm" style={{ textDecoration: 'none' }}>View</a>
                                        <button className="btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                                            onClick={() => deleteDoc(emp.id, idx)}>
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {getDocsForEmp(emp.id).length === 0 && (
                                <div style={{ fontSize: 12, color: 'var(--neutral-400)', textAlign: 'center', padding: '8px 0' }}>
                                    No uploaded files yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {modal && (
                    <EmployeeModal emp={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
                )}
            </div>
        );
    }

    /* ─── Directory view ───────────────────────── */
    return (
        <div className="fade-in section-gap">
            {/* KPI row */}
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(107, 114, 128, 0.1)', color: '#6b7280',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Users size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Total Employees</div>
                    <div className="kpi-value">{employees.length}</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <UserCheck size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Active Now</div>
                    <div className="kpi-value">{employees.filter(e => e.status === 'Active').length}</div>
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
                    <div className="kpi-label">On Probation</div>
                    <div className="kpi-value">{employees.filter(e => e.status === 'Probation').length}</div>
                </div>
                <div className="kpi-card">
                    <div className="flex-between mb-4">
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 14, 
                            background: 'rgba(24, 95, 165, 0.1)', color: '#185FA5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Building2 size={22} />
                        </div>
                    </div>
                    <div className="kpi-label">Total Departments</div>
                    <div className="kpi-value">{new Set(employees.map(e => e.department)).size}</div>
                </div>
            </div>

            {/* Table card */}
            <div className="card">
                <div className="flex-between mb-4">
                    <div className="flex-row gap-2">
                        <div style={{ position: 'relative' }}>
                            <Search size={14} color="var(--neutral-400)"
                                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input className="search-input" style={{ paddingLeft: 30 }}
                                placeholder="Search employees..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="form-input form-select" style={{ width: 160 }}
                            value={filter} onChange={e => setFilter(e.target.value)}>
                            {departments.map(d => <option key={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Employee</th><th>Role</th><th>Department</th>
                            <th>Start Date</th><th>Salary</th><th>Status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--neutral-400)', padding: 32 }}>No employees found</td></tr>
                        )}
                        {filtered.map(emp => (
                            <tr key={emp.id}>
                                <td>
                                    <div className="flex-row gap-2">
                                        <div className={`avatar ${emp.avClass}`}>{emp.initials}</div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{emp.name}</div>
                                            <div className="text-xs text-muted">{emp.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{emp.role}</td>
                                <td>{emp.department}</td>
                                <td>{emp.startDate}</td>
                                <td>${emp.salary.toLocaleString()}</td>
                                <td><span className={`badge ${STATUS_BADGE[emp.status]}`}>{emp.status}</span></td>
                                <td>
                                    <div className="flex-row gap-2">
                                        <button className="btn-secondary btn-sm" style={{ gap: 4 }} onClick={() => setSelected(emp)}>
                                            <Eye size={12} /> View
                                        </button>
                                        <button className="btn-primary btn-sm" style={{ gap: 4 }} onClick={() => setModal(emp)}>
                                            <Pencil size={12} /> Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit modal */}
            {modal && (
                <EmployeeModal
                    emp={modal === 'add' ? null : modal}
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
