// NexaHR Sample Data
export const employees = [
    { id: 1, name: 'Saman Kumara', initials: 'SK', role: 'Sr. Developer', department: 'Engineering', startDate: '2021-03-15', salary: 2800, status: 'Active', email: 'saman@nexahr.com', phone: '+94 71 234 5678', avClass: 'av-teal' },
    { id: 2, name: 'Nisha Perera', initials: 'NP', role: 'HR Manager', department: 'Human Resources', startDate: '2020-07-01', salary: 2400, status: 'Active', email: 'nisha@nexahr.com', phone: '+94 77 345 6789', avClass: 'av-blue' },
    { id: 3, name: 'Dinesh Mendis', initials: 'DM', role: 'Accountant', department: 'Finance', startDate: '2024-01-10', salary: 1800, status: 'Probation', email: 'dinesh@nexahr.com', phone: '+94 76 456 7890', avClass: 'av-purple' },
    { id: 4, name: 'Ramya Alwis', initials: 'RA', role: 'Sales Lead', department: 'Sales', startDate: '2022-09-05', salary: 2200, status: 'Active', email: 'ramya@nexahr.com', phone: '+94 75 567 8901', avClass: 'av-orange' },
    { id: 5, name: 'Kasun Fernando', initials: 'KF', role: 'Operations', department: 'Operations', startDate: '2023-04-20', salary: 2000, status: 'Active', email: 'kasun@nexahr.com', phone: '+94 78 678 9012', avClass: 'av-pink' },
];

export const attendanceData = {
    week: [
        { day: 'Mon', pct: 100 },
        { day: 'Tue', pct: 80 },
        { day: 'Wed', pct: 100 },
        { day: 'Thu', pct: 60 },
        { day: 'Fri', pct: 80 },
    ],
    monthly: {
        1: { // Saman
            1: 'P', 2: 'P', 3: 'WFH', 4: 'A', 5: 'P', 6: 'WFH', 7: 'P', 8: 'P', 9: 'L', 10: 'P',
            11: 'P', 12: 'P', 13: 'WFH', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'A', 19: 'WFH', 20: 'P',
            21: 'P', 22: 'P', 23: 'P', 24: 'L', 25: 'P', 26: 'P', 27: 'WFH', 28: 'P', 29: 'P', 30: 'P'
        },
        2: { // Nisha
            1: 'P', 2: 'P', 3: 'P', 4: 'A', 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'P', 10: 'WFH',
            11: 'P', 12: 'L', 13: 'P', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P',
            21: 'WFH', 22: 'P', 23: 'P', 24: 'P', 25: 'A', 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'P'
        },
        3: { // Dinesh
            1: 'L', 2: 'P', 3: 'P', 4: 'P', 5: 'A', 6: 'P', 7: 'P', 8: 'P', 9: 'P', 10: 'P',
            11: 'P', 12: 'P', 13: 'P', 14: 'WFH', 15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'A',
            21: 'P', 22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'WFH', 27: 'P', 28: 'P', 29: 'P', 30: 'P'
        },
        4: { // Ramya
            1: 'P', 2: 'L', 3: 'P', 4: 'P', 5: 'P', 6: 'A', 7: 'P', 8: 'P', 9: 'WFH', 10: 'P',
            11: 'P', 12: 'P', 13: 'P', 14: 'P', 15: 'A', 16: 'P', 17: 'WFH', 18: 'P', 19: 'P', 20: 'P',
            21: 'P', 22: 'P', 23: 'A', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'WFH', 29: 'P', 30: 'P'
        },
        5: { // Kasun
            1: 'P', 2: 'P', 3: 'A', 4: 'P', 5: 'P', 6: 'P', 7: 'WFH', 8: 'P', 9: 'P', 10: 'P',
            11: 'P', 12: 'P', 13: 'WFH', 14: 'P', 15: 'P', 16: 'A', 17: 'P', 18: 'P', 19: 'P', 20: 'WFH',
            21: 'P', 22: 'P', 23: 'P', 24: 'P', 25: 'WFH', 26: 'P', 27: 'P', 28: 'P', 29: 'A', 30: 'P'
        }
    },
    today: [
        { empId: 1, status: 'Present' },
        { empId: 2, status: 'WFH' },
        { empId: 3, status: 'Present' },
        { empId: 4, status: 'Late' },
        { empId: 5, status: 'Absent' },
    ]
};

