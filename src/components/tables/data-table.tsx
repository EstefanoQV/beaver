"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DataTable<TData>({
  columns,
  data,
  empty = "No hay registros para mostrar.",
  mobileCard,
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
  empty?: string;
  mobileCard?: (item: TData) => React.ReactNode;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {mobileCard ? (
        <div className="grid gap-3 md:hidden">
          {data.length ? data.map((item, index) => <div key={index}>{mobileCard(item)}</div>) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              {empty}
            </div>
          )}
        </div>
      ) : null}
      <div className={mobileCard ? "max-md:hidden overflow-hidden rounded-lg border border-slate-200 bg-white md:block" : "overflow-hidden rounded-lg border border-slate-200 bg-white"}>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        className="inline-flex items-center gap-1 text-left"
                        onClick={header.column.getToggleSortingHandler()}
                        type="button"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() ? <ArrowUpDown className="h-3 w-3" /> : null}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center text-slate-500" colSpan={columns.length}>
                  {empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </>
  );
}
