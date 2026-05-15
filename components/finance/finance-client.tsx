"use client";

import { Download, Loader2, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { financeRecords as initialRecords } from "@/lib/demo-data";
import { createOptionalClient } from "@/lib/supabase/client";
import type { FinanceRecord } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const emptyRecord: Omit<FinanceRecord, "id" | "date"> = {
  title: "",
  type: "income",
  category: "",
  amount: 0
};

type FinanceRow = {
  id: string;
  title: string;
  type: FinanceRecord["type"];
  category: string;
  amount: number | string;
  record_date: string;
};

function mapRecord(row: FinanceRow): FinanceRecord {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    category: row.category,
    amount: Number(row.amount),
    date: row.record_date
  };
}

export function FinanceClient() {
  const supabase = useMemo(() => createOptionalClient(), []);
  const [records, setRecords] = useState(initialRecords);
  const [fetching, setFetching] = useState(Boolean(supabase));
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyRecord);

  useEffect(() => {
    if (!supabase) {
      setFetching(false);
      return;
    }

    const client = supabase;
    let mounted = true;

    async function loadRecords() {
      const { data, error } = await client
        .from("finance_records")
        .select("id,title,type,category,amount,record_date")
        .order("record_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (!mounted) return;

      setFetching(false);
      if (error) {
        toast.error(`Gagal memuat finance: ${error.message}`);
        return;
      }

      setRecords((data ?? []).map((record) => mapRecord(record as FinanceRow)));
    }

    loadRecords();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  function exportCsv() {
    const rows = ["Title,Type,Category,Amount,Date", ...records.map((record) => `${record.title},${record.type},${record.category},${record.amount},${record.date}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "officeflow-finance.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Finance CSV exported.");
  }

  async function addRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title || !form.category || form.amount <= 0) {
      toast.error("Lengkapi title, category, dan amount.");
      return;
    }

    const recordDate = new Date().toISOString().slice(0, 10);

    if (!supabase) {
      setRecords((items) => [{ ...form, id: `fin-${Date.now()}`, date: recordDate }, ...items]);
      setForm(emptyRecord);
      setOpen(false);
      toast.success("Finance record tersimpan sementara di browser.");
      return;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from("finance_records")
      .insert({
        title: form.title,
        type: form.type,
        category: form.category,
        amount: form.amount,
        record_date: recordDate
      })
      .select("id,title,type,category,amount,record_date")
      .single();
    setSaving(false);

    if (error) {
      toast.error(`Gagal menyimpan finance: ${error.message}`);
      return;
    }

    setRecords((items) => [mapRecord(data as FinanceRow), ...items]);
    setForm(emptyRecord);
    setOpen(false);
    toast.success("Finance record tersimpan ke Supabase.");
  }

  return (
    <div>
      <PageHeading
        title="Finance"
        description="Monitor cashflow, income, expenses, and financial reporting analytics."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportCsv}><Download className="h-4 w-4" /> Export</Button>
            <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New record</Button>
          </div>
        }
      />
      {fetching && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat finance dari Supabase...
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader><CardTitle>Analytics</CardTitle></CardHeader>
          <CardContent><RevenueChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {records.map((record) => (
              <div key={record.id} className="flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <p className="font-medium">{record.title}</p>
                  <p className="text-sm text-muted-foreground">{record.category} - {formatDate(record.date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(record.amount)}</p>
                  <Badge tone={record.type === "income" ? "green" : "red"}>{record.type}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={addRecord} className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New finance record</h2>
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              <Input placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
              <Input type="number" min="0" placeholder="Amount" value={form.amount || ""} onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })} />
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as FinanceRecord["type"] })} className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save record
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
