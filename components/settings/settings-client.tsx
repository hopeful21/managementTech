"use client";

import { Building2, Save, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SettingsClient() {
  const [profile, setProfile] = useState({ fullName: "Maya Hartono", email: "maya@officeflow.test", role: "Admin" });
  const [company, setCompany] = useState({ name: "OfficeFlow Labs", timezone: "Asia/Jakarta", currency: "USD" });

  function saveChanges() {
    toast.success("Settings disimpan di sesi browser.");
  }

  return (
    <div>
      <PageHeading
        title="Settings"
        description="Control profile settings, company preferences, roles, and workspace appearance."
        action={<Button onClick={saveChanges}><Save className="h-4 w-4" /> Save changes</Button>}
      />
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
