"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info";
type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

const ToastContext = createContext<{ showToast: (toast: Omit<Toast, "id" | "tone"> & { tone?: ToastTone }) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo(
    () => ({
      showToast: (toast: Omit<Toast, "id" | "tone"> & { tone?: ToastTone }) => {
        const id = Math.random().toString(36).slice(2, 9);
        setToasts((current) => [{ ...toast, id, tone: toast.tone ?? "success" }, ...current].slice(0, 3));
        window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3200);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-[60] grid w-[calc(100vw-2rem)] max-w-sm gap-3 sm:right-6">
        {toasts.map((toast) => {
          const Icon = toast.tone === "success" ? CheckCircle2 : Info;
          return (
            <div
              key={toast.id}
              className={cn(
                "rounded-lg border bg-white p-4 shadow-lg",
                toast.tone === "success" ? "border-emerald-200" : "border-sky-200",
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn("mt-0.5 h-5 w-5", toast.tone === "success" ? "text-emerald-600" : "text-sky-600")} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-950">{toast.title}</p>
                  {toast.description ? <p className="mt-1 text-sm leading-5 text-slate-600">{toast.description}</p> : null}
                </div>
                <Button
                  aria-label="Cerrar notificación"
                  className="-mr-2 -mt-2"
                  size="icon"
                  type="button"
                  variant="ghost"
                  onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast debe usarse dentro de ToastProvider");
  return context;
}
