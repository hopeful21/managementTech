"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/ui-store";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { darkMode, setDarkMode, globalSearch, setGlobalSearch, setMobileMenuOpen } = useUIStore();
  const title = pathname.split("/").filter(Boolean).at(0) ?? "dashboard";
  const accountName = useMemo(() => {
    const metadataName = user?.user_metadata?.full_name;
    if (typeof metadataName === "string" && metadataName.trim()) return metadataName;
    return user?.email?.split("@")[0] ?? "Guest";
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <header className="glass sticky top-0 z-20 border-b">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
        <Button className="lg:hidden" variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <p className="text-xs capitalize text-muted-foreground">OfficeFlow / {title}</p>
          <h1 className="truncate text-lg font-semibold capitalize">{title}</h1>
        </div>
        <div className="ml-auto hidden w-full max-w-md items-center gap-2 rounded-2xl border bg-background/70 px-3 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={globalSearch}
            onChange={(event) => setGlobalSearch(event.target.value)}
            className="border-0 bg-transparent px-0 focus:ring-0"
            placeholder="Search employees, tasks, documents..."
          />
        </div>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <div className="hidden min-w-0 items-center gap-3 rounded-2xl border bg-background/70 px-3 py-2 md:flex">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-xs font-semibold text-primary-foreground">
            {accountName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{accountName}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? "Belum login"}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await signOut();
            router.replace("/login");
            router.refresh();
          }}
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{user?.email ? "Logout" : "Keluar"}</span>
        </Button>
      </div>
    </header>
  );
}
