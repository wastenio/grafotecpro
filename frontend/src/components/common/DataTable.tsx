// src/components/common/DataTable.tsx
import type { ReactNode } from "react";


export interface Column<T> {
    key: string;
    label: string;
    accessor?: keyof T;
    render?: (value: any, row?: T) => ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
}

export const DataTable = <T extends {}>({ columns, data }: DataTableProps<T>) => {
    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col) => {
                            // valor da coluna
                            const value = col.accessor ? row[col.accessor] : undefined;
                            // converte para ReactNode
                            const content: ReactNode = col.render
                                ? col.render(value, row)
                                : (value as unknown as ReactNode);

                            return <td key={col.key}>{content}</td>;
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
