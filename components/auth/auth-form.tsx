"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").optional(),
  email: z.string().email("Masukkan email yang valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  remember: z.boolean().default(true)
});

type AuthValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AuthValues>({
    resolver: zodResolver(schema),
    defaultValues: { remember: true }
  });

  const remember = watch("remember");

  async function onSubmit(values: AuthValues) {
    setLoading(true);
    if (values.remember) {
      localStorage.setItem("officeflow_remember_session", "true");
      sessionStorage.removeItem("officeflow_tab_session");
    } else {
      localStorage.removeItem("officeflow_remember_session");
      sessionStorage.setItem("officeflow_tab_session", "true");
    }

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
        : await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              data: {
                full_name: values.name,
                role: values.email.toLowerCase() === "fitrahmm09@gmail.com" ? "super_admin" : "staff"
              }
            }
          });

    setLoading(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    toast.success(mode === "login" ? "Login berhasil" : "Akun berhasil dibuat");
    router.push(mode === "login" ? searchParams.get("next") ?? "/dashboard" : "/dashboard");
    router.refresh();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-md rounded-3xl border border-white/35 bg-white/75 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 sm:p-8"
    >
      <div className="mb-7">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          Supabase secure session
        </div>
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">
          {mode === "login" ? "Masuk ke OfficeFlow" : "Buat akun workspace"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {mode === "login"
            ? "Akses dashboard ERP, operasional tim, dan laporan bisnis dari satu ruang kerja."
            : "Daftarkan akun untuk mengakses workspace ERP OfficeFlow."}
        </p>
      </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {mode === "register" && (
            <label className="block space-y-2 text-sm font-medium">
              Nama lengkap
              <Input placeholder="Maya Hartono" autoComplete="name" {...register("name")} />
              {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
            </label>
          )}
          <label className="block space-y-2 text-sm font-medium">
            Email
            <Input type="email" placeholder="you@company.com" autoComplete="email" {...register("email")} />
            {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Password
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="pr-11"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
          </label>

          {mode === "login" && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]"
                  {...register("remember")}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                Forgot password
              </Link>
            </div>
          )}

          <Button className="h-11 w-full rounded-2xl shadow-lg shadow-indigo-500/20" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {loading ? "Memproses..." : mode === "login" ? "Login" : "Register"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>{mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}</span>
          <Link className="font-medium text-primary hover:underline" href={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Create account" : "Login"}
          </Link>
        </div>

        {mode === "login" && (
          <p className={cn("mt-5 text-xs text-muted-foreground", remember ? "opacity-100" : "opacity-80")}>
            {remember
              ? "Session persistence aktif dan token akan disegarkan otomatis oleh Supabase."
              : "Session tetap dikelola aman oleh Supabase, tanpa preferensi remember me."}
          </p>
        )}
    </motion.section>
  );
}
