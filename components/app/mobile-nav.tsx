"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navItems } from "@/components/app/nav-items";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const accountName = typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
    ? user.user_metadata.full_name
    : user?.email?.split("@")[0] ?? "Guest";

  return (
    <>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside className="h-full w-80 max-w-[86vw] border-r bg-card p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white">
                  OF
                </div>
                <div>
                  <p className="font-semibold">OfficeFlow</p>
                  <p className="text-xs text-muted-foreground">Enterprise ERP</p>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 rounded-2xl border bg-background/70 p-3">
              <p className="text-sm font-medium">{accountName}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{user?.email ?? "Belum login"}</p>
            </div>

            <nav className="mt-5 space-y-1">
              {navItems.slice(0, 7).map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted",
                      active && "bg-primary text-primary-foreground shadow-soft"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl border bg-card/95 p-2 shadow-soft backdrop-blur lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn("grid place-items-center rounded-xl py-2 text-muted-foreground", pathname === item.href && "bg-primary text-primary-foreground")}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
