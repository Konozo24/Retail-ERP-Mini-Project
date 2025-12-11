import React from "react";
import { ChevronsUpDown, Edit, Trash2 } from "lucide-react";
import Pagination from "../Pagination";

const DataTable = ({
    columns,
    data,
    onEdit,
    onDelete,
    showNumber = true, // Replaced 'selectable' with 'showNumber'
    actions = true,
    // Pagination Props
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => { },
    itemsPerPage = 10,
    onItemsPerPageChange = () => { }
}) => {
    return (
        <div className="w-full bg-card rounded-lg border border-border overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">

                    {/* --- TABLE HEADER --- */}
                    <thead className="bg-muted/40 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            {/* Number Column Header */}
                            {showNumber && (
                                <th className="p-4 w-16">#</th>
                            )}

                            {columns.map((col, index) => (
                                <th key={index} className="p-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                                        {col.header}
                                        {col.sortable && <ChevronsUpDown className="w-3 h-3 opacity-50" />}
                                    </div>
                                </th>
                            ))}

                            {actions && <th className="p-4 text-right">Action</th>}
                        </tr>
                    </thead>

                    {/* --- TABLE BODY --- */}
                    <tbody className="divide-y divide-border">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-muted/20 transition-colors group">

                                    {/* Number Column Cell */}
                                    {showNumber && (
                                        <td className="p-4 text-muted-foreground font-medium">
                                            {/* Calculate global row number: (Page-1) * Limit + Index + 1 */}
                                            {(currentPage - 1) * itemsPerPage + rowIndex + 1}
                                        </td>
                                    )}

                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="p-4 align-middle text-foreground">
                                            {col.render ? (
                                                col.render(row)
                                            ) : (
                                                <span className="text-foreground/90">{row[col.accessor]}</span>
                                            )}
                                        </td>
                                    ))}

                                    {actions && (
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        className="p-2 border border-border rounded hover:bg-muted hover:text-primary transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(row)}
                                                        className="p-2 border border-border rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            // Empty State
                            <tr>
                                <td colSpan={columns.length + (showNumber ? 1 : 0) + (actions ? 1 : 0)} className="p-8 text-center text-muted-foreground">
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- PAGINATION FOOTER --- */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
            />
        </div>
    );
};

export default DataTable;