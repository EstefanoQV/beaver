"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ClipboardList, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoTip } from "@/components/ui/info-tip";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { DataTable } from "@/components/tables/data-table";
import { MovementForm } from "@/features/inventory/movement-form";
import { useInventory } from "@/features/inventory/inventory-context";
import { formatDate } from "@/lib/utils";
import type { InventoryMovement } from "@/types/inventory";

export default function MovementsPage() {
  const inventory = useInventory();
  const { showToast } = useToast();
  const [type, setType] = useState("all");
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = inventory.movements.filter((movement) => (type === "all" || movement.type === type) && (!date || movement.date === date));
  const clearFilters = () => {
    setType("all");
    setDate("");
  };

  const columns = useMemo<ColumnDef<InventoryMovement>[]>(() => [
    { accessorKey: "type", header: "Tipo", cell: ({ row }) => <MovementBadge type={row.original.type} /> },
    { header: "Producto", cell: ({ row }) => inventory.getProduct(row.original.productId)?.name ?? "Producto eliminado" },
    { accessorKey: "quantity", header: "Cantidad" },
    { accessorKey: "date", header: "Fecha", cell: ({ row }) => formatDate(row.original.date) },
    { header: "Usuario", cell: ({ row }) => inventory.userName(row.original.userId) },
    { accessorKey: "reason", header: "Motivo" },
    { header: "Almacén", cell: ({ row }) => inventory.warehouseName(row.original.warehouseId) },
  ], [inventory]);

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Movimientos</CardTitle>
            <InfoTip content="Historial de entradas, salidas y ajustes que modifican el stock disponible." />
          </div>
          <p className="mt-1 text-sm text-slate-500">Entradas, salidas y ajustes con impacto inmediato en el stock local.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Registrar movimiento</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar movimiento</DialogTitle><DialogDescription>Entrada, salida o ajuste de inventario.</DialogDescription></DialogHeader>
            <MovementForm
              onCancel={() => setOpen(false)}
              onSubmit={(input) => {
                inventory.addMovement(input);
                showToast({ title: "Movimiento registrado", description: "El stock se actualizó correctamente." });
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-[220px_180px_1fr]">
          <Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos los tipos</SelectItem><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="salida">Salida</SelectItem><SelectItem value="ajuste">Ajuste</SelectItem></SelectContent></Select>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <div />
        </div>
        {filtered.length ? (
          <DataTable columns={columns} data={filtered} mobileCard={(movement) => <MovementMobileCard movement={movement} />} />
        ) : (
          <EmptyState title="Sin movimientos para estos filtros" description="Prueba con otro tipo, cambia la fecha o limpia los filtros para revisar todo el historial." icon={ClipboardList} action={<Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>} />
        )}
      </CardContent>
    </Card>
  );
}

function MovementBadge({ type }: { type: InventoryMovement["type"] }) {
  return <Badge tone={type === "entrada" ? "green" : type === "salida" ? "blue" : "amber"}>{type}</Badge>;
}

function MovementMobileCard({ movement }: { movement: InventoryMovement }) {
  const inventory = useInventory();
  return (
    <Card>
      <CardContent className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-950">{inventory.getProduct(movement.productId)?.name ?? "Producto eliminado"}</p>
            <p className="mt-1 text-xs text-slate-500">{formatDate(movement.date)} · {inventory.warehouseName(movement.warehouseId)}</p>
          </div>
          <MovementBadge type={movement.type} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Cantidad" value={String(movement.quantity)} />
          <Info label="Usuario" value={inventory.userName(movement.userId)} />
        </div>
        <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">{movement.reason}</p>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-medium text-slate-900">{value}</p></div>;
}
