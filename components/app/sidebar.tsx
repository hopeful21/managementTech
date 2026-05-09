"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/components/app/nav-items";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useUIStore();

  return (
    <aside className={cn("hidden border-r bg-card/75 transition-all duration-300 lg:block", collapsed ? "w-20" : "w-72")}>
      <div className="sticky top-0 flex h-screen flex-col p-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white">
              OF
            </div>
            {!collapsed && (
              <div>
                <p className="font-semibold">OfficeFlow</p>
                <p className="text-xs text-muted-foreground">Enterprise ERP</p>
              </div>
            )}
          </Link>
          {!collapsed && (
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar">
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>
        {collapsed && (
          <Button className="mt-2" variant="ghost" size="icon" onClick={() => setCollapsed(false)} aria-label="Expand sidebar">
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        )}
        <nav className="mt-6 space-y-1">
          {navItems.slice(0, 7).map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition hover:bg-muted",
                  active && "bg-primary text-primary-foreground shadow-soft"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="mt-auto rounded-2xl border bg-gradient-to-br from-slate-900 to-indigo-900 p-4 text-white">
            <p className="text-sm font-semibold">Realtime workspace</p>
            <p className="mt-1 text-xs text-slate-300">Supabase subscriptions are ready for live records.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
