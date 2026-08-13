// components/admin/DataTable.tsx
"use client";

import type { ReactNode } from "react";

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
}

export function DataTable<T>({ columns, data, keyExtractor, emptyMessage = "No records found." }: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
                <p className="text-sm text-gray-600">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full min-w-[800px] text-left">
                <thead>
                    <tr className="border-b border-gray-200 bg-[#f8f9fa]">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-600 ${col.className ?? ""}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((item) => (
                        <tr key={keyExtractor(item)} className="transition-colors hover:bg-gray-50">
                            {columns.map((col) => (
                                <td key={col.key} className={`px-4 py-3.5 text-sm text-gray-800 ${col.className ?? ""}`}>
                                    {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}