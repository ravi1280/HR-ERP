import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Download, Send, Plus, Search, Calendar, 
  ChevronRight, X, DollarSign, TrendingUp, ArrowUpRight, 
  ArrowDownRight, CreditCard, Landmark, PieChart, MoreVertical,
  Filter, DownloadCloud, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

const INITIAL_INVOICES = [
  { id: 'INV-001', client: 'Nexus Logistics', date: 'Oct 05, 2024', amount: '$12,400.00', status: 'Paid', method: 'Bank Transfer' },
  { id: 'INV-002', client: 'Global Tech', date: 'Oct 08, 2024', amount: '$4,250.00', status: 'Pending', method: 'Credit Card' },
  { id: 'INV-003', client: 'Horizon Media', date: 'Oct 10, 2024', amount: '$8,200.00', status: 'Overdue', method: 'Pending' },
  { id: 'INV-004', client: 'SwiftPay', date: 'Oct 12, 2024', amount: '$15,600.00', status: 'Paid', method: 'Stripe' },
  { id: 'INV-005', client: 'InnoSystems', date: 'Oct 15, 2024', amount: '$2,800.00', status: 'Draft', method: 'None' },
];

export default function Sales({ actionTrigger }) {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ client: '', amount: '', status: 'Draft' });
  const [searchTerm, setSearchTerm] = useState('');
  const lastTrigger = useRef(actionTrigger);

  useEffect(() => {
    if (actionTrigger > 0 && actionTrigger !== lastTrigger.current) {
      setIsAddModalOpen(true);
    }
    lastTrigger.current = actionTrigger;
  }, [actionTrigger]);

  const filteredInvoices = invoices.filter(inv => 
    inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInvoice = (e) => {
    e.preventDefault();
    const id = `INV-00${invoices.length + 1}`;
    setInvoices([{ ...newInvoice, id, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), method: 'Stripe' }, ...invoices]);
    setIsAddModalOpen(false);
    setNewInvoice({ client: '', amount: '', status: 'Draft' });
  };

  return (
    <div className="section-gap fade-in">
      {/* Sales Overview KPI Grid */}
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
            <span className="text-xs text-green flex-row gap-1" style={{ fontWeight: 600 }}>
              <ArrowUpRight size={14} /> +12.5%
            </span>
          </div>
          <div className="kpi-label">Monthly Revenue</div>
          <div className="kpi-value">$142,500</div>
          <div className="kpi-sub" style={{ marginTop: 4 }}>vs $128.4k last month</div>
        </div>

        <div className="kpi-card">
          <div className="flex-between mb-4">
            <div style={{ 
              width: 44, height: 44, borderRadius: 14, 
              background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Clock size={22} />
            </div>
            <span className="badge badge-amber" style={{ fontSize: 10 }}>Action Required</span>
          </div>
          <div className="kpi-label">Outstanding Invoices</div>
          <div className="kpi-value">$28,420</div>
          <div className="progress-bar mt-2" style={{ height: 4, background: 'rgba(0,0,0,0.05)' }}>
            <div className="progress-fill progress-amber" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex-between mb-4">
            <div style={{ 
              width: 44, height: 44, borderRadius: 14, 
              background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CreditCard size={22} />
            </div>
          </div>
          <div className="kpi-label">Collections Rate</div>
          <div className="kpi-value">94.2%</div>
          <div className="kpi-sub" style={{ marginTop: 4 }}>+2.1% efficiency</div>
        </div>

        <div className="kpi-card">
          <div className="flex-between mb-4">
            <div style={{ 
              width: 44, height: 44, borderRadius: 14, 
              background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Landmark size={22} />
            </div>
            <span className="text-xs text-muted" style={{ fontWeight: 600 }}>Net 30 Avg.</span>
          </div>
          <div className="kpi-label">Net Profit (MTD)</div>
          <div className="kpi-value">$54,200</div>
          <div className="kpi-sub" style={{ marginTop: 4 }}>38% profit margin</div>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="section-gap">
          {/* Main Invoice Table */}
          <div className="card">
            <div className="flex-between mb-6">
              <h3 className="card-title" style={{ margin: 0 }}>Recent Invoices</h3>
              <div className="flex-row gap-2">
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
                  <input 
                    className="search-input" 
                    style={{ paddingLeft: 30, height: 36 }} 
                    placeholder="Search invoices..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-secondary btn-sm" style={{ height: 36 }}><Filter size={14} /></button>
                <button className="btn-secondary btn-sm" style={{ height: 36 }}><DownloadCloud size={14} /></button>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600 }}>{inv.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inv.client}</div>
                      <div className="text-xs text-muted">{inv.method}</div>
                    </td>
                    <td className="text-muted">{inv.date}</td>
                    <td style={{ fontWeight: 600 }}>{inv.amount}</td>
                    <td>
                      <span className={`badge ${
                        inv.status === 'Paid' ? 'badge-green' : 
                        inv.status === 'Overdue' ? 'badge-red' : 
                        inv.status === 'Pending' ? 'badge-amber' : 'badge-gray'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <button style={{ background: 'none', border: 'none', color: 'var(--neutral-400)', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-secondary mt-4" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowAllTransactions(true)}>
              View All Transactions <ChevronRight size={14} />
            </button>
          </div>

          {/* Payment Activity */}
          <div className="card">
            <h3 className="card-title">Recent Payment Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { type: 'Payment Received', client: 'Nexus Logistics', amount: '+$12,400.00', date: '2 hours ago', icon: CheckCircle2, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                { type: 'Invoice Created', client: 'SwiftPay', amount: '$15,600.00', date: '5 hours ago', icon: Plus, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
                { type: 'Payment Overdue', client: 'Horizon Media', amount: '$8,200.00', date: '1 day ago', icon: AlertCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
              ].map((activity, i) => (
                <div key={i} className="flex-between">
                  <div className="flex-row gap-3">
                    <div style={{ 
                      width: 36, height: 36, borderRadius: 10, 
                      background: activity.bg, color: activity.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <activity.icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{activity.type}</div>
                      <div className="text-xs text-muted">{activity.client}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: activity.color }}>{activity.amount}</div>
                    <div className="text-xs text-muted">{activity.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-gap">
          {/* Revenue Forecast Card */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'var(--accent)', opacity: 0.05 }}></div>
            
            <div className="flex-between mb-2">
              <h3 className="card-title" style={{ margin: 0 }}>Revenue Forecast</h3>
              <TrendingUp size={16} color="var(--accent)" />
            </div>
            
            <div className="flex-row gap-2 align-end mb-4">
              <div style={{ fontSize: 28, fontWeight: 800 }}>$185,000</div>
              <div className="text-green text-xs font-700 mb-1 flex-row gap-1">
                <ArrowUpRight size={14} /> +15.2%
              </div>
            </div>

            {/* Simple Trend Line SVG */}
            <div style={{ height: 40, marginBottom: 16 }}>
              <svg width="100%" height="100%" viewBox="0 0 300 40" preserveAspectRatio="none">
                <path 
                  d="M0 35 L 50 32 L 100 38 L 150 25 L 200 28 L 250 15 L 300 10" 
                  fill="none" 
                  stroke="var(--accent)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M0 35 L 50 32 L 100 38 L 150 25 L 200 28 L 250 15 L 300 10 V 40 H 0 Z" 
                  fill="var(--accent)" 
                  fillOpacity="0.05" 
                />
              </svg>
            </div>

            <div className="progress-bar" style={{ background: 'var(--neutral-50)', height: 8, borderRadius: 4 }}>
              <div className="progress-fill" style={{ width: '72%', background: 'var(--accent)', borderRadius: 4 }}></div>
            </div>
            
            <div className="flex-between mt-3 text-xs">
              <span className="text-muted">Target: $250k</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>72.4% Achieved</span>
            </div>
          </div>

          {/* Revenue by Client */}
          <div className="card">
            <h3 className="card-title">Top Clients by Revenue</h3>
            <div className="section-gap">
              {[
                { name: 'Nexus Logistics', value: '$45,200', pct: 40 },
                { name: 'SwiftPay', value: '$32,400', pct: 28 },
                { name: 'Global Tech', value: '$18,900', pct: 16 },
                { name: 'Others', value: '$12,800', pct: 16 },
              ].map(client => (
                <div key={client.name}>
                  <div className="flex-between mb-2">
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{client.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{client.value}</span>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill progress-blue" style={{ width: `${client.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="card-title">Financial Reports</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}><FileText size={14} /> Profit & Loss Statement</button>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}><Download size={14} /> Tax Summary (2024)</button>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}><PieChart size={14} /> Expense Breakdown</button>
            </div>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 className="modal-title" style={{ margin: 0 }}>Create New Invoice</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddInvoice}>
              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input required className="form-input" value={newInvoice.client} onChange={e => setNewInvoice({...newInvoice, client: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Invoice Amount</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
                    <input required className="form-input" style={{ paddingLeft: 28 }} value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: `$${e.target.value}`})} placeholder="0.00" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-input form-select">
                    <option>Bank Transfer</option>
                    <option>Credit Card</option>
                    <option>Stripe</option>
                    <option>PayPal</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes / Instructions</label>
                <textarea className="form-input" style={{ height: 80 }} placeholder="Thank you for your business!"></textarea>
              </div>
              <div className="flex-row gap-2 mt-4" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Generate & Send Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Transactions Side Panel */}
      {showAllTransactions && (
        <div className="modal-overlay" onClick={() => setShowAllTransactions(false)} style={{ justifyContent: 'flex-end' }}>
          <div className="modal fade-in" onClick={e => e.stopPropagation()} style={{ height: '100vh', width: 500, borderRadius: 0, margin: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 24, borderBottom: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Transaction History</h2>
                <p className="text-xs text-muted">A full list of all your sales and payments</p>
              </div>
              <button onClick={() => setShowAllTransactions(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              <div className="section-gap">
                {[...invoices, ...invoices, ...invoices].map((inv, i) => (
                  <div key={i} style={{ 
                    padding: 14, borderRadius: 12, border: '1px solid var(--neutral-100)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: i % 2 === 0 ? 'rgba(0,0,0,0.01)' : '#fff',
                    marginBottom: 8
                  }}>
                    <div className="flex-row gap-3">
                      <div style={{ 
                        width: 40, height: 40, borderRadius: 12, 
                        background: inv.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: inv.status === 'Paid' ? '#10b981' : '#f59e0b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {inv.status === 'Paid' ? <ArrowUpRight size={18} /> : <Clock size={18} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{inv.client}</div>
                        <div className="text-xs text-muted" style={{ fontSize: 11 }}>{inv.date} · {inv.id}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: inv.status === 'Paid' ? '#10b981' : 'inherit' }}>{inv.amount}</div>
                      <span className={`badge ${
                        inv.status === 'Paid' ? 'badge-green' : 
                        inv.status === 'Overdue' ? 'badge-red' : 'badge-amber'
                      }`} style={{ fontSize: 9, padding: '2px 8px' }}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 20, borderTop: '1px solid var(--neutral-200)', background: 'var(--neutral-50)' }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <DownloadCloud size={16} /> Export Full Report (CSV)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
