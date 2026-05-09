"use client";

import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { tasks as initialTasks } from "@/lib/demo-data";
import type { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const columns: Array<{ id: Task["status"]; label: string }> = [
  { id: "backlog", label: "Backlog" },
  { id: "progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" }
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Task, "id" | "status">>({
    title: "",
    assignee: "",
    priority: "medium",
    dueDate: new Date().toISOString().slice(0, 10)
  });

  function moveTask(id: string, status: Task["status"]) {
    setTasks((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title || !form.assignee || !form.dueDate) {
      toast.error("Lengkapi title, assignee, dan due date.");
      return;
    }

    setTasks((items) => [{ ...form, id: `task-${Date.now()}`, status: "backlog" }, ...items]);
    setForm({ title: "", assignee: "", priority: "medium", dueDate: new Date().toISOString().slice(0, 10) });
    setOpen(false);
    toast.success("Task baru masuk ke Backlog.");
  }

  return (
    <div>
      <PageHeading
        title="Task Management"
        description="Plan work through a draggable Kanban board with status, priority, owner, and deadline."
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New task</Button>}
      />
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
              <Button type="submit">Save task</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
