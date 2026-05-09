import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, Plus, Calendar, CheckCircle2, Clock, 
  X, User, Target, BarChart, MessageSquare, Paperclip,
  ChevronRight, AlertCircle, ArrowLeft, Layout, Users, 
  Settings, ClipboardList, Filter, Search, Save, Trash2, 
  GripVertical, Edit3, Shield, Globe
} from 'lucide-react';

const INITIAL_PROJECTS = [
  { 
    id: 1, name: 'Brand Refresh 2024', client: 'Acme Corp', progress: 65, status: 'Active', tasksCount: 12, deadline: '2024-10-24',
    description: 'Complete overhaul of the brand identity including logo, typography, and digital assets.',
    team: [
      { id: 'rk', name: 'Ravi K.', initials: 'RK', role: 'Project Lead', avClass: 'av-teal', email: 'ravi@nexahr.com' },
      { id: 'js', name: 'Jane S.', initials: 'JS', role: 'Lead Designer', avClass: 'av-blue', email: 'jane@nexahr.com' },
      { id: 'ml', name: 'Mike L.', initials: 'ML', role: 'Brand Strategist', avClass: 'av-purple', email: 'mike@nexahr.com' },
    ],
    budget: '$15,000',
    priority: 'High',
    visibility: 'Public',
    sprints: [
      { id: 1, name: 'Sprint 1: Discovery', status: 'Completed', dates: 'Sep 01 - Sep 14' },
      { id: 2, name: 'Sprint 2: Design Concepts', status: 'Active', dates: 'Sep 15 - Sep 28' },
      { id: 3, name: 'Sprint 3: Asset Creation', status: 'Planned', dates: 'Sep 29 - Oct 12' },
    ],
    tasks: [
      { id: 101, title: 'Logo Sketches', priority: 'High', status: 'In Progress', assignee: 'js', date: '2024-10-12' },
      { id: 102, title: 'Color Palette Definition', priority: 'Medium', status: 'Review', assignee: 'js', date: '2024-10-15' },
      { id: 103, title: 'Stakeholder Interviews', priority: 'High', status: 'Completed', assignee: 'rk', date: '2024-09-10' },
      { id: 104, title: 'Competitor Analysis', priority: 'Low', status: 'Completed', assignee: 'ml', date: '2024-09-05' },
    ]
  },
  { 
    id: 2, name: 'Q3 Financial Audit', client: 'Internal', progress: 90, status: 'On Track', tasksCount: 8, deadline: '2024-09-30',
    description: 'Quarterly audit of all financial records and compliance reports.',
    team: [
      { id: 'ad', name: 'Anura D.', initials: 'AD', role: 'Auditor', avClass: 'av-orange', email: 'anura@nexahr.com' },
      { id: 'rk', name: 'Ravi K.', initials: 'RK', role: 'Supervisor', avClass: 'av-teal', email: 'ravi@nexahr.com' },
    ],
    budget: '$5,000',
    priority: 'Medium',
    visibility: 'Private',
    sprints: [],
    tasks: []
  },
];