export const leaveData = {
    balances: [
        { empId: 1, Annual: 14, Sick: 7, Casual: 5, Emergency: 2, 'Mat/Pat': 0 },
        { empId: 2, Annual: 8, Sick: 5, Casual: 3, Emergency: 0, 'Mat/Pat': 30 },
        { empId: 3, Annual: 12, Sick: 6, Casual: 5, Emergency: 1, 'Mat/Pat': 0 },
        { empId: 4, Annual: 10, Sick: 4, Casual: 4, Emergency: 2, 'Mat/Pat': 0 },
        { empId: 5, Annual: 16, Sick: 8, Casual: 5, Emergency: 3, 'Mat/Pat': 0 },
    ],
    requests: [
        { id: 1, empId: 1, type: 'Annual', from: '2026-04-15', to: '2026-04-17', days: 3, reason: 'Family trip', status: 'Pending' },
        { id: 2, empId: 4, type: 'Sick', from: '2026-04-11', to: '2026-04-11', days: 1, reason: 'Medical appointment', status: 'Pending' },
        { id: 3, empId: 3, type: 'Casual', from: '2026-04-20', to: '2026-04-20', days: 1, reason: 'Personal work', status: 'Approved' },
        { id: 4, empId: 5, type: 'Emergency', from: '2026-04-08', to: '2026-04-09', days: 2, reason: 'Family emergency', status: 'Approved' },
        { id: 5, empId: 2, type: 'Annual', from: '2026-04-22', to: '2026-04-24', days: 3, reason: 'Vacation', status: 'Rejected' },
    ]
};

export const payrollData = {
    summary: { gross: 94200, net: 81300, tax: 8600, deductions: 4300, bonus: 3200 },
    employees: [
        { empId: 1, basic: 2800, overtime: 420, bonus: 500, epf: 252, etf: 112, tax: 340, deductTotal: 704, net: 3016 },
        { empId: 2, basic: 2400, overtime: 0, bonus: 300, epf: 216, etf: 96, tax: 260, deductTotal: 572, net: 2128 },
        { empId: 3, basic: 1800, overtime: 180, bonus: 0, epf: 162, etf: 72, tax: 180, deductTotal: 414, net: 1566 },
        { empId: 4, basic: 2200, overtime: 280, bonus: 800, epf: 198, etf: 88, tax: 240, deductTotal: 526, net: 2754 },
        { empId: 5, basic: 2000, overtime: 200, bonus: 0, epf: 180, etf: 80, tax: 200, deductTotal: 460, net: 1740 },
    ],
    history: [
        { month: 'March 2026', gross: 91800, net: 79200, status: 'Paid' },
        { month: 'February 2026', gross: 88500, net: 76800, status: 'Paid' },
        { month: 'January 2026', gross: 90200, net: 78100, status: 'Paid' },
    ]
};

