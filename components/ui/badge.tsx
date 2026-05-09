import { cn } from "@/lib/utils";

const toneMap = {
  neutral: "bg-muted text-muted-foreground",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  cyan: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  red: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300"
};

export function Badge({
  className,
  tone = "neutral",
  children
}: {
  className?: string;
  tone?: keyof typeof toneMap;
  children: React.ReactNode;
}) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", toneMap[tone], className)}>{children}</span>;
}
