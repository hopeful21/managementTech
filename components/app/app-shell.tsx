import { Header } from "@/components/app/header";
import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <Header />
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
