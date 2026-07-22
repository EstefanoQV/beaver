"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2, Truck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoTip } from "@/components/ui/info-tip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { DataTable } from "@/components/tables/data-table";
import { useInventory } from "@/features/inventory/inventory-context";
import type { Supplier, SupplierStatus } from "@/types/inventory";

export default function SuppliersPage() {
  const inventory = useInventory();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Supplier | undefined>();
  const [open, setOpen] = useState(false);

  const deleteSupplier = useCallback((supplier: Supplier) => {
    inventory.deleteSupplier(supplier.id);
    showToast({ title: "Proveedor eliminado", description: `${supplier.name} se retiró del directorio de proveedores.` });
  }, [inventory, showToast]);

  const columns = useMemo<ColumnDef<Supplier>[]>(() => [
    { accessorKey: "name", header: "Nombre", cell: ({ row }) => <span className="font-medium text-slate-950">{row.original.name}</span> },
    { accessorKey: "contact", header: "Contacto" },
    { accessorKey: "phone", header: "Teléfono" },
    { accessorKey: "email", header: "Correo" },
    { header: "Productos", cell: ({ row }) => inventory.products.filter((product) => product.supplierId === row.original.id).length },
    { accessorKey: "status", header: "Estado", cell: ({ row }) => <SupplierBadge status={row.original.status} /> },
    { id: "actions", header: "", enableSorting: false, cell: ({ row }) => <SupplierActions supplier={row.original} onEdit={() => { setEditing(row.original); setOpen(true); }} onDelete={() => deleteSupplier(row.original)} /> },
  ], [deleteSupplier, inventory]);

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Proveedores</CardTitle>
            <InfoTip content="Directorio comercial para saber quién abastece cada grupo de productos." />
          </div>
          <p className="mt-1 text-sm text-slate-500">Contactos comerciales y cobertura por productos asociados.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => setEditing(undefined)}><Plus className="h-4 w-4" /> Registrar proveedor</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Editar proveedor" : "Registrar proveedor"}</DialogTitle></DialogHeader>
            <SupplierForm
              supplier={editing}
              onCancel={() => setOpen(false)}
              onSave={(supplier) => {
                if (editing) inventory.updateSupplier(editing.id, supplier);
                else inventory.addSupplier(supplier);
                showToast({ title: editing ? "Proveedor actualizado" : "Proveedor creado", description: `${supplier.name} quedó disponible para el catálogo.` });
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {inventory.suppliers.length ? (
          <DataTable columns={columns} data={inventory.suppliers} mobileCard={(supplier) => <SupplierMobileCard supplier={supplier} onEdit={() => { setEditing(supplier); setOpen(true); }} onDelete={() => deleteSupplier(supplier)} />} />
        ) : (
          <EmptyState title="Sin proveedores registrados" description="Agrega proveedores para relacionarlos con productos y compras." icon={Truck} />
        )}
      </CardContent>
    </Card>
  );
}

function SupplierActions({ supplier, onEdit, onDelete }: { supplier: Supplier; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Button size="icon" variant="ghost" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
      <AlertDialog>
        <AlertDialogTrigger asChild><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-rose-600" /></Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Eliminar proveedor</AlertDialogTitle><AlertDialogDescription>Se quitará {supplier.name}. Los productos asociados conservarán su información actual.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel /><AlertDialogAction onClick={onDelete}>Eliminar proveedor</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SupplierMobileCard({ supplier, onEdit, onDelete }: { supplier: Supplier; onEdit: () => void; onDelete: () => void }) {
  const inventory = useInventory();
  return (
    <Card>
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div><p className="font-semibold text-slate-950">{supplier.name}</p><p className="mt-1 text-xs text-slate-500">{supplier.contact}</p></div>
          <SupplierBadge status={supplier.status} />
        </div>
        <div className="grid gap-1 text-sm text-slate-600">
          <p>{supplier.email}</p>
          <p>{supplier.phone}</p>
          <p>{inventory.products.filter((product) => product.supplierId === supplier.id).length} productos asociados</p>
        </div>
        <SupplierActions supplier={supplier} onEdit={onEdit} onDelete={onDelete} />
      </CardContent>
    </Card>
  );
}

function SupplierBadge({ status }: { status: SupplierStatus }) {
  return <Badge tone={status === "Activo" ? "green" : status === "En revisión" ? "amber" : "red"}>{status}</Badge>;
}

function SupplierForm({ supplier, onSave, onCancel }: { supplier?: Supplier; onSave: (supplier: Omit<Supplier, "id">) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Omit<Supplier, "id">>(supplier ?? { name: "", contact: "", phone: "", email: "", status: "Activo" });
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      {(["name", "contact", "phone", "email"] as const).map((key) => <div className="grid gap-2" key={key}><Label>{({ name: "Nombre", contact: "Contacto", phone: "Teléfono", email: "Correo" } as const)[key]}</Label><Input value={form[key]} onChange={(event) => set(key, event.target.value)} required /></div>)}
      <div className="grid gap-2"><Label>Estado</Label><Select value={form.status} onValueChange={(value) => set("status", value as SupplierStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Activo">Activo</SelectItem><SelectItem value="En revisión">En revisión</SelectItem><SelectItem value="Inactivo">Inactivo</SelectItem></SelectContent></Select></div>
      <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button><Button type="submit">Guardar cambios</Button></div>
    </form>
  );
}
