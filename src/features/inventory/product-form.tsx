"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "@/features/inventory/inventory-context";
import type { Product, ProductInput } from "@/types/inventory";

const schema = z.object({
  name: z.string().min(3, "Ingresa un nombre descriptivo."),
  sku: z.string().min(3, "El SKU debe tener al menos 3 caracteres."),
  categoryId: z.string().min(1, "Selecciona una categoría."),
  supplierId: z.string().min(1, "Selecciona un proveedor."),
  warehouseId: z.string().min(1, "Selecciona un almacén."),
  unit: z.string().min(1, "Indica la unidad de medida."),
  currentStock: z.coerce.number().min(0, "El stock no puede ser negativo."),
  minimumStock: z.coerce.number().min(0, "El mínimo no puede ser negativo."),
  unitCost: z.coerce.number().min(0, "El costo no puede ser negativo."),
  salePrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

type ProductFormValues = z.input<typeof schema>;

export function ProductForm({
  product,
  onSubmit,
  onCancel,
}: {
  product?: Product;
  onSubmit: (input: ProductInput) => void;
  onCancel?: () => void;
}) {
  const { categories, suppliers, warehouses, settings } = useInventory();
  const form = useForm<ProductFormValues, unknown, ProductInput>({
    resolver: zodResolver(schema),
    defaultValues: product ?? {
      name: "",
      sku: "",
      categoryId: categories[0]?.id ?? "",
      supplierId: suppliers[0]?.id ?? "",
      warehouseId: warehouses[0]?.id ?? "",
      unit: settings.defaultUnit,
      currentStock: 0,
      minimumStock: settings.globalMinimumStock,
      unitCost: 0,
      salePrice: 0,
    },
  });

  const fields = [
    ["name", "Nombre"],
    ["sku", "SKU"],
    ["unit", "Unidad"],
    ["currentStock", "Stock actual"],
    ["minimumStock", "Stock mínimo"],
    ["unitCost", "Costo unitario"],
    ["salePrice", "Precio de venta"],
  ] as const;

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([name, label]) => (
          <div className="grid gap-2" key={name}>
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              step={name === "unitCost" || name === "salePrice" ? "0.01" : undefined}
              type={["currentStock", "minimumStock", "unitCost", "salePrice"].includes(name) ? "number" : "text"}
              {...form.register(name)}
            />
            {form.formState.errors[name] ? <p className="text-xs text-rose-600">{form.formState.errors[name]?.message}</p> : null}
          </div>
        ))}
        <SelectField label="Categoría" value={form.watch("categoryId")} onValueChange={(value) => form.setValue("categoryId", value)}>
          {categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
        </SelectField>
        <SelectField label="Proveedor" value={form.watch("supplierId")} onValueChange={(value) => form.setValue("supplierId", value)}>
          {suppliers.map((supplier) => <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>)}
        </SelectField>
        <SelectField label="Almacén" value={form.watch("warehouseId")} onValueChange={(value) => form.setValue("warehouseId", value)}>
          {warehouses.map((warehouse) => <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>)}
        </SelectField>
      </div>
      <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button> : null}
        <Button type="submit">{product ? "Guardar cambios" : "Registrar producto"}</Button>
      </div>
    </form>
  );
}

function SelectField({
  label,
  value,
  onValueChange,
  children,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
