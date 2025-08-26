import React from 'react';

// Defines the structure for a column in the table
export interface ColumnDefinition<T> {
  accessor: keyof T;
  header: string;
  cell?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  rowClassName?: (item: T) => string;
}

// A generic table component that can be used to display any kind of data.
// It takes data and column definitions as props to dynamically render the table.
function Table<T>({ data, columns, rowClassName }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((item, index) => (
            <tr 
              key={index} 
              className={`hover:bg-slate-50 ${rowClassName ? rowClassName(item) : ''}`}
            >
              {columns.map((col) => (
                <td
                  key={String(col.accessor)}
                  className="py-4 px-6 whitespace-nowrap text-sm text-slate-700"
                >
                  {col.cell ? col.cell(item) : String(item[col.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;