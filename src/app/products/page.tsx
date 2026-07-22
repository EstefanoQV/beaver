"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, PackageSearch, Plus, Trash2 } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoTip } from "@/components/ui/info-tip";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { DataTable } from "@/components/tables/data-table";
import { ProductForm } from "@/features/inventory/product-form";
import { useInventory } from "@/features/inventory/inventory-context";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/inventory";

export default function ProductsPage() {
  const inventory = useInventory();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Product | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = inventory.products.filter((product) => {
    const matchesText = `${product.name} ${product.sku}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (category === "all" || product.categoryId === category) && (status === "all" || product.status === status);
  });

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
  };

  const deleteProduct = useCallback((product: Product) => {
    inventory.deleteProduct(product.id);
    showToast({ title: "Producto eliminado", description: `${product.name} se retiró del inventario.` });
  }, [inventory, showToast]);

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    { accessorKey: "name", header: "Producto", cell: ({ row }) => <div><p className="font-medium text-slate-950">{row.original.name}</p><p className="text-xs text-slate-500">{row.original.sku}</p></div> },
    { header: "Categoría", cell: ({ row }) => inventory.categoryName(row.original.categoryId) },
    { header: "Proveedor", cell: ({ row }) => inventory.supplierName(row.original.supplierId) },
    { header: "Almacén", cell: ({ row }) => inventory.warehouseName(row.original.warehouseId) },
    { accessorKey: "currentStock", header: "Stock", cell: ({ row }) => `${row.original.currentStock} ${row.original.unit}` },
    { header: "Valor", cell: ({ row }) => formatCurrency(row.original.currentStock * row.original.unitCost, inventory.settings.currency) },
    { accessorKey: "status", header: "Estado", cell: ({ row }) => <StockBadge product={row.original} /> },
    { id: "actions", header: "", enableSorting: false, cell: ({ row }) => <ProductActions product={row.original} onEdit={() => { setEditing(row.original); setOpen(true); }} onDelete={() => deleteProduct(row.original)} /> },
  ], [deleteProduct, inventory]);

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Productos</CardTitle>
            <InfoTip content="Catálogo principal para revisar stock, valor, proveedor y estado por referencia." />
          </div>
          <p className="mt-1 text-sm text-slate-500">Catálogo operativo con stock, valor y alertas por referencia.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => setEditing(undefined)}><Plus className="h-4 w-4" /> Registrar producto</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Editar producto" : "Registrar producto"}</DialogTitle><DialogDescription>Completa los datos comerciales y operativos del producto.</DialogDescription></DialogHeader>
            <ProductForm
              product={editing}
              onCancel={() => setOpen(false)}
              onSubmit={(input) => {
                if (editing) inventory.updateProduct(editing.id, input);
                else inventory.addProduct(input);
                showToast({ title: editing ? "Producto actualizado" : "Producto creado", description: `${input.name} quedó disponible en el inventario.` });
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <Input placeholder="Buscar por nombre o SKU" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas las categorías</SelectItem>{inventory.categories.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select>
          <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["all", "Activo", "Bajo stock", "Sin stock", "Descontinuado"].map((item) => <SelectItem key={item} value={item}>{item === "all" ? "Todos los estados" : item}</SelectItem>)}</SelectContent></Select>
        </div>
        {filtered.length ? (
          <DataTable columns={columns} data={filtered} mobileCard={(product) => <ProductMobileCard product={product} onEdit={() => { setEditing(product); setOpen(true); }} onDelete={() => deleteProduct(product)} />} />
        ) : (
          <EmptyState title="No encontramos productos" description="Ajusta la búsqueda o limpia los filtros para volver a ver el catálogo completo." icon={PackageSearch} action={<Button variant="outline" onClick={clearFilters}>Limpiar filtros</Button>} />
        )}
      </CardContent>
    </Card>
  );
}

function ProductActions({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Button asChild size="icon" variant="ghost"><Link href={`/products/${product.id}`}><Eye className="h-4 w-4" /></Link></Button>
      <Button size="icon" variant="ghost" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
      <AlertDialog>
        <AlertDialogTrigger asChild><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-rose-600" /></Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription>Esta acción quitará {product.name} y su historial de movimientos del inventario actual.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel /><AlertDialogAction onClick={onDelete}>Eliminar producto</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProductMobileCard({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  const inventory = useInventory();
  return (
    <Card>
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-950">{product.name}</p>
            <p className="mt-1 text-xs text-slate-500">{product.sku} · {inventory.categoryName(product.categoryId)}</p>
          </div>
          <StockBadge product={product} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Stock" value={`${product.currentStock} ${product.unit}`} />
          <Info label="Valor" value={formatCurrency(product.currentStock * product.unitCost, inventory.settings.currency)} />
          <Info label="Proveedor" value={inventory.supplierName(product.supplierId)} />
          <Info label="Almacén" value={inventory.warehouseName(product.warehouseId)} />
        </div>
        <div className="flex justify-end gap-1"><ProductActions product={product} onEdit={onEdit} onDelete={onDelete} /></div>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-medium text-slate-900">{value}</p></div>;
}

function StockBadge({ product }: { product: Product }) {
  return <Badge tone={product.status === "Activo" ? "green" : product.status === "Bajo stock" ? "amber" : "red"}>{product.status}</Badge>;
}
