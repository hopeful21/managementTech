"use client";

import Image from "next/image";
import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { employees as initialEmployees } from "@/lib/demo-data";
import type { Employee, Role } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type EmployeeForm = Omit<Employee, "id" | "avatarUrl" | "joinedAt">;

const emptyForm: EmployeeForm = {
  name: "",
  email: "",
  role: "staff",
  division: "",
  position: "",
  status: "active"
};

export function EmployeesClient() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);

  const divisions = useMemo(() => Array.from(new Set(employees.map((employee) => employee.division))), [employees]);
  const filteredEmployees = employees.filter((employee) => {
    const text = `${employee.name} ${employee.email} ${employee.role} ${employee.division} ${employee.position}`.toLowerCase();
    return (
      text.includes(query.toLowerCase()) &&
      (division === "all" || employee.division === division) &&
      (status === "all" || employee.status === status)
    );
  });

  function addEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name || !form.email || !form.division || !form.position) {
      toast.error("Lengkapi semua field employee.");
      return;
    }

    setEmployees((items) => [
      {
        ...form,
        id: `emp-${Date.now()}`,
        avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(form.name)}`,
        joinedAt: new Date().toISOString().slice(0, 10)
      },
      ...items
    ]);
    setForm(emptyForm);
    setOpen(false);
    toast.success("Employee berhasil ditambahkan.");
  }

  return (
    <div>
      <PageHeading
        title="Employees"
        description="Manage employee profiles, divisions, employment status, and role access from one clean directory."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add employee
          </Button>
        }
      />

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="border-0 px-0 focus:ring-0"
                placeholder="Search name, role, division..."
              />
            </div>
            <select
              value={division}
              onChange={(event) => setDivision(event.target.value)}
              className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All divisions</option>
              {divisions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="probation">Probation</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr className="border-b">
                  <th className="py-3">Employee</th>
                  <th>Division</th>
                  <th>Position</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Image src={employee.avatarUrl} alt="" width={40} height={40} className="rounded-full object-cover" />
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{employee.division}</td>
                    <td>{employee.position}</td>
                    <td><Badge tone="indigo">{employee.role}</Badge></td>
                    <td><Badge tone={employee.status === "active" ? "green" : employee.status === "inactive" ? "red" : "amber"}>{employee.status}</Badge></td>
                    <td>{formatDate(employee.joinedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.info("Already on the first page.")}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => toast.info("No more pages yet.")}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={addEmployee} className="w-full max-w-lg rounded-2xl border bg-card p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Add employee</h2>
                <p className="text-sm text-muted-foreground">Create a local employee record for this workspace view.</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <Input type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              <Input placeholder="Division" value={form.division} onChange={(event) => setForm({ ...form, division: event.target.value })} />
              <Input placeholder="Position" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} />
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Role })} className="h-10 rounded-xl border bg-background px-3 text-sm outline-none">
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super admin</option>
              </select>
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Employee["status"] })} className="h-10 rounded-xl border bg-background px-3 text-sm outline-none">
                <option value="active">Active</option>
                <option value="probation">Probation</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save employee</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
