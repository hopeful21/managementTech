"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/app/nav-items";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  return (
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
  );
}
