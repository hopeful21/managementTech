"use client";

import { Download, FileUp, Loader2, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/app/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { documents as initialDocuments } from "@/lib/demo-data";
import { createOptionalClient } from "@/lib/supabase/client";
import type { DocumentRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type DocumentRow = {
  id: string;
  title: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  updated_at: string;
  profiles: { full_name: string } | { full_name: string }[] | null;
};

function ownerName(row: DocumentRow) {
  if (Array.isArray(row.profiles)) return row.profiles[0]?.full_name ?? "Current user";
  return row.profiles?.full_name ?? "Current user";
}

function mapDocument(row: DocumentRow): DocumentRecord {
  return {
    id: row.id,
    title: row.title,
    owner: ownerName(row),
    type: row.file_type,
    size: formatSize(row.file_size),
    updatedAt: row.updated_at,
    storagePath: row.storage_path
  };
}

export function DocumentsClient() {
  const supabase = useMemo(() => createOptionalClient(), []);
  const [documents, setDocuments] = useState(initialDocuments);
  const [fetching, setFetching] = useState(Boolean(supabase));
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!supabase) {
      setFetching(false);
      return;
    }

    const client = supabase;
    let mounted = true;

    async function loadDocuments() {
      const { data, error } = await client
        .from("documents")
        .select("id,title,storage_path,file_type,file_size,updated_at,profiles(full_name)")
        .order("updated_at", { ascending: false });

      if (!mounted) return;

      setFetching(false);
      if (error) {
        toast.error(`Gagal memuat dokumen: ${error.message}`);
        return;
      }

      setDocuments((data ?? []).map((document) => mapDocument(document as DocumentRow)));
    }

    loadDocuments();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function uploadFile(file?: File) {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toUpperCase() ?? "File";

    if (!supabase) {
      const document: DocumentRecord = {
        id: `doc-${Date.now()}`,
        title: file.name,
        owner: "Current user",
        type: extension,
        size: formatSize(file.size),
        updatedAt: new Date().toISOString().slice(0, 10),
        downloadUrl: URL.createObjectURL(file)
      };

      setDocuments((items) => [document, ...items]);
      toast.success("File tersimpan sementara di browser.");
      return;
    }

    setUploading(true);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setUploading(false);
      toast.error("Login diperlukan untuk upload dokumen.");
      return;
    }

    const storagePath = `${userData.user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("documents").upload(storagePath, file, { upsert: false });

    if (uploadError) {
      setUploading(false);
      toast.error(`Gagal upload file: ${uploadError.message}`);
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .insert({
        title: file.name,
        storage_path: storagePath,
        owner_id: userData.user.id,
        file_type: extension,
        file_size: file.size
      })
      .select("id,title,storage_path,file_type,file_size,updated_at,profiles(full_name)")
      .single();
    setUploading(false);

    if (error) {
      toast.error(`Gagal menyimpan metadata dokumen: ${error.message}`);
      return;
    }

    setDocuments((items) => [mapDocument(data as DocumentRow), ...items]);
    toast.success("File tersimpan ke Supabase.");
  }

  async function downloadDocument(document: DocumentRecord) {
    if (document.downloadUrl) {
      triggerDownload(document.downloadUrl, document.title);
      return;
    }

    if (!supabase || !document.storagePath) {
      toast.error("File demo tidak tersedia untuk download.");
      return;
    }

    const { data, error } = await supabase.storage.from("documents").download(document.storagePath);

    if (error) {
      toast.error(`Gagal download file: ${error.message}`);
      return;
    }

    const url = URL.createObjectURL(data);
    triggerDownload(url, document.title);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function triggerDownload(url: string, filename: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div>
      <PageHeading
        title="Documents"
        description="Upload, preview, and manage company documents backed by Supabase Storage."
        action={
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload file
          </Button>
        }
      />
      <input ref={fileRef} type="file" className="hidden" onChange={(event) => uploadFile(event.target.files?.[0])} />
      {fetching && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat dokumen dari Supabase...
        </div>
      )}
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
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Updated {formatDate(document.updatedAt)}</p>
                <Button variant="outline" size="sm" onClick={() => downloadDocument(document)}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