export const accountingData = {
    summary: { revenue: 142000, expenses: 98000, profit: 44000, margin: 31 },
    transactions: [
        { id: 1, date: '2026-04-10', description: 'Client Invoice - TechCorp', category: 'Revenue', amount: 18500, type: 'Credit' },
        { id: 2, date: '2026-04-09', description: 'April Payroll - All Staff', category: 'Payroll', amount: 81300, type: 'Debit' },
        { id: 3, date: '2026-04-08', description: 'Office Rent', category: 'Facilities', amount: 3200, type: 'Debit' },
        { id: 4, date: '2026-04-07', description: 'Client Invoice - DataSoft', category: 'Revenue', amount: 24000, type: 'Credit' },
        { id: 5, date: '2026-04-05', description: 'Software Subscriptions', category: 'IT', amount: 890, type: 'Debit' },
        { id: 6, date: '2026-04-03', description: 'Client Invoice - MedGroup', category: 'Revenue', amount: 12500, type: 'Credit' },
        { id: 7, date: '2026-04-02', description: 'Internet & Utilities', category: 'Utilities', amount: 450, type: 'Debit' },
        { id: 8, date: '2026-04-01', description: 'Marketing Campaign', category: 'Marketing', amount: 6200, type: 'Debit' },
    ],
    invoices: [
        { id: 'INV-2026-041', client: 'TechCorp Solutions', amount: 18500, due: '2026-04-20', status: 'Paid' },
        { id: 'INV-2026-042', client: 'DataSoft Ltd', amount: 24000, due: '2026-04-15', status: 'Overdue' },
        { id: 'INV-2026-043', client: 'MedGroup Inc', amount: 12500, due: '2026-04-28', status: 'Pending' },
        { id: 'INV-2026-044', client: 'RetailMax', amount: 9800, due: '2026-05-05', status: 'Draft' },
    ]
};

export const inventoryData = [
    { id: 1, sku: 'STN-001', name: 'A4 Paper (Ream)', category: 'Stationery', qty: 8, maxQty: 100, reorder: 20, supplier: 'OfficeWorld', status: 'Critical' },
    { id: 2, sku: 'IT-012', name: 'Printer Ink Cartridge', category: 'IT', qty: 24, maxQty: 60, reorder: 30, supplier: 'TechSupply', status: 'Low' },
    { id: 3, sku: 'FAC-007', name: 'Whiteboard Markers', category: 'Facilities', qty: 45, maxQty: 60, reorder: 20, supplier: 'OfficeWorld', status: 'OK' },
    { id: 4, sku: 'IT-003', name: 'USB-C Hub', category: 'IT', qty: 12, maxQty: 20, reorder: 8, supplier: 'TechSupply', status: 'OK' },
    { id: 5, sku: 'STN-005', name: 'Sticky Notes', category: 'Stationery', qty: 80, maxQty: 150, reorder: 40, supplier: 'OfficeWorld', status: 'OK' },
    { id: 6, sku: 'FAC-003', name: 'Hand Sanitizer (500ml)', category: 'Facilities', qty: 18, maxQty: 50, reorder: 25, supplier: 'CleanPro', status: 'Low' },
    { id: 7, sku: 'IT-008', name: 'HDMI Cables', category: 'IT', qty: 7, maxQty: 20, reorder: 10, supplier: 'TechSupply', status: 'Low' },
    { id: 8, sku: 'STN-010', name: 'Ballpoint Pens (Box)', category: 'Stationery', qty: 30, maxQty: 50, reorder: 15, supplier: 'OfficeWorld', status: 'OK' },
];

export const activityFeed = [
    { id: 1, icon: '✅', text: 'Kasun Fernando marked Present', time: '9:02 AM', type: 'success' },
    { id: 2, icon: '🕒', text: 'Ramya Alwis marked Late (9:45 AM)', time: '9:45 AM', type: 'warning' },
    { id: 3, icon: '📋', text: 'Leave request submitted by Saman Kumara', time: '10:12 AM', type: 'info' },
    { id: 4, icon: '💰', text: 'April Payroll run initiated by Nisha Perera', time: '11:00 AM', type: 'success' },
    { id: 5, icon: '⚠️', text: 'Low stock alert: Printer Ink (24 units)', time: '11:30 AM', type: 'warning' },
    { id: 6, icon: '📄', text: 'Invoice INV-2026-042 is overdue ($24,000)', time: '12:00 PM', type: 'danger' },
];
