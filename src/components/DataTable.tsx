"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import * as React from "react";


interface DataTableProps {
    breadItems: string[],
    data : any[],
    columns: ColumnDef<any>[],
}


export const DataTable: React.FC<DataTableProps> = ({ breadItems,data,columns}) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        initialState : {
            pagination:{
                pageSize :data ? data.length : 0,
            }
        }
    })
    return (
        <>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {
                        table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
        {/*  Support pagination  */}
        {/*<Button*/}
        {/*    variant="outline"*/}
        {/*    size="sm"*/}
        {/*    onClick={() => table.previousPage()}*/}
        {/*    disabled={!table.getCanPreviousPage()}*/}
        {/*>*/}
        {/*    Previous*/}
        {/*</Button>*/}
        {/*<Button*/}
        {/*    variant="outline"*/}
        {/*    size="sm"*/}
        {/*    onClick={() => table.nextPage()}*/}
        {/*    disabled={!table.getCanNextPage()}*/}
        {/*>*/}
        {/*    Next*/}
        {/*</Button>*/}
    </div>
    </>
    )
}
