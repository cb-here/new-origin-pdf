"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../tables/index";
import Checkbox from "../from/Checkbox";

interface HeaderConfig<T> {
  label: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface ActionConfig<T> {
  label: string;
  render?: (item: T) => React.ReactNode;
  onClick?: (item: T) => void;
  className?: string;
}

interface CommonTableProps<T> {
  headers: HeaderConfig<T>[];
  data: T[];
  actions?: ActionConfig<T>[];
  withCheckbox?: boolean;
  loading?: boolean;
  emptyStateMessage?: string;
  skeletonRows?: number; // number of skeleton rows
}

export default function CommonTable<T extends { id: string }>({
  headers,
  data,
  actions = [],
  withCheckbox = true,
  loading = false,
  emptyStateMessage = "No records found",
  skeletonRows = 10,
}: CommonTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(data.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="px-6 py-3.5 border-t border-gray-100 border-y bg-gray-50 dark:border-white/[0.05] dark:bg-gray-900">
            <TableRow>
              {withCheckbox && (
                <TableCell className="px-6 py-3 font-medium text-gray-500 text-theme-xs">
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </TableCell>
              )}
              {headers.map((header, idx) => (
                <TableCell
                  key={idx}
                  className={`px-6 py-3 font-medium text-gray-500 text-theme-xs ${
                    header.className ?? ""
                  }`}
                >
                  {header.label}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell className="px-6 py-3 font-medium text-gray-500 text-theme-xs">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {withCheckbox && (
                    <TableCell className="px-4 sm:px-6 py-3.5 border-b border-gray-200 dark:border-white/[0.1]">
                      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse"></div>
                    </TableCell>
                  )}
                  {headers.map((_, idx) => (
                    <TableCell
                      key={idx}
                      className="px-4 sm:px-6 py-3.5 border-b border-gray-200 dark:border-white/[0.1]"
                    >
                      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell className="px-4 sm:px-6 py-3.5 flex gap-2 border-b border-gray-200 dark:border-white/[0.1]">
                      <div className="h-6 w-12 rounded bg-gray-200 animate-pulse"></div>
                      <div className="h-6 w-12 rounded bg-gray-200 animate-pulse"></div>
                    </TableCell>
                  )}
                </TableRow>
              ))}

            
            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    headers.length +
                    (withCheckbox ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="px-6 py-6 text-center text-gray-500 text-xl border-b border-gray-200 dark:border-white/[0.1]"
                >
                  {emptyStateMessage}
                </TableCell>
              </TableRow>
            )}

            {/* Actual data */}
            {!loading &&
              data.length > 0 &&
              data.map((row) => (
                <TableRow key={row.id}>
                  {withCheckbox && (
                    <TableCell className="px-4 sm:px-6 py-3.5 border-b border-gray-200 dark:border-white/[0.1]">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                      />
                    </TableCell>
                  )}
                  {headers.map((header, idx) => (
                    <TableCell
                      key={idx}
                      className={`px-4 sm:px-6 py-3.5 border-b border-gray-200 dark:border-white/[0.1] ${
                        header.className ?? ""
                      }`}
                    >
                      {header.render(row)}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell className="px-4 sm:px-6 py-3.5 flex gap-2 border-b border-gray-200 dark:border-white/[0.1]">
                      {actions.map((action, idx) =>
                        action.render ? (
                          <span key={idx}>{action.render(row)}</span>
                        ) : (
                          <button
                            key={idx}
                            onClick={() => action.onClick?.(row)}
                            className={`px-2 py-1 rounded text-sm ${
                              action.className ??
                              "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {action.label}
                          </button>
                        )
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
