import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <EmptyState title="Page not found" description="The requested workspace page does not exist." />
        <Button asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
