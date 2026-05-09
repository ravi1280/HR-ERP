import { useState, useEffect } from 'react';
import {
  Sun, Moon, LogOut, Bell,
  LayoutDashboard, Users, CalendarDays, Umbrella,
  Wallet, BarChart3, Package,
  Briefcase, CircleDollarSign, Layers, Zap, Search
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import AttendanceTracking from './pages/AttendanceTracking';
import LeaveTracking from './pages/LeaveTracking';
import Payroll from './pages/Payroll';
import Accounting from './pages/Accounting';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import Projects from './pages/Projects';
import CRM from './pages/CRM';
import Sales from './pages/Sales';

const NAV = [
  {
    group: 'CORE', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'analytics', icon: Zap, label: 'Analytics' },
    ]
  },
  {
    group: 'HR', items: [
      { id: 'employees', icon: Users, label: 'Employees' },
      { id: 'attendance', icon: CalendarDays, label: 'Attendance' },
      { id: 'leave', icon: Umbrella, label: 'Leave' },
      { id: 'payroll', icon: Wallet, label: 'Payroll' },
    ]
  },
  {
    group: 'OPERATIONS', items: [
      { id: 'projects', icon: Briefcase, label: 'Projects' },
      { id: 'crm', icon: Layers, label: 'CRM' },
      { id: 'sales', icon: CircleDollarSign, label: 'Sales' },
    ]
  },
  {
    group: 'BUSINESS', items: [
      { id: 'accounting', icon: BarChart3, label: 'Accounting' },
      { id: 'inventory', icon: Package, label: 'Inventory' },
    ]
  },
];

const PAGE_META = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your HR & business metrics', action: 'Quick Report' },
  analytics: { title: 'Analytics', subtitle: 'Real-time performance metrics', action: 'Export Data' },
  employees: { title: 'Employee Management', subtitle: 'Manage your team and profiles', action: '+ Add Employee' },
  attendance: { title: 'Attendance Tracking', subtitle: 'Daily check-ins and monthly records', action: 'Export CSV' },
  leave: { title: 'Leave Management', subtitle: 'Track and approve employee leave', action: '+ Submit Leave' },
  payroll: { title: 'Payroll', subtitle: 'Monthly payroll run and payslips', action: 'Run Payroll' },
  projects: { title: 'Projects', subtitle: 'Manage team tasks and timelines', action: '+ New Project' },
  crm: { title: 'CRM', subtitle: 'Leads, contacts and pipelines', action: '+ Add Lead' },
  sales: { title: 'Sales & Invoicing', subtitle: 'Track orders and generate invoices', action: '+ New Invoice' },
  accounting: { title: 'Accounting', subtitle: 'Revenue, expenses, and financial reports', action: '+ Add Transaction' },
  inventory: { title: 'Inventory', subtitle: 'Stock tracking and reorder management', action: '+ Add Item' },
};

function Toast({ msg, onClose }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: 'var(--neutral-900)', color: 'var(--neutral-50)',
      padding: '12px 20px', borderRadius: 8, fontSize: 13, zIndex: 2000,
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease'
    }}>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 16 }}>×</button>
    </div>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [actionTrigger, setActionTrigger] = useState(0);


  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleAction = (action) => {
    setActionTrigger(prev => prev + 1);
  };

  // Command Palette State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Cmd+K
  useState(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredNav = NAV.flatMap(g => g.items).filter(i => 
    i.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Auth gate ──
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const meta = PAGE_META[page];

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>NexaHR</h1>
          <p>SME Suite · v2.0</p>
        </div>

        {NAV.map(({ group, items }) => (
          <div key={group}>
            <div className="sidebar-section-label">{group}</div>
            {items.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id}
                  className={`nav-item ${page === item.id ? 'active' : ''}`}
                  onClick={() => { setPage(item.id); setActionTrigger(0); }}>
                  <Icon size={16} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Sidebar user strip */}
        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex-row gap-2">
            <div className={`avatar ${user.avClass}`} style={{ width: 32, height: 32, fontSize: 12 }}>{user.initials}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ color: 'var(--neutral-500)', fontSize: 11 }}>{user.role}</div>
            </div>
            <button title="Sign out" onClick={() => setUser(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neutral-500)', display: 'flex', padding: 4, borderRadius: 6 }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-title">
            <h2>{meta.title}</h2>
            <p>{meta.subtitle}</p>
          </div>
          <div className="topbar-actions">
            {/* Theme Toggle */}
            <button 
              onClick={toggle}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              style={{
                width: 38, height: 38, borderRadius: 12, border: 'none',
                background: 'var(--neutral-100)', color: 'var(--neutral-600)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notification Bell */}
            <div style={{
              width: 38, height: 38, borderRadius: 12, background: 'var(--neutral-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              position: 'relative', color: 'var(--neutral-600)'
            }}>
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: 8, right: 8, width: 8, height: 8,
                background: '#ef4444', borderRadius: '50%', border: '2px solid #fff'
              }}></span>
            </div>

            <div style={{ width: 1, height: 24, background: 'var(--neutral-200)', margin: '0 8px' }}></div>

            <button className="btn-primary" onClick={() => handleAction(meta.action)}>
              {meta.action}
            </button>
          </div>
        </header>

        <main className="page-content">
          {page === 'dashboard' && <Dashboard />}
          {page === 'employees' && <EmployeeManagement actionTrigger={actionTrigger} />}
          {page === 'attendance' && <AttendanceTracking actionTrigger={actionTrigger} />}
          {page === 'leave' && <LeaveTracking actionTrigger={actionTrigger} />}
          {page === 'payroll' && <Payroll actionTrigger={actionTrigger} />}
          {page === 'accounting' && <Accounting actionTrigger={actionTrigger} />}
          {page === 'inventory' && <Inventory actionTrigger={actionTrigger} />}
          {page === 'analytics' && <Analytics />}
          {page === 'projects' && <Projects actionTrigger={actionTrigger} />}
          {page === 'crm' && <CRM actionTrigger={actionTrigger} />}
          {page === 'sales' && <Sales actionTrigger={actionTrigger} />}
        </main>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Command Palette Modal */}
      {showSearch && (
        <div className="modal-overlay" onClick={() => setShowSearch(false)}>
          <div className="modal fade-in" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden', width: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--neutral-100)' }}>
              <Search size={20} className="text-muted" style={{ marginRight: 12 }} />
              <input 
                autoFocus
                placeholder="Search modules, tasks, or settings... (Esc to close)"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent' }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ padding: '8px 0', maxHeight: 400, overflowY: 'auto' }}>
              <div className="sidebar-section-label" style={{ padding: '8px 20px' }}>Modules</div>
              {filteredNav.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="nav-item" 
                    style={{ color: 'var(--neutral-700)', padding: '10px 20px', borderLeft: 'none' }}
                    onClick={() => { setPage(item.id); setActionTrigger(0); setShowSearch(false); setSearchQuery(''); }}>
                    <Icon size={16} style={{ marginRight: 10 }} />
                    <span>{item.label}</span>
                  </div>
                );
              })}
              {filteredNav.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--neutral-400)', fontSize: 13 }}>
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
            <div style={{ padding: '12px 20px', background: 'var(--neutral-50)', borderTop: '1px solid var(--neutral-100)', display: 'flex', gap: 16 }}>
              <div className="text-xs text-muted"><span style={{ background: 'var(--neutral-200)', padding: '2px 4px', borderRadius: 4 }}>↵</span> to select</div>
              <div className="text-xs text-muted"><span style={{ background: 'var(--neutral-200)', padding: '2px 4px', borderRadius: 4 }}>↑↓</span> to navigate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
