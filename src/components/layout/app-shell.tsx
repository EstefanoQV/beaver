"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Tags,
  Truck,
  Warehouse,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Panel", icon: LayoutDashboard },
  { href: "/products", label: "Productos", icon: Package },
  { href: "/movements", label: "Movimientos", icon: Boxes },
  { href: "/categories", label: "Categorías", icon: Tags },
  { href: "/suppliers", label: "Proveedores", icon: Truck },
  { href: "/warehouses", label: "Almacenes", icon: Warehouse },
  { href: "/reports", label: "Reportes", icon: BarChart3 },
  { href: "/settings", label: "Configuración", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPage = nav.find((item) => isActive(pathname, item.href))?.label ?? "Inventario";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <SidebarContent pathname={pathname} onNavigate={() => undefined} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
            aria-label="Cerrar navegación"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[min(20rem,86vw)] flex-col border-r border-slate-200 bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <Brand />
              <Button type="button" variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} mobile />
            <div className="mt-auto border-t border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-900">Distribuidora Ferretera Norte SAC</p>
              <p className="mt-1 text-xs text-slate-500">Operación Perú</p>
            </div>
          </aside>
        </div>
      )}

      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <p className="text-sm font-medium text-emerald-700">Beaver</p>
                <h1 className="truncate text-lg font-semibold text-slate-950 sm:text-xl">{currentPage}</h1>
              </div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Distribuidora Ferretera Norte SAC</p>
                <p className="text-xs text-slate-500">Operación Perú</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                B4M
              </div>
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

function Brand() {
  return (
    <Image
      src="/brand/beaver-logo.svg"
      alt="Beaver, desarrollado por Bananas4Monkeys"
      width={190}
      height={36}
      priority
      className="h-9 w-auto max-w-[11.5rem] object-contain object-left"
    />
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <>
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Brand />
      </div>
      <SidebarNav pathname={pathname} onNavigate={onNavigate} />
    </>
  );
}

function SidebarNav({ pathname, onNavigate, mobile = false }: { pathname: string; onNavigate: () => void; mobile?: boolean }) {
  return (
    <nav className="space-y-1 p-4">
      {nav.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950",
              mobile ? "py-3" : "py-2.5",
              isActive(pathname, item.href) && "bg-emerald-50 text-emerald-700",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

