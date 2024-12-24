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
    GetStreamFromJetStream,
    Message,
    Stream
} from "@/services/jetstream.ts";
import { formToJSON } from "axios";
// import {Message} from "postcss";





const columnMessage: ColumnDef<Message>[] = [
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

const columnsStream: ColumnDef<Stream>[] = [
    {
        accessorKey: "Name",
        header: "Name",
    },
    {
        accessorKey: "total_message",
        header: "Total Message"
    },
    {
        accessorKey : "size",
        header: "Size"
    },
    {
        accessorKey: "created",
        header: "created"
    }
];
interface DataTableProps {
    breadItems : string[]
}


export const DataTable : React.FC<DataTableProps> = ({breadItems}) => {
    const [data, setData] = React.useState<any[]>([])
    const [columns,setColumn] = React.useState<ColumnDef<any>[]>([])

    React.useEffect(() => {
        console.log("12121",breadItems)
        const fetchMessage = async () => {
            console.log(breadItems[breadItems.length -1])
            if (breadItems[breadItems.length -1] === "Stream") {
                const resp = await GetStreamFromJetStream();
                console.log(resp)
                setData(resp)
                setColumn(columnsStream)
            }else{
                const req: GetMessageFromJetStreamReq = {
                    stream_name: "EVENTS"
                }
                try {
                    const resp =  await GetMessageFormJetStream(req);
                    setColumn(columnMessage)
                    setData(resp.messages)
                } catch (e) {
                    console.log(e)
                }
            }
        }
        fetchMessage()
    }, [breadItems]);

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
