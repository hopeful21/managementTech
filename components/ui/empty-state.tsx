import { FileSearch } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="flex min-h-56 flex-col items-center justify-center gap-3 border-dashed p-8 text-center">
      <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-500">
        <FileSearch className="h-8 w-8" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
