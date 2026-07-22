"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "@/features/inventory/inventory-context";
import { todayIso } from "@/lib/utils";
import type { MovementInput, MovementType } from "@/types/inventory";

const schema = z.object({
  productId: z.string().min(1),
  type: z.enum(["entrada", "salida", "ajuste"]),
  quantity: z.coerce.number().min(1, "La cantidad debe ser mayor a cero."),
  date: z.string().min(1, "Selecciona una fecha."),
  userId: z.string().min(1),
  reason: z.string().min(3, "Describe el motivo del movimiento."),
  warehouseId: z.string().min(1),
});

type MovementFormValues = z.input<typeof schema>;

export function MovementForm({
  productId,
  type,
  onSubmit,
  onCancel,
}: {
  productId?: string;
  type?: MovementType;
  onSubmit: (input: MovementInput) => void;
  onCancel?: () => void;
}) {
  const { products, users, warehouses } = useInventory();
  const selectedProduct = products.find((product) => product.id === productId) ?? products[0];
  const form = useForm<MovementFormValues, unknown, MovementInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: selectedProduct?.id ?? "",
      type: type ?? "entrada",
      quantity: 1,
      date: todayIso(),
      userId: users[0]?.id ?? "",
      reason: type === "salida" ? "Salida operativa" : "Reposición de inventario",
      warehouseId: selectedProduct?.warehouseId ?? warehouses[0]?.id ?? "",
    },
  });

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField disabled={Boolean(productId)} label="Producto" value={form.watch("productId")} onValueChange={(value) => form.setValue("productId", value)}>
          {products.map((product) => <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>)}
        </SelectField>
        <SelectField label="Tipo" value={form.watch("type")} onValueChange={(value) => form.setValue("type", value as MovementType)}>
          <SelectItem value="entrada">Entrada</SelectItem>
          <SelectItem value="salida">Salida</SelectItem>
          <SelectItem value="ajuste">Ajuste</SelectItem>
        </SelectField>
        <div className="grid gap-2">
          <Label>Cantidad</Label>
          <Input type="number" {...form.register("quantity")} />
          {form.formState.errors.quantity ? <p className="text-xs text-rose-600">{form.formState.errors.quantity.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <Label>Fecha</Label>
          <Input type="date" {...form.register("date")} />
          {form.formState.errors.date ? <p className="text-xs text-rose-600">{form.formState.errors.date.message}</p> : null}
        </div>
        <SelectField label="Usuario" value={form.watch("userId")} onValueChange={(value) => form.setValue("userId", value)}>
          {users.map((user) => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
        </SelectField>
        <SelectField label="Almacén" value={form.watch("warehouseId")} onValueChange={(value) => form.setValue("warehouseId", value)}>
          {warehouses.map((warehouse) => <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>)}
        </SelectField>
        <div className="grid gap-2 sm:col-span-2">
          <Label>Motivo</Label>
          <Input {...form.register("reason")} />
          {form.formState.errors.reason ? <p className="text-xs text-rose-600">{form.formState.errors.reason.message}</p> : null}
        </div>
      </div>
      <p className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
        Las entradas suman stock, las salidas descuentan stock y un ajuste fija el stock al valor contado.
      </p>
      <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button> : null}
        <Button type="submit">Registrar movimiento</Button>
      </div>
    </form>
  );
}

function SelectField({
  label,
  value,
  onValueChange,
  children,
  disabled,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select disabled={disabled} value={value} onValueChange={onValueChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
