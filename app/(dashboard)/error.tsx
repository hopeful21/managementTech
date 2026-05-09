"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="space-y-4">
      <EmptyState title="Something went wrong" description="The workspace could not load this view." />
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
