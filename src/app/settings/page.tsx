"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTip } from "@/components/ui/info-tip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useInventory } from "@/features/inventory/inventory-context";
import type { CompanySettings } from "@/types/inventory";

export default function SettingsPage() {
  const inventory = useInventory();
  const { showToast } = useToast();
  const [form, setForm] = useState(inventory.settings);
  const set = (key: keyof CompanySettings, value: string | number | boolean) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Configuración</CardTitle>
          <InfoTip content="Preferencias visuales y operativas que personalizan la experiencia local de Beaver." />
        </div>
        <p className="text-sm text-slate-500">Preferencias para adaptar la experiencia de inventario.</p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={(event) => { event.preventDefault(); inventory.updateSettings(form); showToast({ title: "Preferencias guardadas", description: "La configuración quedó actualizada correctamente." }); }}>
          <section className="grid gap-4 sm:grid-cols-2">
            <Field label="Empresa"><Input value={form.companyName} onChange={(event) => set("companyName", event.target.value)} /></Field>
            <Field label="Desarrollado por"><Input value={form.brand} onChange={(event) => set("brand", event.target.value)} /></Field>
            <Field label="Moneda"><Select value={form.currency} onValueChange={(value) => set("currency", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PEN">Soles (PEN)</SelectItem></SelectContent></Select></Field>
            <Field label="Unidad por defecto"><Input value={form.defaultUnit} onChange={(event) => set("defaultUnit", event.target.value)} /></Field>
            <Field label="Stock mínimo global"><Input type="number" value={form.globalMinimumStock} onChange={(event) => set("globalMinimumStock", Number(event.target.value))} /></Field>
          </section>
          <section className="grid gap-3 rounded-lg border border-slate-200 p-4">
            <label className="flex items-center justify-between gap-4"><span><span className="block font-medium text-slate-950">Tablas compactas</span><span className="text-sm text-slate-500">Reduce el espacio vertical en listados operativos.</span></span><input className="h-5 w-5 accent-emerald-600" type="checkbox" checked={form.compactTables} onChange={(event) => set("compactTables", event.target.checked)} /></label>
            <label className="flex items-center justify-between gap-4"><span><span className="block font-medium text-slate-950">Alertas de stock</span><span className="text-sm text-slate-500">Muestra advertencias cuando un producto cruza su mínimo.</span></span><input className="h-5 w-5 accent-emerald-600" type="checkbox" checked={form.showStockWarnings} onChange={(event) => set("showStockWarnings", event.target.checked)} /></label>
          </section>
          <div><Button type="submit"><Save className="h-4 w-4" /> Guardar preferencias</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-2"><Label>{label}</Label>{children}</div>;
}
