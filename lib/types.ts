export type Role = "super_admin" | "admin" | "manager" | "staff";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: Role;
  division: string;
  position: string;
  status: "active" | "probation" | "inactive";
  avatarUrl: string;
  joinedAt: string;
};

export type Attendance = {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "late" | "remote";
};

export type FinanceRecord = {
  id: string;
  title: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
};

export type Task = {
  id: string;
  title: string;
  assignee: string;
  status: "backlog" | "progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
};

export type DocumentRecord = {
  id: string;
  title: string;
  owner: string;
  type: string;
  size: string;
  updatedAt: string;
};
