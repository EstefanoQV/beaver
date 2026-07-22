"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTip } from "@/components/ui/info-tip";
import { useInventory } from "@/features/inventory/inventory-context";
import { formatCurrency } from "@/lib/utils";

export default function WarehousesPage() {
  const inventory = useInventory();
  return (
    <div className="grid gap-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Almacenes</h2>
          <InfoTip content="Ubicaciones donde se concentra stock, responsables y valor bajo custodia." />
        </div>
        <p className="mt-1 text-sm text-slate-500">Capacidad operativa, responsables y valor bajo custodia.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inventory.warehouses.map((warehouse) => {
          const products = inventory.products.filter((product) => product.warehouseId === warehouse.id);
          const value = products.reduce((sum, product) => sum + product.currentStock * product.unitCost, 0);
          const lowStock = products.filter((product) => product.currentStock <= product.minimumStock).length;
          return (
            <Card key={warehouse.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div><CardTitle>{warehouse.name}</CardTitle><p className="mt-1 text-sm text-slate-500">{warehouse.location}</p></div>
                  <Badge tone={warehouse.status === "Operativo" ? "green" : warehouse.status === "Mantenimiento" ? "amber" : "red"}>{warehouse.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <p className="text-sm text-slate-600">Responsable: <span className="font-medium text-slate-950">{warehouse.manager}</span></p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-slate-50 p-3"><p className="text-sm text-slate-500">Productos</p><p className="text-xl font-semibold">{products.length}</p></div>
                  <div className="rounded-md bg-slate-50 p-3"><p className="text-sm text-slate-500">Valor total</p><p className="text-xl font-semibold">{formatCurrency(value, inventory.settings.currency)}</p></div>
                </div>
                <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-600">
                  {lowStock ? `${lowStock} referencias requieren reposición.` : "Sin alertas críticas de stock."}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
