"use client";

import { motion } from "framer-motion";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { tasks as initialTasks } from "@/lib/demo-data";
import { createOptionalClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const columns: Array<{ id: Task["status"]; label: string }> = [
  { id: "backlog", label: "Backlog" },
  { id: "progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" }
];

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: Task["status"];
  priority: Task["priority"];
  due_date: string | null;
};

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    assignee: row.description ?? "Unassigned",
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date ?? new Date().toISOString().slice(0, 10)
  };
}

export function KanbanBoard() {
  const supabase = useMemo(() => createOptionalClient(), []);
  const [tasks, setTasks] = useState(initialTasks);
  const [fetching, setFetching] = useState(Boolean(supabase));
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Task, "id" | "status">>({
    title: "",
    assignee: "",
    priority: "medium",
    dueDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    if (!supabase) {
      setFetching(false);
      return;
    }

    const client = supabase;
    let mounted = true;

    async function loadTasks() {
      const { data, error } = await client
        .from("tasks")
        .select("id,title,description,status,priority,due_date")
        .order("created_at", { ascending: false });

      if (!mounted) return;

      setFetching(false);
      if (error) {
        toast.error(`Gagal memuat task: ${error.message}`);
        return;
      }

      setTasks((data ?? []).map((task) => mapTask(task as TaskRow)));
    }

    loadTasks();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function moveTask(id: string, status: Task["status"]) {
    const previousTasks = tasks;
    setTasks((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));

    if (!supabase) return;

    const { error } = await supabase.from("tasks").update({ status }).eq("id", id);

    if (error) {
      setTasks(previousTasks);
      toast.error(`Gagal memindahkan task: ${error.message}`);
    }
  }

  async function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title || !form.assignee || !form.dueDate) {
      toast.error("Lengkapi title, assignee, dan due date.");
      return;
    }

    if (!supabase) {
      setTasks((items) => [{ ...form, id: `task-${Date.now()}`, status: "backlog" }, ...items]);
      setForm({ title: "", assignee: "", priority: "medium", dueDate: new Date().toISOString().slice(0, 10) });
      setOpen(false);
      toast.success("Task baru tersimpan sementara di browser.");
      return;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: form.title,
        description: form.assignee,
        priority: form.priority,
        due_date: form.dueDate,
        status: "backlog"
      })
      .select("id,title,description,status,priority,due_date")
      .single();
    setSaving(false);

    if (error) {
      toast.error(`Gagal menyimpan task: ${error.message}`);
      return;
    }

    setTasks((items) => [mapTask(data as TaskRow), ...items]);
    setForm({ title: "", assignee: "", priority: "medium", dueDate: new Date().toISOString().slice(0, 10) });
    setOpen(false);
    toast.success("Task baru tersimpan ke Supabase.");
  }

  return (
    <div>
      <PageHeading
        title="Task Management"
        description="Plan work through a draggable Kanban board with status, priority, owner, and deadline."
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New task</Button>}
      />
      {fetching && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat task dari Supabase...
        </div>
      )}
      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="min-h-96 rounded-2xl border bg-card/60 p-3"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => moveTask(event.dataTransfer.getData("task"), column.id)}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{column.label}</h3>
              <Badge>{tasks.filter((task) => task.status === column.id).length}</Badge>
            </div>
            <div className="space-y-3">
              {tasks.filter((task) => task.status === column.id).map((task) => (
                <motion.div key={task.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Card
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("task", task.id)}
                    className="cursor-grab p-4 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{task.title}</p>
                      <Badge tone={task.priority === "high" ? "red" : task.priority === "medium" ? "amber" : "green"}>{task.priority}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{task.assignee} - {formatDate(task.dueDate)}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={addTask} className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New task</h2>
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              <Input placeholder="Task title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              <Input placeholder="Assignee" value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })} />
              <Input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
              <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Task["priority"] })} className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save task
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
