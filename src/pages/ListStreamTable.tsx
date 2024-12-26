import { DataTable } from "@/components/DataTable"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { GetMessageFromJetStreamReq, GetStreamFromJetStream, Stream } from "@/services/jetstream"
import { Separator } from "@radix-ui/react-separator"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React from "react"




const columnsStream: ColumnDef<Stream>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "total_message",
        header: "Total Message"
    },
    {
        accessorKey: "size",
        header: "Size"
    },
    {
        accessorKey: "created",
        header: "created"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                        <a href={"/streams/publish?event=" + payment.name} >Publish Messages</a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><a href={"/streams/messages?event=" + payment.name} >View Messages</a></DropdownMenuItem>
                        <DropdownMenuItem>View Consumer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];

export const ListStreamTable = () => {
    const [data, setData] = React.useState<any[]>([])
    const [columns, setColumn] = React.useState<ColumnDef<any>[]>([])


    React.useEffect(() => {
        const fetchMessage = async () => {
            try {
                const resp = await GetStreamFromJetStream();
                console.log(resp)
                setData(resp)
                setColumn(columnsStream)
            } catch (e) {
                console.log(e)
            }
        }
        fetchMessage()
    }, []);
    return (
        <>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Documentation</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Streams</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="container mx-auto py-10">
                        <DataTable breadItems={["Stream"]} data={data} columns={columns} />
                    </div>
                </div>
            </SidebarInset>
        </>
    )
}