"use client";

import { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InfoTip } from "@/components/ui/info-tip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useInventory } from "@/features/inventory/inventory-context";
import { formatCurrency } from "@/lib/utils";
import type { Category } from "@/types/inventory";

export default function CategoriesPage() {
  const inventory = useInventory();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Category | undefined>();
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Categorías</h2>
            <InfoTip content="Familias usadas para clasificar productos y estimar valor por línea operativa." />
          </div>
          <p className="mt-1 text-sm text-slate-500">Agrupa el inventario por familias operativas y valor estimado.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => setEditing(undefined)}><Plus className="h-4 w-4" /> Registrar categoría</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Editar categoría" : "Registrar categoría"}</DialogTitle></DialogHeader>
            <CategoryForm
              category={editing}
              onCancel={() => setOpen(false)}
              onSave={(name, description) => {
                if (editing) inventory.updateCategory(editing.id, name, description);
                else inventory.addCategory(name, description);
                showToast({ title: editing ? "Categoría actualizada" : "Categoría creada", description: `${name} quedó disponible para clasificar productos.` });
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inventory.categories.map((category) => {
          const products = inventory.products.filter((product) => product.categoryId === category.id);
          const value = products.reduce((sum, product) => sum + product.currentStock * product.unitCost, 0);
          return (
            <Card key={category.id}>
              <CardHeader className="flex-row items-start justify-between gap-3">
                <div><CardTitle>{category.name}</CardTitle><p className="mt-1 text-sm leading-6 text-slate-500">{category.description}</p></div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(category); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-rose-600" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Eliminar categoría</AlertDialogTitle><AlertDialogDescription>Se quitará {category.name}. Los productos asociados podrían quedar sin categoría visible.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel /><AlertDialogAction onClick={() => { inventory.deleteCategory(category.id); showToast({ title: "Categoría eliminada", description: `${category.name} se retiró del catálogo.` }); }}>Eliminar categoría</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-slate-50 p-3"><p className="text-sm text-slate-500">Productos</p><p className="text-xl font-semibold">{products.length}</p></div>
                <div className="rounded-md bg-slate-50 p-3"><p className="text-sm text-slate-500">Valor</p><p className="text-xl font-semibold">{formatCurrency(value, inventory.settings.currency)}</p></div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

function CategoryForm({ category, onSave, onCancel }: { category?: Category; onSave: (name: string, description: string) => void; onCancel: () => void }) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  return (
    <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSave(name, description); }}>
      <div className="grid gap-2"><Label>Nombre</Label><Input value={name} onChange={(event) => setName(event.target.value)} required /></div>
      <div className="grid gap-2"><Label>Descripción</Label><Input value={description} onChange={(event) => setDescription(event.target.value)} required /></div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button><Button type="submit">Guardar cambios</Button></div>
    </form>
  );
}
