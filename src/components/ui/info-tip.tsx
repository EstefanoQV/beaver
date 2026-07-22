"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type InfoTipProps = {
  content: string;
  className?: string;
};

export function InfoTip({ content, className }: InfoTipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={120}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger
          type="button"
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
            className,
          )}
          aria-label={content}
        >
          <Info className="h-3.5 w-3.5" />
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={8}
            className="z-50 max-w-64 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600 shadow-lg"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-white" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

