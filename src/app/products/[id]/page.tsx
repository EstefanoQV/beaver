"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowDownCircle, ArrowLeft, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InfoTip } from "@/components/ui/info-tip";
import { useToast } from "@/components/ui/toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MovementForm } from "@/features/inventory/movement-form";
import { useInventory } from "@/features/inventory/inventory-context";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const inventory = useInventory();
  const product = inventory.getProduct(id);
  if (!product) notFound();

  const productMovements = inventory.movements.filter((movement) => movement.productId === product.id);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline"><Link href="/products"><ArrowLeft className="h-4 w-4" /> Productos</Link></Button>
        <div className="flex gap-2">
          <MovementDialog label="Registrar entrada" icon={<ArrowUpCircle className="h-4 w-4" />} type="entrada" productId={product.id} />
          <MovementDialog label="Registrar salida" icon={<ArrowDownCircle className="h-4 w-4" />} type="salida" productId={product.id} />
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader><div className="flex items-center gap-2"><CardTitle>{product.name}</CardTitle><InfoTip content="Resumen maestro del producto: identificación, clasificación y ubicación operativa." /></div></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Info label="SKU" value={product.sku} />
            <Info label="Estado" value={<Badge tone={product.status === "Activo" ? "green" : product.status === "Bajo stock" ? "amber" : "red"}>{product.status}</Badge>} />
            <Info label="Categoría" value={inventory.categoryName(product.categoryId)} />
            <Info label="Proveedor" value={inventory.supplierName(product.supplierId)} />
            <Info label="Almacén" value={inventory.warehouseName(product.warehouseId)} />
            <Info label="Unidad" value={product.unit} />
          </CardContent>
        </Card>
        <Stat title="Stock actual" value={`${product.currentStock} ${product.unit}`} />
        <Stat title="Stock mínimo" value={`${product.minimumStock} ${product.unit}`} />
        <Stat title="Valor en inventario" value={formatCurrency(product.currentStock * product.unitCost, inventory.settings.currency)} />
        <Stat title="Precio de venta" value={formatCurrency(product.salePrice, inventory.settings.currency)} />
      </section>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><CardTitle>Historial de movimientos</CardTitle><InfoTip content="Entradas, salidas y ajustes vinculados a esta referencia." /></div><p className="text-sm text-slate-500">Actividad reciente asociada a este producto.</p></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:hidden">
            {productMovements.map((movement) => (
              <div key={movement.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-medium text-slate-950">{movement.reason}</p><p className="mt-1 text-xs text-slate-500">{formatDate(movement.date)} · {inventory.userName(movement.userId)}</p></div>
                  <Badge tone={movement.type === "entrada" ? "green" : movement.type === "salida" ? "blue" : "amber"}>{movement.type}</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600">{movement.quantity} unidades · {inventory.warehouseName(movement.warehouseId)}</p>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
          <Table>
            <TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Cantidad</TableHead><TableHead>Fecha</TableHead><TableHead>Usuario</TableHead><TableHead>Motivo</TableHead><TableHead>Almacén</TableHead></TableRow></TableHeader>
            <TableBody>
              {productMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell><Badge tone={movement.type === "entrada" ? "green" : movement.type === "salida" ? "blue" : "amber"}>{movement.type}</Badge></TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{formatDate(movement.date)}</TableCell>
                  <TableCell>{inventory.userName(movement.userId)}</TableCell>
                  <TableCell>{movement.reason}</TableCell>
                  <TableCell>{inventory.warehouseName(movement.warehouseId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-sm text-slate-500">{label}</p><div className="mt-1 font-medium text-slate-950">{value}</div></div>;
}

function Stat({ title, value }: { title: string; value: string }) {
  return <Card><CardContent className="p-5"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p></CardContent></Card>;
}

function MovementDialog({ label, icon, type, productId }: { label: string; icon: React.ReactNode; type: "entrada" | "salida"; productId: string }) {
  const inventory = useInventory();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant={type === "entrada" ? "default" : "outline"}>{icon}{label}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{label}</DialogTitle><DialogDescription>El movimiento actualiza el stock disponible del producto.</DialogDescription></DialogHeader>
        <MovementForm productId={productId} type={type} onCancel={() => setOpen(false)} onSubmit={(input) => { inventory.addMovement(input); showToast({ title: "Movimiento registrado", description: "El stock del producto se actualizó correctamente." }); setOpen(false); }} />
      </DialogContent>
    </Dialog>
  );
}
