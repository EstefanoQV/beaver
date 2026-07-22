import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "PEN") {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-PE").format(value);
}

export function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = year && month && day ? new Date(year, month - 1, day) : new Date(value);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
