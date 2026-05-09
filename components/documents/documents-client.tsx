"use client";

import { FileUp, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { documents as initialDocuments } from "@/lib/demo-data";
import type { DocumentRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function DocumentsClient() {
  const [documents, setDocuments] = useState(initialDocuments);
  const fileRef = useRef<HTMLInputElement>(null);

  function uploadFile(file?: File) {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toUpperCase() ?? "File";
    const document: DocumentRecord = {
      id: `doc-${Date.now()}`,
      title: file.name,
      owner: "Current user",
      type: extension,
      size: formatSize(file.size),
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    setDocuments((items) => [document, ...items]);
    toast.success("File ditambahkan ke daftar dokumen.");
  }

  return (
    <div>
      <PageHeading
        title="Documents"
        description="Upload, preview, and manage company documents backed by Supabase Storage."
        action={<Button onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Upload file</Button>}
      />
      <input ref={fileRef} type="file" className="hidden" onChange={(event) => uploadFile(event.target.files?.[0])} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((document) => (
          <Card key={document.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-500"><FileUp className="h-6 w-6" /></div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{document.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{document.owner}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge tone="cyan">{document.type}</Badge>
                    <span className="text-xs text-muted-foreground">{document.size}</span>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">Updated {formatDate(document.updatedAt)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
