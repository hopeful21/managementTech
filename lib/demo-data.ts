import type { Attendance, DocumentRecord, Employee, FinanceRecord, Task } from "@/lib/types";

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "Maya Hartono",
    email: "maya@officeflow.test",
    role: "admin",
    division: "Operations",
    position: "Head of Operations",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop",
    joinedAt: "2024-02-12"
  },
  {
    id: "emp-002",
    name: "Dimas Pratama",
    email: "dimas@officeflow.test",
    role: "manager",
    division: "Finance",
    position: "Finance Manager",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop",
    joinedAt: "2023-11-03"
  },
  {
    id: "emp-003",
    name: "Alya Putri",
    email: "alya@officeflow.test",
    role: "staff",
    division: "People",
    position: "HR Specialist",
    status: "probation",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop",
    joinedAt: "2025-01-18"
  },
  {
    id: "emp-004",
    name: "Rafi Mahendra",
    email: "rafi@officeflow.test",
    role: "staff",
    division: "Product",
    position: "Product Designer",
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop",
    joinedAt: "2024-08-22"
  }
];

export const attendance: Attendance[] = [
  { id: "att-001", employeeName: "Maya Hartono", date: "2026-05-09", checkIn: "08:52", checkOut: "17:18", status: "present" },
  { id: "att-002", employeeName: "Dimas Pratama", date: "2026-05-09", checkIn: "09:21", checkOut: "17:04", status: "late" },
  { id: "att-003", employeeName: "Alya Putri", date: "2026-05-09", checkIn: "08:41", checkOut: "17:32", status: "present" },
  { id: "att-004", employeeName: "Rafi Mahendra", date: "2026-05-09", checkIn: "09:00", checkOut: "18:06", status: "remote" }
];

export const financeRecords: FinanceRecord[] = [
  { id: "fin-001", title: "Enterprise retainer", type: "income", category: "Sales", amount: 82500, date: "2026-05-02" },
  { id: "fin-002", title: "Cloud infrastructure", type: "expense", category: "Software", amount: 12400, date: "2026-05-04" },
  { id: "fin-003", title: "Implementation fee", type: "income", category: "Services", amount: 27600, date: "2026-05-06" },
  { id: "fin-004", title: "Office expansion", type: "expense", category: "Facilities", amount: 18400, date: "2026-05-08" }
];

export const tasks: Task[] = [
  { id: "task-001", title: "Finalize Q2 hiring plan", assignee: "Alya", status: "backlog", priority: "high", dueDate: "2026-05-14" },
  { id: "task-002", title: "Prepare cashflow forecast", assignee: "Dimas", status: "progress", priority: "high", dueDate: "2026-05-12" },
  { id: "task-003", title: "Review vendor contract", assignee: "Maya", status: "review", priority: "medium", dueDate: "2026-05-11" },
  { id: "task-004", title: "Publish internal handbook", assignee: "Rafi", status: "done", priority: "low", dueDate: "2026-05-08" }
];

export const documents: DocumentRecord[] = [
  { id: "doc-001", title: "Company Handbook.pdf", owner: "People Team", type: "PDF", size: "2.4 MB", updatedAt: "2026-05-07" },
  { id: "doc-002", title: "Q2 Budget.xlsx", owner: "Finance", type: "Sheet", size: "900 KB", updatedAt: "2026-05-08" },
  { id: "doc-003", title: "Vendor Agreement.docx", owner: "Legal", type: "Doc", size: "480 KB", updatedAt: "2026-05-04" }
];

export const revenueSeries = [
  { month: "Jan", income: 54000, expense: 32000 },
  { month: "Feb", income: 62000, expense: 34000 },
  { month: "Mar", income: 68000, expense: 39000 },
  { month: "Apr", income: 76000, expense: 42000 },
  { month: "May", income: 110100, expense: 30800 }
];

export const recentActivities = [
  "Dimas approved May software budget",
  "Alya onboarded two probation employees",
  "Maya closed enterprise implementation milestone",
  "Rafi uploaded the refreshed brand deck"
];
