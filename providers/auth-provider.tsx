"use client";

import type { Session, User } from "@supabase/supabase-js";
import { createContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      const hasRememberedSession = localStorage.getItem("officeflow_remember_session") === "true";
      const hasTabSession = sessionStorage.getItem("officeflow_tab_session") === "true";

      if (data.session && !hasRememberedSession && !hasTabSession) {
        supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signOut: async () => {
        localStorage.removeItem("officeflow_remember_session");
        sessionStorage.removeItem("officeflow_tab_session");
        await supabase.auth.signOut();
      }
    }),
    [loading, session, supabase, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
