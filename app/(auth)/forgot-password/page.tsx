"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOptionalClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIG_ERROR } from "@/lib/supabase/config";

const schema = z.object({ email: z.string().email("Masukkan email yang valid") });

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const supabase = useMemo(() => createOptionalClient(), []);

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!supabase) {
      toast.error(SUPABASE_CONFIG_ERROR);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${location.origin}/settings`
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Link reset password terkirim");
  }

  return (
    <section className="w-full max-w-md rounded-3xl border border-white/35 bg-white/75 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 sm:p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-normal">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Kirim link reset aman ke email akun OfficeFlow Anda.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block space-y-2 text-sm font-medium">
          Email
          <Input type="email" placeholder="you@company.com" autoComplete="email" {...register("email")} />
          {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
        </label>
        {!supabase && (
          <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {SUPABASE_CONFIG_ERROR}
          </p>
        )}
        <Button className="h-11 w-full rounded-2xl shadow-lg shadow-indigo-500/20" disabled={loading || !supabase}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {loading ? "Mengirim..." : "Send link"}
        </Button>
      </form>
    </section>
  );
}
