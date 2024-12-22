"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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
import {
    GetMessageFormJetStream,
    GetMessageFromJetStreamReq,
    Message
} from "@/services/jetstream.ts";
// import {Message} from "postcss";





const columns: ColumnDef<Message>[] = [
    {
        accessorKey: "sequence",
        header: "sequence",
    },
    {
        accessorKey: "data",
        header: "data",
    },
    {
        accessorKey: "subject",
        header: "subject",
    },
    {
        accessorKey: "received",
        header: "received",
    },

]


export function DataTable() {
    const [data, setData] = React.useState<Message[]>([])


    React.useEffect(() => {
        const fetchMessage = async () => {
            const req: GetMessageFromJetStreamReq = {
                stream_name: "EVENTS"
            }
            try {
                const resp =  await GetMessageFormJetStream(req);
                console.log(resp.messages)
                setData(resp.messages)
            } catch (e) {
                console.log(e)
            }
        }
        fetchMessage()
    }, []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })
    return (
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
                    {table.getRowModel().rows?.length ? (
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
    )
}
