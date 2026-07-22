"use client";

import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Boxes, CheckCircle2, DollarSign, Package, TrendingUp } from "lucide-react";
import type { ApexOptions } from "apexcharts";
import { ApexChart } from "@/components/charts/apex-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTip } from "@/components/ui/info-tip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory } from "@/features/inventory/inventory-context";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

const colors = ["#059669", "#0284c7", "#f59e0b", "#7c3aed", "#e11d48"];

export default function DashboardPage() {
  const { products, movements, settings, categoryName, productName, warehouseName, userName } = useDashboardData();
  const totalValue = products.reduce((sum, product) => sum + product.currentStock * product.unitCost, 0);
  const lowStock = products.filter((product) => product.currentStock <= product.minimumStock);
  const outOfStock = products.filter((product) => product.currentStock === 0);
  const monthMovements = movements.filter((movement) => movement.date.startsWith("2026-07"));
  const entries = monthMovements.filter((movement) => movement.type === "entrada").reduce((sum, item) => sum + item.quantity, 0);
  const exits = monthMovements.filter((movement) => movement.type === "salida").reduce((sum, item) => sum + item.quantity, 0);
  const healthyProducts = products.length - lowStock.length;
  const healthScore = Math.round((healthyProducts / products.length) * 100);

  const movementChart = ["Feb", "Mar", "Abr", "May", "Jun", "Jul"].map((month, index) => {
    const monthNumber = String(index + 2).padStart(2, "0");
    const monthItems = movements.filter((movement) => movement.date.slice(5, 7) === monthNumber);
    return {
      month,
      entradas: monthItems.filter((item) => item.type === "entrada").reduce((sum, item) => sum + item.quantity, 0),
      salidas: monthItems.filter((item) => item.type === "salida").reduce((sum, item) => sum + item.quantity, 0),
    };
  });

  const categoryChart = Object.entries(
    products.reduce<Record<string, number>>((acc, product) => {
      acc[categoryName(product.categoryId)] = (acc[categoryName(product.categoryId)] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const mainRisk = lowStock[0];
  const movementOptions: ApexOptions = {
    chart: { toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#059669", "#0284c7"],
    dataLabels: { enabled: false },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
    plotOptions: { bar: { borderRadius: 5, columnWidth: "42%" } },
    states: { hover: { filter: { type: "none" } } },
    tooltip: {
      theme: "light",
      y: { formatter: (value) => `${formatNumber(Number(value))} unidades` },
    },
    xaxis: {
      categories: movementChart.map((item) => item.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748b" } },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatNumber(Number(value)),
        style: { colors: "#64748b" },
      },
    },
    legend: { show: false },
  };
  const movementSeries = [
    { name: "Entradas", data: movementChart.map((item) => item.entradas) },
    { name: "Salidas", data: movementChart.map((item) => item.salidas) },
  ];
  const categoryOptions: ApexOptions = {
    chart: { fontFamily: "inherit" },
    colors,
    dataLabels: { enabled: false },
    labels: categoryChart.map((item) => item.name),
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            name: { color: "#64748b" },
            value: { color: "#0f172a", formatter: (value) => formatNumber(Number(value)) },
            total: { show: true, label: "Productos", color: "#64748b", formatter: () => formatNumber(products.length) },
          },
        },
      },
    },
    stroke: { colors: ["#ffffff"], width: 3 },
    tooltip: { y: { formatter: (value) => `${formatNumber(Number(value))} productos` } },
  };
  const categorySeries = categoryChart.map((item) => item.value);

  return (
    <div className="grid min-w-0 gap-6">
      <section className="grid min-w-0 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="min-w-0 overflow-hidden border-slate-200">
          <CardContent className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
            <div className="min-w-0">
              <Badge tone={outOfStock.length ? "red" : lowStock.length ? "amber" : "green"}>
                {outOfStock.length ? "Reposición urgente" : lowStock.length ? "Atención esta semana" : "Inventario saludable"}
              </Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {outOfStock.length
                  ? `${outOfStock.length} producto requiere Reposición inmediata.`
                  : `${healthScore}% del inventario está dentro de rango.`}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Beaver detecta {lowStock.length} referencias bajo mínimo, con {formatNumber(entries)} unidades ingresadas y {formatNumber(exits)} unidades despachadas durante julio.
              </p>
              <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-3">
                <Signal icon={AlertTriangle} label="Riesgo principal" value={mainRisk ? mainRisk.name : "Sin alertas"} tone={lowStock.length ? "amber" : "green"} />
                <Signal icon={TrendingUp} label="Balance mensual" value={`${formatNumber(entries - exits)} unidades`} tone="green" />
                <Signal icon={CheckCircle2} label="Productos sanos" value={`${healthyProducts} de ${products.length}`} tone="blue" />
              </div>
            </div>
            <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-600">Valor total controlado</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{formatCurrency(totalValue, settings.currency)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">Distribuido en {products.length} productos, {categoryChart.length} categorías y 3 almacenes activos.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader><CardTitle>Atención prioritaria</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {lowStock.slice(0, 3).map((product) => (
              <div key={product.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-600">{warehouseName(product.warehouseId)} · mínimo {product.minimumStock}</p>
                  </div>
                  <Badge tone={product.currentStock === 0 ? "red" : "amber"}>{product.currentStock} {product.unit}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric title="Valor inventario" value={formatCurrency(totalValue, settings.currency)} icon={DollarSign} info="Suma del stock actual multiplicado por el costo unitario de cada producto." />
        <Metric title="Productos" value={formatNumber(products.length)} icon={Package} info="Cantidad total de referencias activas dentro del inventario local." />
        <Metric title="Stock bajo" value={formatNumber(lowStock.length)} icon={AlertTriangle} tone="amber" info="Productos cuyo stock actual está en el mínimo definido o por debajo." />
        <Metric title="Entradas mes" value={formatNumber(entries)} icon={ArrowUpCircle} tone="green" info="Unidades registradas como ingreso durante el mes actual." />
        <Metric title="Salidas mes" value={formatNumber(exits)} icon={ArrowDownCircle} tone="blue" info="Unidades despachadas o retiradas durante el mes actual." />
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Movimientos mensuales</CardTitle>
              <InfoTip content="Compara entradas y salidas para detectar meses con mayor rotación operativa." />
            </div>
            <div className="flex gap-4 text-xs text-slate-500"><Legend color="bg-emerald-600" label="Entradas" /><Legend color="bg-sky-600" label="Salidas" /></div>
          </CardHeader>
          <CardContent className="h-80 min-w-0">
            <ApexChart type="bar" height="100%" options={movementOptions} series={movementSeries} />
          </CardContent>
        </Card>
        <Card className="min-w-0 overflow-hidden">
          <CardHeader><div className="flex items-center gap-2"><CardTitle>Productos por categoría</CardTitle><InfoTip content="Distribución de referencias por familia para entender concentración del catálogo." /></div></CardHeader>
          <CardContent className="grid gap-4">
            <div className="h-64">
              <ApexChart type="donut" height="100%" options={categoryOptions} series={categorySeries} />
            </div>
            <div className="grid gap-2">
              {categoryChart.map((item, index) => <Legend key={item.name} color="" label={`${item.name}: ${item.value}`} swatchColor={colors[index % colors.length]} />)}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader><div className="flex items-center gap-2"><CardTitle>Últimos movimientos</CardTitle><InfoTip content="Actividad reciente que impactó el stock de productos." /></div></CardHeader>
          <CardContent className="min-w-0">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Tipo</TableHead><TableHead>Producto</TableHead><TableHead>Cantidad</TableHead><TableHead>Fecha</TableHead><TableHead>Usuario</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {movements.slice(0, 6).map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell><Badge tone={movement.type === "entrada" ? "green" : movement.type === "salida" ? "blue" : "amber"}>{movement.type}</Badge></TableCell>
                    <TableCell>{productName(movement.productId)}</TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>{formatDate(movement.date)}</TableCell>
                    <TableCell>{userName(movement.userId)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center gap-2"><CardTitle>Qué está funcionando bien</CardTitle><InfoTip content="Señales positivas calculadas a partir del estado actual del inventario." /></div></CardHeader>
          <CardContent className="grid gap-3">
            <GoodNews title="Reposiciones activas" detail={`${formatNumber(entries)} unidades ingresadas este mes.`} />
            <GoodNews title="Cobertura operativa" detail={`${healthyProducts} productos se mantienen sobre su mínimo.`} />
            <GoodNews title="Valor monitoreado" detail={`${formatCurrency(totalValue, settings.currency)} bajo seguimiento de inventario.`} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Metric({ title, value, icon: Icon, tone = "slate", info }: { title: string; value: string; icon: typeof Boxes; tone?: "slate" | "amber" | "green" | "blue"; info?: string }) {
  const styles = { slate: "bg-slate-900", amber: "bg-amber-500", green: "bg-emerald-600", blue: "bg-sky-600" };
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm text-slate-500">{title}</p>
            {info ? <InfoTip content={info} className="h-5 w-5" /> : null}
          </div>
          <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${styles[tone]}`}><Icon className="h-5 w-5" /></div>
      </CardContent>
    </Card>
  );
}

function Signal({ icon: Icon, label, value, tone }: { icon: typeof AlertTriangle; label: string; value: string; tone: "amber" | "green" | "blue" }) {
  const colorsByTone = { amber: "text-amber-700 bg-amber-50", green: "text-emerald-700 bg-emerald-50", blue: "text-sky-700 bg-sky-50" };
  return <div className="rounded-lg border border-slate-200 bg-white p-3"><Icon className={`h-4 w-4 rounded ${colorsByTone[tone]}`} /><p className="mt-2 text-xs text-slate-500">{label}</p><p className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</p></div>;
}

function Legend({ color, label, swatchColor }: { color: string; label: string; swatchColor?: string }) {
  return <span className="inline-flex items-center gap-2 text-xs text-slate-600"><span className={`h-2.5 w-2.5 rounded-full ${color}`} style={swatchColor ? { backgroundColor: swatchColor } : undefined} />{label}</span>;
}

function GoodNews({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3"><p className="font-medium text-emerald-950">{title}</p><p className="mt-1 text-sm leading-5 text-emerald-800">{detail}</p></div>;
}

function useDashboardData() {
  const inventory = useInventory();
  return {
    ...inventory,
    productName: (id: string) => inventory.products.find((product) => product.id === id)?.name ?? "Producto",
  };
}
