export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen overflow-hidden bg-[radial-gradient(circle_at_16%_12%,rgba(14,165,233,0.20),transparent_28rem),linear-gradient(135deg,rgba(248,250,252,0.96),rgba(226,232,240,0.86))] dark:bg-[radial-gradient(circle_at_16%_12%,rgba(34,211,238,0.16),transparent_28rem),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,23,42,0.94))] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen flex-col justify-between p-10 text-slate-950 dark:text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-xl shadow-slate-950/20 dark:bg-white dark:text-slate-950">
            OF
          </div>
          <div>
            <p className="font-semibold">OfficeFlow ERP</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">Enterprise operations suite</p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">Modern office command center</p>
          <h2 className="text-5xl font-semibold leading-tight tracking-normal">Kelola tim, finance, dokumen, dan workflow dari satu dashboard.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
            Sistem autentikasi Supabase menjaga akses workspace tetap aman dengan session persistence, refresh token otomatis, dan proteksi route dashboard.
          </p>
        </div>

        <div className="relative h-72 rounded-[2rem] border border-white/50 bg-white/45 p-5 shadow-2xl shadow-slate-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <div className="absolute inset-x-8 bottom-6 h-24 rounded-2xl bg-slate-900/90 shadow-xl dark:bg-slate-950" />
          <div className="absolute bottom-28 left-12 h-28 w-24 rounded-t-3xl bg-cyan-500/85 shadow-lg" />
          <div className="absolute bottom-28 left-44 h-40 w-28 rounded-t-3xl bg-indigo-500/85 shadow-lg" />
          <div className="absolute bottom-28 right-16 h-32 w-32 rounded-t-3xl bg-emerald-500/80 shadow-lg" />
          <div className="absolute left-16 top-12 grid h-20 w-28 grid-cols-3 gap-2 rounded-2xl bg-white/80 p-3 shadow-lg dark:bg-slate-900/90">
            <span className="rounded bg-cyan-400/70" />
            <span className="rounded bg-indigo-400/70" />
            <span className="rounded bg-emerald-400/70" />
            <span className="rounded bg-slate-300" />
            <span className="rounded bg-slate-300" />
            <span className="rounded bg-slate-300" />
          </div>
          <div className="absolute right-12 top-10 h-24 w-44 rounded-2xl bg-slate-950 p-4 text-white shadow-xl dark:bg-white dark:text-slate-950">
            <div className="h-2 w-20 rounded bg-current opacity-40" />
            <div className="mt-4 h-10 rounded-xl bg-cyan-400/80" />
          </div>
        </div>
      </section>

      <section className="grid min-h-screen place-items-center p-4 sm:p-8">
        <div className="mb-6 flex items-center gap-3 lg:hidden">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">OF</div>
          <span className="font-semibold">OfficeFlow ERP</span>
        </div>
        {children}
      </section>
    </main>
  );
}
