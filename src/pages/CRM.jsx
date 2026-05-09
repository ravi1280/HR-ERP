import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Phone, Mail, Globe, MapPin, TrendingUp, Users, X, Plus, ChevronRight, PieChart } from 'lucide-react';

const INITIAL_LEADS = [
  { id: 1, company: 'Nexus Logistics', contact: 'Sarah Miller', value: '$12,400', stage: 'Proposal', probability: 80, email: 'sarah@nexus.com' },
  { id: 2, company: 'Global Tech', contact: 'James Wilson', value: '$45,000', stage: 'Negotiation', probability: 60, email: 'james@globaltech.com' },
  { id: 3, company: 'Horizon Media', contact: 'Emma Davis', value: '$8,200', stage: 'Discovery', probability: 40, email: 'emma@horizon.com' },
  { id: 4, company: 'SwiftPay', contact: 'Robert Chen', value: '$15,600', stage: 'Closed Won', probability: 100, email: 'robert@swiftpay.com' },
];

const INITIAL_CONTACTS = [
  { id: 1, name: 'Alice Johnson', role: 'CTO', company: 'TechFlow', email: 'alice@techflow.com', phone: '+1 234 567 890', avClass: 'av-purple' },
  { id: 2, name: 'Bob Smith', role: 'Procurement Manager', company: 'BuildRight', email: 'bob@buildright.com', phone: '+1 345 678 901', avClass: 'av-blue' },
  { id: 3, name: 'Catherine Lee', role: 'CEO', company: 'InnoSystems', email: 'cat@innosystems.com', phone: '+1 456 789 012', avClass: 'av-pink' },
  { id: 4, name: 'David Miller', role: 'Project Manager', company: 'Nexus Logistics', email: 'david@nexus.com', phone: '+1 567 890 123', avClass: 'av-teal' },
  { id: 5, name: 'Elena Rodriguez', role: 'Marketing Director', company: 'Global Tech', email: 'elena@globaltech.com', phone: '+1 678 901 234', avClass: 'av-orange' },
  { id: 6, name: 'Frank Wright', role: 'Sales Lead', company: 'SwiftPay', email: 'frank@swiftpay.com', phone: '+1 789 012 345', avClass: 'av-purple' },
  { id: 7, name: 'Grace Chen', role: 'COO', company: 'Horizon Media', email: 'grace@horizon.com', phone: '+1 890 123 456', avClass: 'av-pink' },
];

