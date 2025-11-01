import React from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface StandardTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

export function StandardTable<T extends Record<string, any>>({
  data,
  columns,
  emptyMessage = "Nenhum registro encontrado",
  loading = false,
  onRowClick,
}: StandardTableProps<T>) {
  
  const getValue = (row: T, key: string): any => {
    if (key.includes('.')) {
      const keys = key.split('.');
      let value: any = row;
      for (const k of keys) {
        value = value?.[k];
      }
      return value;
    }
    return row[key as keyof T];
  };

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg">
      <table className="w-full text-sm bg-white dark:bg-[#1a1625]">
        <thead className="bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`
                  px-4 md:px-6 py-3 text-left text-xs font-bold text-[#D4AF37] uppercase tracking-wider
                  ${column.className || ''}
                `}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-white/10">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-gray-600 dark:text-gray-400"
              >
                Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-gray-600 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className={`
                  transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {columns.map((column) => {
                  const value = getValue(row, String(column.key));
                  return (
                    <td
                      key={String(column.key)}
                      className={`px-4 md:px-6 py-3 text-sm text-gray-900 dark:text-white ${column.className || ''}`}
                    >
                      {column.render ? column.render(value, row) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
