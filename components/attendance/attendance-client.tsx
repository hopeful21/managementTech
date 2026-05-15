"use client";

import { Clock, Loader2, LogIn, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attendance as initialAttendance } from "@/lib/demo-data";
import { createOptionalClient } from "@/lib/supabase/client";
import type { Attendance } from "@/lib/types";

function currentTime() {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

function toTime(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

type AttendanceRow = {
  id: string;
  employee_id: string;
  work_date: string;
  check_in: string | null;
  check_out: string | null;
  status: Attendance["status"];
  employees: { name: string } | { name: string }[] | null;
};

type EmployeeRow = {
  id: string;
  name: string;
};

function employeeName(row: AttendanceRow) {
  if (Array.isArray(row.employees)) return row.employees[0]?.name ?? "Unknown employee";
  return row.employees?.name ?? "Unknown employee";
}

function mapAttendance(row: AttendanceRow): Attendance {
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: employeeName(row),
    date: row.work_date,
    checkIn: toTime(row.check_in),
    checkOut: toTime(row.check_out),
    status: row.status
  };
}

export function AttendanceClient() {
  const supabase = useMemo(() => createOptionalClient(), []);
  const [items, setItems] = useState<Attendance[]>(initialAttendance);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeRow | null>(null);
  const [fetching, setFetching] = useState(Boolean(supabase));
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!supabase) {
      setFetching(false);
      return;
    }

    const client = supabase;
    let mounted = true;

    async function loadAttendance() {
      const { data: userData } = await client.auth.getUser();
      const email = userData.user?.email;

      if (email) {
        const { data: employee } = await client.from("employees").select("id,name").eq("email", email).maybeSingle();
        if (mounted && employee) setCurrentEmployee(employee as EmployeeRow);
      }

      const { data, error } = await client
        .from("attendance")
        .select("id,employee_id,work_date,check_in,check_out,status,employees(name)")
        .eq("work_date", today)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      setFetching(false);
      if (error) {
        toast.error(`Gagal memuat attendance: ${error.message}`);
        return;
      }

      setItems((data ?? []).map((item) => mapAttendance(item as AttendanceRow)));
    }

    loadAttendance();

    return () => {
      mounted = false;
    };
  }, [supabase, today]);

  async function checkIn() {
    if (!supabase) {
      const existing = items.find((item) => item.id === "current-user");
      if (existing) {
        toast.info("Anda sudah check in hari ini.");
        return;
      }

      const entry: Attendance = {
        id: "current-user",
        employeeName: "Current user",
        date: today,
        checkIn: currentTime(),
        checkOut: "-",
        status: "present"
      };
      setItems((records) => [entry, ...records]);
      toast.success("Check in tersimpan sementara di browser.");
      return;
    }

    if (!currentEmployee) {
      toast.error("Employee untuk user login belum ditemukan. Tambahkan employee dengan email login Anda dulu.");
      return;
    }

    const existing = items.find((item) => item.employeeId === currentEmployee.id && item.date === today);
    if (existing) {
      toast.info("Anda sudah check in hari ini.");
      return;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from("attendance")
      .insert({
        employee_id: currentEmployee.id,
        work_date: today,
        check_in: new Date().toISOString(),
        status: "present"
      })
      .select("id,employee_id,work_date,check_in,check_out,status,employees(name)")
      .single();
    setSaving(false);

    if (error) {
      toast.error(`Gagal check in: ${error.message}`);
      return;
    }

    setItems((records) => [mapAttendance(data as AttendanceRow), ...records]);
    toast.success("Check in tersimpan ke Supabase.");
  }

  async function checkOut() {
    if (!supabase) {
      const existing = items.find((item) => item.id === "current-user");
      if (!existing) {
        toast.error("Check in terlebih dahulu.");
        return;
      }

      setItems((records) => records.map((item) => (item.id === "current-user" ? { ...item, checkOut: currentTime() } : item)));
      toast.success("Check out tersimpan sementara di browser.");
      return;
    }

    if (!currentEmployee) {
      toast.error("Employee untuk user login belum ditemukan. Tambahkan employee dengan email login Anda dulu.");
      return;
    }

    const existing = items.find((item) => item.employeeId === currentEmployee.id && item.date === today);
    if (!existing) {
      toast.error("Check in terlebih dahulu.");
      return;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from("attendance")
      .update({ check_out: new Date().toISOString() })
      .eq("id", existing.id)
      .select("id,employee_id,work_date,check_in,check_out,status,employees(name)")
      .single();
    setSaving(false);

    if (error) {
      toast.error(`Gagal check out: ${error.message}`);
      return;
    }

    setItems((records) => records.map((item) => (item.id === existing.id ? mapAttendance(data as AttendanceRow) : item)));
    toast.success("Check out tersimpan ke Supabase.");
  }

  return (
    <div>
      <PageHeading
        title="Attendance"
        description="Track check-in, check-out, late status, and monthly attendance summaries."
        action={
          <div className="flex gap-2">
            <Button onClick={checkIn} disabled={saving}><LogIn className="h-4 w-4" /> Check in</Button>
            <Button variant="secondary" onClick={checkOut} disabled={saving}><LogOut className="h-4 w-4" /> Check out</Button>
          </div>
        }
      />
      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Present</p><p className="mt-2 text-3xl font-semibold">92%</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Late this month</p><p className="mt-2 text-3xl font-semibold">6</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Remote days</p><p className="mt-2 text-3xl font-semibold">18</p></CardContent></Card>
      </section>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Today history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {fetching && (
            <div className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat attendance dari Supabase...
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-500"><Clock className="h-5 w-5" /></div>
                <div>
                  <p className="font-medium">{item.employeeName}</p>
                  <p className="text-sm text-muted-foreground">{item.checkIn} - {item.checkOut}</p>
                </div>
              </div>
              <Badge tone={item.status === "late" ? "amber" : item.status === "remote" ? "cyan" : "green"}>{item.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
