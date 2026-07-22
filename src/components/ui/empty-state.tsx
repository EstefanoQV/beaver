import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  action,
  className,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center", className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
