"use client";

import { Building2, Loader2, Save, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createOptionalClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/lib/types";

const PROFILE_STORAGE_KEY = "officeflow_settings_profile";
const COMPANY_STORAGE_KEY = "officeflow_settings_company";
const VALID_ROLES: Role[] = ["super_admin", "admin", "manager", "staff"];

type ProfileSettings = {
  fullName: string;
  email: string;
  role: string;
};

type CompanySettings = {
  name: string;
  timezone: string;
  currency: string;
};

const defaultProfile: ProfileSettings = {
  fullName: "Maya Hartono",
  email: "maya@officeflow.test",
  role: "admin"
};

const defaultCompany: CompanySettings = {
  name: "OfficeFlow Labs",
  timezone: "Asia/Jakarta",
  currency: "USD"
};

function readStoredSettings<T>(key: string, fallback: T) {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = localStorage.getItem(key);
    return stored ? ({ ...fallback, ...JSON.parse(stored) } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function SettingsClient() {
  const supabase = useMemo(() => createOptionalClient(), []);
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileSettings>(defaultProfile);
  const [company, setCompany] = useState<CompanySettings>(defaultCompany);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProfile(readStoredSettings(PROFILE_STORAGE_KEY, defaultProfile));
    setCompany(readStoredSettings(COMPANY_STORAGE_KEY, defaultCompany));
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    const client = supabase;
    const currentUser = user;
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      const { data, error } = await client
        .from("profiles")
        .select("full_name,role")
        .eq("id", currentUser.id)
        .single();

      if (!mounted) return;

      setLoading(false);
      if (error) {
        toast.error(`Gagal memuat profile: ${error.message}`);
        return;
      }

      setProfile((current) => ({
        ...current,
        fullName: data.full_name ?? current.fullName,
        email: currentUser.email ?? current.email,
        role: data.role ?? current.role
      }));
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [supabase, user]);

  async function saveChanges() {
    setSaving(true);

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(company));

    if (!supabase || !user) {
      setSaving(false);
      toast.success("Settings disimpan di browser.");
      return;
    }

    const normalizedRole = profile.role.trim().toLowerCase() as Role;

    if (!VALID_ROLES.includes(normalizedRole)) {
      setSaving(false);
      toast.error("Role harus salah satu dari super_admin, admin, manager, atau staff.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.fullName.trim(),
        role: normalizedRole
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      toast.error(`Gagal menyimpan settings: ${error.message}`);
      return;
    }

    setProfile((current) => ({ ...current, role: normalizedRole }));
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ ...profile, role: normalizedRole }));
    toast.success("Settings berhasil disimpan.");
  }

  return (
    <div>
      <PageHeading
        title="Settings"
        description="Control profile settings, company preferences, roles, and workspace appearance."
        action={
          <Button onClick={saveChanges} disabled={saving || loading}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </Button>
        }
      />
      {loading && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat settings...
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" /> Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Full name" value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} />
            <Input placeholder="Email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
            <Input placeholder="Role" value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Company</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Company name" value={company.name} onChange={(event) => setCompany({ ...company, name: event.target.value })} />
            <Input placeholder="Timezone" value={company.timezone} onChange={(event) => setCompany({ ...company, timezone: event.target.value })} />
            <Input placeholder="Default currency" value={company.currency} onChange={(event) => setCompany({ ...company, currency: event.target.value })} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
