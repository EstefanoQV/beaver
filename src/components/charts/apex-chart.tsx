"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ApexChartProps = {
  type: "bar" | "donut" | "line" | "area";
  height: number | string;
  options: ApexOptions;
  series: NonNullable<ApexOptions["series"]>;
};

export function ApexChart({ type, height, options, series }: ApexChartProps) {
  return <ReactApexChart type={type} height={height} options={options} series={series} />;
}

