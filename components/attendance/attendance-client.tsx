"use client";

import { Clock, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attendance as initialAttendance } from "@/lib/demo-data";
import type { Attendance } from "@/lib/types";

function currentTime() {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

export function AttendanceClient() {
  const [items, setItems] = useState(initialAttendance);
  const today = new Date().toISOString().slice(0, 10);

  function checkIn() {
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
    toast.success("Check in berhasil.");
  }

  function checkOut() {
    const existing = items.find((item) => item.id === "current-user");
    if (!existing) {
      toast.error("Check in terlebih dahulu.");
      return;
    }

    setItems((records) => records.map((item) => (item.id === "current-user" ? { ...item, checkOut: currentTime() } : item)));
    toast.success("Check out berhasil.");
  }

  return (
    <div>
      <PageHeading
        title="Attendance"
        description="Track check-in, check-out, late status, and monthly attendance summaries."
        action={<div className="flex gap-2"><Button onClick={checkIn}><LogIn className="h-4 w-4" /> Check in</Button><Button variant="secondary" onClick={checkOut}><LogOut className="h-4 w-4" /> Check out</Button></div>}
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
