"use client";

import type { ApexOptions } from "apexcharts";
import { ApexChart } from "@/components/charts/apex-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTip } from "@/components/ui/info-tip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory } from "@/features/inventory/inventory-context";
import { formatCurrency } from "@/lib/utils";

const colors = ["#059669", "#0284c7", "#f59e0b", "#7c3aed", "#e11d48"];

export default function ReportsPage() {
  const inventory = useInventory();
  const monthly = ["Feb", "Mar", "Abr", "May", "Jun", "Jul"].map((month, index) => {
    const monthNumber = String(index + 2).padStart(2, "0");
    const items = inventory.movements.filter((movement) => movement.date.slice(5, 7) === monthNumber);
    return {
      month,
      entradas: items.filter((item) => item.type === "entrada").reduce((sum, item) => sum + item.quantity, 0),
      salidas: items.filter((item) => item.type === "salida").reduce((sum, item) => sum + item.quantity, 0),
      ajustes: items.filter((item) => item.type === "ajuste").length,
    };
  });
  const byCategory = inventory.categories.map((category) => ({
    name: category.name,
    value: inventory.products.filter((product) => product.categoryId === category.id).length,
  }));
  const lowStock = [...inventory.products].sort((a, b) => a.currentStock / Math.max(a.minimumStock, 1) - b.currentStock / Math.max(b.minimumStock, 1)).slice(0, 5);
  const highValue = [...inventory.products].sort((a, b) => b.currentStock * b.unitCost - a.currentStock * a.unitCost).slice(0, 5);
  const totalEntries = monthly.reduce((sum, item) => sum + item.entradas, 0);
  const totalExits = monthly.reduce((sum, item) => sum + item.salidas, 0);
  const numberFormatter = new Intl.NumberFormat("es-PE");
  const movementOptions: ApexOptions = {
    chart: { toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#059669", "#0284c7"],
    dataLabels: { enabled: false },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
    plotOptions: { bar: { borderRadius: 5, columnWidth: "42%" } },
    states: { hover: { filter: { type: "none" } } },
    tooltip: {
      theme: "light",
      y: { formatter: (value) => `${numberFormatter.format(Number(value))} unidades` },
    },
    xaxis: {
      categories: monthly.map((item) => item.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748b" } },
    },
    yaxis: {
      labels: {
        formatter: (value) => numberFormatter.format(Number(value)),
        style: { colors: "#64748b" },
      },
    },
    legend: { show: false },
  };
  const movementSeries = [
    { name: "Entradas", data: monthly.map((item) => item.entradas) },
    { name: "Salidas", data: monthly.map((item) => item.salidas) },
  ];
  const categoryOptions: ApexOptions = {
    chart: { fontFamily: "inherit" },
    colors,
    dataLabels: { enabled: false },
    labels: byCategory.map((item) => item.name),
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "64%",
          labels: {
            show: true,
            name: { color: "#64748b" },
            value: { color: "#0f172a", formatter: (value) => numberFormatter.format(Number(value)) },
            total: { show: true, label: "Productos", color: "#64748b", formatter: () => numberFormatter.format(inventory.products.length) },
          },
        },
      },
    },
    stroke: { colors: ["#ffffff"], width: 3 },
    tooltip: { y: { formatter: (value) => `${numberFormatter.format(Number(value))} productos` } },
  };
  const categorySeries = byCategory.map((item) => item.value);

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold">Reportes</h2>
        <p className="mt-1 text-sm text-slate-500">Lectura ejecutiva de rotación, composición y valor del inventario.</p>
      </div>
      <section className="grid gap-6 xl:grid-cols-2">
        <Card><CardHeader><div className="flex items-center gap-2"><CardTitle>Entradas vs salidas</CardTitle><InfoTip content="Volumen mensual de ingresos y despachos registrados en inventario." /></div><div className="flex gap-4 text-xs text-slate-500"><Legend label="Entradas" color="#059669" /><Legend label="Salidas" color="#0284c7" /></div></CardHeader><CardContent className="h-80"><ApexChart type="bar" height="100%" options={movementOptions} series={movementSeries} /></CardContent></Card>
        <Card><CardHeader><div className="flex items-center gap-2"><CardTitle>Productos por categoría</CardTitle><InfoTip content="Participación de cada categoría dentro del catálogo actual." /></div></CardHeader><CardContent className="grid gap-4"><div className="h-72"><ApexChart type="donut" height="100%" options={categoryOptions} series={categorySeries} /></div><div className="grid gap-2 sm:grid-cols-2">{byCategory.map((item, index) => <Legend key={item.name} label={`${item.name}: ${item.value}`} color={colors[index % colors.length]} />)}</div></CardContent></Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <Ranking title="Menor stock" products={lowStock} value={(product) => `${product.currentStock} / ${product.minimumStock} ${product.unit}`} />
        <Ranking title="Mayor valor en inventario" products={highValue} value={(product) => formatCurrency(product.currentStock * product.unitCost, inventory.settings.currency)} />
      </section>
      <Card>
        <CardHeader><div className="flex items-center gap-2"><CardTitle>Resumen mensual</CardTitle><InfoTip content="Totales acumulados del periodo usado para medir el balance operativo." /></div></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Summary label="Entradas acumuladas" value={String(totalEntries)} />
          <Summary label="Salidas acumuladas" value={String(totalExits)} />
          <Summary label="Balance operativo" value={String(totalEntries - totalExits)} />
        </CardContent>
      </Card>
    </div>
  );
}

function Ranking({ title, products, value }: { title: string; products: ReturnType<typeof useInventory>["products"]; value: (product: ReturnType<typeof useInventory>["products"][number]) => string }) {
  return (
    <Card><CardHeader><div className="flex items-center gap-2"><CardTitle>{title}</CardTitle><InfoTip content={title === "Menor stock" ? "Productos más cercanos a quedarse sin stock según su mínimo definido." : "Productos con mayor valor financiero retenido en inventario."} /></div></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>SKU</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader><TableBody>{products.map((product) => <TableRow key={product.id}><TableCell className="font-medium text-slate-950">{product.name}</TableCell><TableCell>{product.sku}</TableCell><TableCell>{value(product)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p></div>;
}

function Legend({ label, color }: { label: string; color: string }) {
  return <span className="inline-flex items-center gap-2 text-xs text-slate-600"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />{label}</span>;
}