export default function CRM({ actionTrigger }) {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [newLead, setNewLead] = useState({ company: '', contact: '', value: '', stage: 'Discovery' });
  const [newContact, setNewContact] = useState({ name: '', role: '', company: '', email: '', phone: '' });
  const lastTrigger = useRef(actionTrigger);

  useEffect(() => {
    if (actionTrigger > 0 && actionTrigger !== lastTrigger.current) {
      setIsAddModalOpen(true);
    }
    lastTrigger.current = actionTrigger;
  }, [actionTrigger]);

  const handleAddLead = (e) => {
    e.preventDefault();
    setLeads([{ ...newLead, id: Date.now(), probability: 10, email: 'new@company.com' }, ...leads]);
    setIsAddModalOpen(false);
    setNewLead({ company: '', contact: '', value: '', stage: 'Discovery' });
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    const avs = ['av-purple', 'av-blue', 'av-pink', 'av-teal', 'av-orange'];
    const randomAv = avs[Math.floor(Math.random() * avs.length)];
    setContacts([{ ...newContact, id: Date.now(), avClass: randomAv }, ...contacts]);
    setIsAddContactModalOpen(false);
    setNewContact({ name: '', role: '', company: '', email: '', phone: '' });
  };

  return (
    <div className="section-gap fade-in">
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="kpi-card">
          <div className="flex-between mb-4">
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Users size={22} />
            </div>
            <span className="text-xs text-green flex-row gap-1" style={{ fontWeight: 600 }}>
              +12.5%
            </span>
          </div>
          <div className="kpi-label">Total Leads</div>
          <div className="kpi-value">{leads.length + 1280}</div>
        </div>

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
          <div className="kpi-label">Pipeline Value</div>
          <div className="kpi-value">$428,500</div>
        </div>

        <div className="kpi-card">
          <div className="flex-between mb-4">
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <PieChart size={22} />
            </div>
          </div>
          <div className="kpi-label">Conversion Rate</div>
          <div className="kpi-value">24.8%</div>
          <div className="progress-bar mt-2" style={{ height: 4 }}><div className="progress-fill progress-purple" style={{ width: '24.8%' }}></div></div>
        </div>

        <div className="kpi-card" style={{ background: 'var(--accent)', color: '#fff' }}>
          <div className="flex-between mb-4">
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.2)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Plus size={22} />
            </div>
          </div>
          <div className="kpi-label" style={{ color: 'rgba(255,255,255,0.7)' }}>New Customers</div>
          <div className="kpi-value">12</div>
          <div className="kpi-sub" style={{ color: 'rgba(255,255,255,0.6)' }}>This week</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Pipeline Table */}
        <div className="card">
          <div className="flex-between mb-4">
            <h3 className="card-title" style={{ margin: 0 }}>Lead Pipeline</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} onClick={() => setSelectedLead(lead)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lead.company}</div>
                    <div className="text-xs text-muted">{lead.contact}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{lead.value}</td>
                  <td><span className={`badge ${lead.stage === 'Closed Won' ? 'badge-green' : 'badge-amber'}`}>{lead.stage}</span></td>
                  <td>
                    <div className="flex-row gap-2">
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill progress-blue" style={{ width: `${lead.probability}%` }}></div>
                      </div>
                      <span className="text-xs">{lead.probability}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contacts Grid */}
        <div className="card">
          <div className="flex-between mb-4">
            <h3 className="card-title" style={{ margin: 0 }}>Key Contacts</h3>
            <span className="text-xs text-accent font-600" style={{ cursor: 'pointer' }} onClick={() => setIsDirectoryOpen(true)}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {contacts.slice(0, 4).map(contact => (
              <div key={contact.id} className="flex-row gap-3" style={{
                padding: '4px 0', borderBottom: '1px solid var(--neutral-50)', paddingBottom: 12
              }}>
                <div className={`avatar ${contact.avClass || 'av-purple'}`} style={{ width: 40, height: 40, fontSize: 14 }}>{contact.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--neutral-900)' }}>{contact.name}</div>
                  <div className="text-xs text-muted" style={{ marginTop: 2 }}>{contact.role} <span style={{ opacity: 0.5 }}>•</span> {contact.company}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary mt-4" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsDirectoryOpen(true)}>
            <Users size={14} /> Open Full Directory
          </button>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 className="modal-title" style={{ margin: 0 }}>Add New Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddLead}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input required className="form-input" value={newLead.company} onChange={e => setNewLead({ ...newLead, company: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input required className="form-input" value={newLead.contact} onChange={e => setNewLead({ ...newLead, contact: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Estimated Value</label>
                  <input className="form-input" value={newLead.value} onChange={e => setNewLead({ ...newLead, value: e.target.value })} placeholder="$10,000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stage</label>
                  <select className="form-input form-select" value={newLead.stage} onChange={e => setNewLead({ ...newLead, stage: e.target.value })}>
                    <option>Discovery</option>
                    <option>Proposal</option>
                    <option>Negotiation</option>
                  </select>
                </div>
              </div>
              <div className="flex-row gap-2 mt-4" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Details Panel */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)} style={{ justifyContent: 'flex-end' }}>
          <div className="modal fade-in" onClick={e => e.stopPropagation()} style={{ height: '100vh', width: 450, borderRadius: 0, margin: 0 }}>
            <div className="flex-between mb-6">
              <span className={`badge ${selectedLead.stage === 'Closed Won' ? 'badge-green' : 'badge-amber'}`}>{selectedLead.stage}</span>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{selectedLead.company}</h2>
            <p className="text-muted mb-8">Primary Contact: {selectedLead.contact}</p>

            <div className="section-gap">
              <div className="card">
                <div className="card-title">Deal Information</div>
                <div className="stat-row"><span className="stat-label">Value</span><span className="stat-value">{selectedLead.value}</span></div>
                <div className="stat-row"><span className="stat-label">Probability</span><span className="stat-value">{selectedLead.probability}%</span></div>
                <div className="stat-row"><span className="stat-label">Last Activity</span><span className="stat-value">2 days ago</span></div>
              </div>

              <div className="card">
                <div className="card-title">Contact Details</div>
                <div className="stat-row"><span className="stat-label">Email</span><span className="stat-value">{selectedLead.email}</span></div>
                <div className="stat-row"><span className="stat-label">Phone</span><span className="stat-value">+1 (555) 000-0000</span></div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 40 }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Open Deal Workspace <ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Directory Side Panel */}
      {isDirectoryOpen && (
        <div className="modal-overlay" onClick={() => setIsDirectoryOpen(false)} style={{ justifyContent: 'flex-end' }}>
          <div className="modal fade-in" onClick={e => e.stopPropagation()} style={{ height: '100vh', width: 480, borderRadius: 0, margin: 0, display: 'flex', flexDirection: 'column', padding: 0 }}>
            <div style={{ padding: '24px 30px', borderBottom: '1px solid var(--neutral-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Contact Directory</h3>
                <p className="text-xs text-muted">Manage all your business relationships</p>
              </div>
              <button onClick={() => setIsDirectoryOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-400)' }}><X size={24} /></button>
            </div>

            <div style={{ padding: 20, borderBottom: '1px solid var(--neutral-50)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
                <input
                  className="search-input"
                  style={{ paddingLeft: 36, width: '100%', height: 40 }}
                  placeholder="Search contacts..."
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 30px 30px' }}>
              <div className="section-gap">
                {contacts.filter(c =>
                  c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                  c.role.toLowerCase().includes(contactSearch.toLowerCase()) ||
                  c.company.toLowerCase().includes(contactSearch.toLowerCase())
                ).map(contact => (
                  <div key={contact.id} style={{
                    padding: '16px 0', borderBottom: '1px solid var(--neutral-50)',
                    display: 'flex', gap: 16, alignItems: 'center'
                  }}>
                    <div className={`avatar ${contact.avClass || 'av-purple'}`} style={{ width: 44, height: 44, fontSize: 16 }}>{contact.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{contact.name}</div>
                      <div className="text-xs text-muted" style={{ marginBottom: 4 }}>{contact.role} @ {contact.company}</div>
                      <div className="flex-row gap-3 text-xs">
                        <span className="flex-row gap-1"><Mail size={12} className="text-muted" /> {contact.email}</span>
                        <span className="flex-row gap-1"><Phone size={12} className="text-muted" /> {contact.phone}</span>
                      </div>
                    </div>
                    <div className="flex-row gap-1">
                      <button className="btn-secondary btn-sm" style={{ padding: 8, borderRadius: 8 }}><Mail size={14} /></button>
                      <button className="btn-secondary btn-sm" style={{ padding: 8, borderRadius: 8 }}><Phone size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 24, background: 'var(--neutral-50)', borderTop: '1px solid var(--neutral-100)' }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsAddContactModalOpen(true)}>
                <Plus size={16} /> Add New Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddContactModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddContactModalOpen(false)} style={{ zIndex: 3000 }}>
          <div className="modal fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-6">
              <h3 className="modal-title" style={{ margin: 0 }}>Create New Contact</h3>
              <button onClick={() => setIsAddContactModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddContact}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required className="form-input" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} placeholder="e.g. John Doe" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Job Role</label>
                  <input required className="form-input" value={newContact.role} onChange={e => setNewContact({ ...newContact, role: e.target.value })} placeholder="e.g. CTO" />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input required className="form-input" value={newContact.company} onChange={e => setNewContact({ ...newContact, company: e.target.value })} placeholder="e.g. TechFlow" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input required type="email" className="form-input" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} placeholder="+1 234 567 890" />
              </div>
              <div className="flex-row gap-2 mt-6" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsAddContactModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