/* ─── Project Workspace Component ────────────────────────── */
function ProjectWorkspace({ initialProject, onBack, onUpdate }) {
  const [project, setProject] = useState(initialProject);
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState(initialProject.tasks || []);
  const [team, setTeam] = useState(initialProject.team || []);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({ title: '', assignee: '', priority: 'Medium', date: '' });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress' || t.status === 'Review').length,
  };

  // Drag & Drop Handlers
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("taskId", id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, newStatus) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    setProject({ ...project, tasks: updatedTasks });
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const id = Date.now();
    const taskToAdd = { ...newTaskForm, id, status: 'To Do' };
    const updatedTasks = [...tasks, taskToAdd];
    setTasks(updatedTasks);
    setProject({ ...project, tasks: updatedTasks });
    setIsTaskModalOpen(false);
    setNewTaskForm({ title: '', assignee: '', priority: 'Medium', date: '' });
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    setIsEditing(false);
    onUpdate(project);
  };

  const KanbanColumn = ({ title, status }) => (
    <div style={{ flex: 1, minWidth: 280 }} onDragOver={onDragOver} onDrop={(e) => onDrop(e, status)}>
      <div className="flex-between mb-4" style={{ padding: '0 4px' }}>
        <h4 className="kpi-label" style={{ fontSize: 11 }}>{title} ({tasks.filter(t => t.status === status).length})</h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 200, background: 'rgba(0,0,0,0.02)', borderRadius: 12, padding: 8 }}>
        {tasks.filter(t => t.status === status).map(task => {
          const assignee = team.find(m => m.id === task.assignee);
          return (
            <div key={task.id} className="card" draggable onDragStart={(e) => onDragStart(e, task.id)} style={{ padding: 16, cursor: 'grab' }}>
              <div className="flex-row gap-2 mb-2">
                <GripVertical size={12} className="text-muted" />
                <span className={`badge ${task.priority === 'High' || task.priority === 'Critical' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: 9 }}>
                  {task.priority}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{task.title}</div>
              <div className="flex-between">
                <div className="flex-row gap-2 text-xs text-muted"><Calendar size={12} /> {task.date}</div>
                {assignee && (
                  <div className={`avatar ${assignee.avClass}`} title={assignee.name} style={{ width: 24, height: 24, fontSize: 9 }}>
                    {assignee.initials}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {tasks.filter(t => t.status === status).length === 0 && (
          <div style={{ flex: 1, border: '2px dashed var(--neutral-200)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-400)', fontSize: 12 }}>
            Drop here
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fade-in section-gap">
      {/* Workspace Header */}
      <div className="flex-between">
        <div className="flex-row gap-4">
          <button className="btn-secondary btn-sm" onClick={onBack}><ArrowLeft size={16} /> Back</button>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{project.name}</h2>
            <p className="text-xs text-muted">{project.client} · {project.status}</p>
          </div>
        </div>
        <div className="flex-row gap-2">
          <div className="flex-row -space-x-2" style={{ display: 'flex', marginRight: 12 }}>
            {team.map((m, i) => (
              <div key={i} className={`avatar ${m.avClass}`} style={{ width: 32, height: 32, border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0 }}>{m.initials}</div>
            ))}
          </div>
          {activeTab === 'board' && (
            <button className="btn-primary" onClick={() => setIsTaskModalOpen(true)}><Plus size={16} /> New Task</button>
          )}
        </div>
      </div>

      {/* Workspace Tabs */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--neutral-200)', marginBottom: 8 }}>
        {[
          { id: 'overview', label: 'Overview', icon: Layout },
          { id: 'board', label: 'Task Board', icon: ClipboardList },
          { id: 'team', label: 'Team', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => (
          <div key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 4px', cursor: 'pointer',
              fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--neutral-500)',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'transparent'}`,
              transition: 'all 0.2s'
            }}>
            <tab.icon size={16} /> {tab.label}
          </div>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="section-gap fade-in">
          {/* Quick Metrics Row */}
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div className="card" style={{ padding: 16 }}>
              <div className="text-xs kpi-label mb-1">Time Elapsed</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>18 Days</div>
              <div className="text-xs text-muted">45% of total timeline</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div className="text-xs kpi-label mb-1">Tasks Done</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.completed} / {stats.total}</div>
              <div className="progress-bar mt-1" style={{ height: 4 }}><div className="progress-fill progress-green" style={{ width: `${(stats.completed / stats.total) * 100 || 0}%` }}></div></div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div className="text-xs kpi-label mb-1">Active Members</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{team.length}</div>
              <div className="text-xs text-muted">3 currently online</div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div className="text-xs kpi-label mb-1">Budget Burn</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>$8,400</div>
              <div className="text-xs text-muted">56% of {project.budget}</div>
            </div>
          </div>

          <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <div className="section-gap">
              {/* Project Info & Description */}
              <div className="card">
                <div className="flex-between mb-4">
                  <h3 className="card-title" style={{ margin: 0 }}>Project Summary</h3>
                </div>
                <div style={{ fontSize: 14, color: 'var(--neutral-700)', lineHeight: 1.6, marginBottom: 20 }}>{project.description}</div>
                <div className="grid-2" style={{ gap: 20 }}>
                  <div><div className="text-xs text-muted mb-1">Target Audience</div><div style={{ fontWeight: 600, fontSize: 13 }}>{project.targetAudience || 'Enterprise Users'}</div></div>
                  <div><div className="text-xs text-muted mb-1">Primary Objective</div><div style={{ fontWeight: 600, fontSize: 13 }}>{project.primaryObjective || 'Modernize brand presence'}</div></div>
                  <div><div className="text-xs text-muted mb-1">Tech Stack</div><div style={{ fontWeight: 600, fontSize: 13 }}>{project.techStack || 'React, Node.js, PostgreSQL'}</div></div>
                  <div><div className="text-xs text-muted mb-1">Key Deliverables</div><div style={{ fontWeight: 600, fontSize: 13 }}>{project.deliverables || 'Mobile App, Admin Dashboard'}</div></div>
                </div>
                <div className="mt-4" style={{ paddingTop: 16, borderTop: '1px solid var(--neutral-100)' }}>
                  <div className="text-xs text-muted mb-1">Main Stakeholders</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{project.stakeholders || 'Product Owners, Marketing Team'}</div>
                </div>
              </div>

              {/* Timeline / Milestones */}
              <div className="card">
                <h3 className="card-title">Project Roadmap</h3>
                <div style={{ position: 'relative', paddingLeft: 20 }}>
                  <div style={{ position: 'absolute', left: 4, top: 0, bottom: 0, width: 2, background: 'var(--neutral-100)' }}></div>
                  {[
                    { title: 'Kickoff & Discovery', date: 'Sep 01', status: 'Completed' },
                    { title: 'Conceptual Design', date: 'Sep 15', status: 'In Progress' },
                    { title: 'Final Review', date: 'Oct 10', status: 'Pending' },
                    { title: 'Project Handoff', date: 'Oct 24', status: 'Pending' },
                  ].map((m, i) => (
                    <div key={i} className="mb-6" style={{ position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute', left: -21, top: 4, width: 10, height: 10, borderRadius: '50%',
                        background: m.status === 'Completed' ? 'var(--accent)' : m.status === 'In Progress' ? 'var(--warning)' : 'var(--neutral-300)',
                        border: '2px solid #fff'
                      }}></div>
                      <div className="flex-between">
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{m.title}</div>
                        <div className="text-xs text-muted">{m.date}</div>
                      </div>
                      <div className="text-xs text-muted">{m.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-gap">
              {/* Upcoming Deadlines */}
              <div className="card">
                <h3 className="card-title">Upcoming Deadlines</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { title: 'Design Handoff', date: 'In 2 days', urgent: true },
                    { title: 'Client Feedback', date: 'In 5 days', urgent: false },
                  ].map(d => (
                    <div key={d.title} className="flex-between p-2" style={{ background: d.urgent ? 'var(--danger-light)' : 'var(--neutral-50)', borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: d.urgent ? 'var(--danger)' : 'inherit' }}>{d.title}</div>
                      <div className="text-xs text-muted">{d.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Allocation */}
              <div className="card">
                <h3 className="card-title">Resource Allocation</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {team.map(m => (
                    <div key={m.id}>
                      <div className="flex-between mb-1">
                        <span className="text-xs font-600">{m.name}</span>
                        <span className="text-xs text-muted">75%</span>
                      </div>
                      <div className="progress-bar" style={{ height: 4 }}><div className="progress-fill progress-blue" style={{ width: '75%' }}></div></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Sprints */}
              <div className="card">
                <h3 className="card-title">Active Sprints</h3>
                {project.sprints?.map(s => (
                  <div key={s.id} className="flex-between py-3" style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                      <div className="text-xs text-muted">{s.dates}</div>
                    </div>
                    <span className={`badge ${s.status === 'Completed' ? 'badge-gray' : 'badge-green'}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'board' && (
        <div className="section-gap fade-in">
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 20 }}>
            <KanbanColumn title="To Do" status="To Do" />
            <KanbanColumn title="In Progress" status="In Progress" />
            <KanbanColumn title="Review" status="Review" />
            <KanbanColumn title="Completed" status="Completed" />
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="card">
          <div className="flex-between mb-6">
            <h3 className="card-title" style={{ margin: 0 }}>Project Team ({team.length})</h3>
            <button className="btn-primary btn-sm" onClick={() => setIsTeamModalOpen(true)}><Plus size={14} /> Add Member</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th><th>Role</th><th>Email</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="flex-row gap-3">
                      <div className={`avatar ${member.avClass}`}>{member.initials}</div>
                      <div style={{ fontWeight: 600 }}>{member.name}</div>
                    </div>
                  </td>
                  <td>{member.role}</td>
                  <td className="text-muted">{member.email}</td>
                  <td><span className="badge badge-green">Online</span></td>
                  <td>
                    <button className="btn-secondary btn-sm" onClick={() => setEditingMember(member)}>Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="section-gap fade-in">
          <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
            {/* General Settings */}
            <div className="card">
              <h3 className="card-title mb-6">General Configuration</h3>
              <form className="section-gap" onSubmit={handleUpdateProject}>
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input className="form-input" value={project.name} onChange={e => setProject({...project, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Project Description</label>
                  <textarea className="form-input" style={{ height: 100 }} value={project.description} onChange={e => setProject({...project, description: e.target.value})} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <input className="form-input" value={project.targetAudience || ''} onChange={e => setProject({...project, targetAudience: e.target.value})} placeholder="e.g. Enterprise Users" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primary Objective</label>
                    <input className="form-input" value={project.primaryObjective || ''} onChange={e => setProject({...project, primaryObjective: e.target.value})} placeholder="e.g. Modernize brand" />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Tech Stack</label>
                    <input className="form-input" value={project.techStack || ''} onChange={e => setProject({...project, techStack: e.target.value})} placeholder="e.g. React, Node.js" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Key Deliverables</label>
                    <input className="form-input" value={project.deliverables || ''} onChange={e => setProject({...project, deliverables: e.target.value})} placeholder="e.g. Website, Mobile App" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Main Stakeholders</label>
                  <input className="form-input" value={project.stakeholders || ''} onChange={e => setProject({...project, stakeholders: e.target.value})} placeholder="e.g. CEO, Marketing Manager" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Client</label>
                    <input className="form-input" value={project.client} onChange={e => setProject({...project, client: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Type</label>
                    <select className="form-input form-select" value={project.type || 'Client'}>
                      <option>Client</option>
                      <option>Internal</option>
                      <option>R&D</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Budget</label>
                    <input className="form-input" value={project.budget} onChange={e => setProject({...project, budget: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select className="form-input form-select">
                      <option>USD ($)</option>
                      <option>LKR (Rs.)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-input form-select" value={project.priority} onChange={e => setProject({...project, priority: e.target.value})}>
                      <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-input" defaultValue="2024-09-01" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input type="date" className="form-input" value={project.deadline} onChange={e => setProject({...project, deadline: e.target.value})} />
                  </div>
                </div>

                <div className="flex-row gap-2 mt-4" style={{ paddingTop: 20, borderTop: '1px solid var(--neutral-100)' }}>
                  <button type="submit" className="btn-primary" style={{ gap: 6 }}><Save size={14} /> Save Changes</button>
                </div>
              </form>
            </div>

            {/* Access & Advanced */}
            <div className="section-gap">
              <div className="card">
                <h3 className="card-title mb-4">Modules & Features</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { label: 'Kanban Board', desc: 'Enable task tracking', active: true },
                    { label: 'Timesheets', desc: 'Track member hours', active: false },
                    { label: 'Documents', desc: 'Project file storage', active: true },
                    { label: 'Client Portal', desc: 'External view for clients', active: false },
                  ].map(m => (
                    <div key={m.label} className="flex-between">
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</div>
                        <div className="text-xs text-muted">{m.desc}</div>
                      </div>
                      <div style={{ 
                        width: 32, height: 18, borderRadius: 9, background: m.active ? 'var(--accent)' : 'var(--neutral-300)',
                        position: 'relative', cursor: 'pointer'
                      }}>
                        <div style={{ 
                          width: 14, height: 14, borderRadius: '50%', background: '#fff',
                          position: 'absolute', top: 2, left: m.active ? 16 : 2, transition: '0.2s'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title mb-4">Security</h3>
                <div className="form-group">
                  <label className="form-label">Visibility</label>
                  <select className="form-input form-select" value={project.visibility} onChange={e => setProject({...project, visibility: e.target.value})}>
                    <option value="Public">Public (Whole team)</option>
                    <option value="Private">Private (Members only)</option>
                  </select>
                </div>
                <div className="flex-between mt-4">
                  <div className="text-xs text-muted">Restrict Member Invitations</div>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>

              <div className="card" style={{ border: '1px solid var(--danger-light)', background: 'rgba(163, 45, 45, 0.02)' }}>
                <h3 className="card-title" style={{ color: 'var(--danger)' }}>Danger Zone</h3>
                <p className="text-xs text-muted mb-4">Actions here are permanent and cannot be undone.</p>
                <div className="section-gap">
                  <button className="btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--danger)', color: 'var(--danger)' }}>Archive Project</button>
                  <button className="btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Delete Project</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {isTaskModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTaskModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 className="modal-title" style={{ margin: 0 }}>Add New Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input required className="form-input" value={newTaskForm.title} onChange={e => setNewTaskForm({...newTaskForm, title: e.target.value})} placeholder="What needs to be done?" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select required className="form-input form-select" value={newTaskForm.assignee} onChange={e => setNewTaskForm({...newTaskForm, assignee: e.target.value})}>
                    <option value="">Select Member</option>
                    {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input form-select" value={newTaskForm.priority} onChange={e => setNewTaskForm({...newTaskForm, priority: e.target.value})}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input required type="date" className="form-input" value={newTaskForm.date} onChange={e => setNewTaskForm({...newTaskForm, date: e.target.value})} />
              </div>
              <div className="flex-row gap-2 mt-4" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Member Modal */}
      {isTeamModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTeamModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 400 }}>
            <div className="flex-between mb-4">
              <h3 className="modal-title" style={{ margin: 0 }}>Add Team Member</h3>
              <button onClick={() => setIsTeamModalOpen(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" placeholder="colleague@company.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input form-select">
                <option>Developer</option>
                <option>Designer</option>
                <option>Manager</option>
                <option>Stakeholder</option>
              </select>
            </div>
            <button className="btn-primary mt-4" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsTeamModalOpen(false)}>
              Send Invitation
            </button>
          </div>
        </div>
      )}

      {/* Manage Member Modal */}
      {editingMember && (
        <div className="modal-overlay" onClick={() => setEditingMember(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 400 }}>
            <div className="flex-between mb-4">
              <h3 className="modal-title" style={{ margin: 0 }}>Manage Member</h3>
              <button onClick={() => setEditingMember(null)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <div className="flex-row gap-3 mb-6">
              <div className={`avatar avatar-lg ${editingMember.avClass}`}>{editingMember.initials}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{editingMember.name}</div>
                <div className="text-muted">{editingMember.email}</div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Project Role</label>
              <input className="form-input" defaultValue={editingMember.role} />
            </div>
            <div className="form-group">
              <label className="form-label">Access Level</label>
              <select className="form-input form-select" defaultValue="Full Access">
                <option>Full Access</option>
                <option>Read Only</option>
                <option>Limited Access</option>
              </select>
            </div>
            <div className="flex-row gap-2 mt-6">
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditingMember(null)}>Update Member</button>
              <button className="btn-danger btn-sm" style={{ padding: '8px 12px' }}><Trash2 size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Details Inline Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 className="modal-title" style={{ margin: 0 }}>Edit Project Details</h3>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateProject}>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" style={{ height: 120 }} value={project.description} onChange={e => setProject({...project, description: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Budget</label>
                  <input className="form-input" value={project.budget} onChange={e => setProject({...project, budget: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input form-select" value={project.priority} onChange={e => setProject({...project, priority: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex-row gap-2 mt-4" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Projects Page ─────────────────────────── */
export default function Projects({ actionTrigger }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProject, setNewProject] = useState({ name: '', client: '', deadline: '', budget: '', priority: 'Medium' });

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lastTrigger = useRef(actionTrigger);

  useEffect(() => {
    if (actionTrigger > 0 && actionTrigger !== lastTrigger.current) {
      setIsAddModalOpen(true);
    }
    lastTrigger.current = actionTrigger;
  }, [actionTrigger]);

  if (activeWorkspace) {
    return <ProjectWorkspace 
      initialProject={activeWorkspace} 
      onBack={() => setActiveWorkspace(null)} 
      onUpdate={(updated) => {
        setProjects(projects.map(p => p.id === updated.id ? updated : p));
        setActiveWorkspace(updated);
      }}
    />;
  }

  const handleAddProject = (e) => {
    e.preventDefault();
    const id = projects.length + 1;
    const projectToAdd = {
      ...newProject,
      id,
      progress: 0,
      status: 'Planning',
      tasksCount: 0,
      team: [{ id: 'rk', name: 'Ravi K.', initials: 'RK', role: 'Project Lead', avClass: 'av-teal', email: 'ravi@nexahr.com' }],
      description: 'New project created today.'
    };
    setProjects([projectToAdd, ...projects]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="section-gap fade-in">
      <div className="flex-between">
        <div className="flex-row gap-2">
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-secondary btn-sm">Filter</button>
        </div>
      </div>

      <div className="grid-2">
        {filteredProjects.map(proj => (
          <div key={proj.id} className="card" onClick={() => setActiveWorkspace(proj)} style={{ cursor: 'pointer' }}>
            <div className="flex-between mb-4">
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{proj.name}</h3>
                <p className="text-xs text-muted">{proj.client}</p>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--neutral-400)' }} onClick={(e) => { e.stopPropagation(); }}>
                <MoreVertical size={16} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex-between text-xs mb-1">
                <span className="text-muted">Progress</span>
                <span style={{ fontWeight: 600 }}>{proj.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${proj.status === 'Delayed' ? 'progress-red' : 'progress-green'}`} style={{ width: `${proj.progress}%` }}></div>
              </div>
            </div>

            <div className="flex-between">
              <div className="flex-row gap-4">
                <div className="flex-row gap-1 text-xs text-muted"><CheckCircle2 size={12} /> {proj.tasksCount} Tasks</div>
                <div className="flex-row gap-1 text-xs text-muted"><Calendar size={12} /> {proj.deadline}</div>
              </div>
              <span className={`badge ${proj.status === 'Delayed' ? 'badge-red' : 'badge-green'}`}>{proj.status}</span>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h3 className="modal-title" style={{ margin: 0 }}>Create New Project</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input required className="form-input" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Client</label>
                <input required className="form-input" value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input type="date" className="form-input" value={newProject.deadline} onChange={e => setNewProject({...newProject, deadline: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input form-select" value={newProject.priority} onChange={e => setNewProject({...newProject, priority: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex-row gap-2 mt-4" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
