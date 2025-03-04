import { DataTable } from "@/components/DataTable"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
    CreateStream,
    CreateStreamReq,
    GetStreamFromJetStream,
    PublishMessage,
    PublishMessageReq,
    Stream
} from "@/services/jetstream"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React from "react"

import {Separator} from "@/components/ui/separator.tsx";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;




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
        header: "Created"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const stream = row.original
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
                        <a href={"/streams/publish?event=" + stream.name} >Detail</a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><a href={"/streams/messages?event=" + stream.name} >View Messages</a></DropdownMenuItem>
                        <DropdownMenuItem>View Consumer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];

export const ListStreamTable = () => {
    const [data, setData] = React.useState<Stream[]>([])
    const [columns, setColumn] = React.useState<ColumnDef<Stream>[]>([])
    const [isLoading, setIsLoading] = React.useState(false)

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
    }, [isLoading]);

    const handleEventCreateStream  =  async () => {
        const textarea = document.getElementById('streamName') as HTMLInputElement
        console.log(textarea.value)
        const input = document.getElementById("subject") as HTMLInputElement
        console.log(input.value)
        // add component select type storge
        try {
            const req : CreateStreamReq = {
                subject : input.value,
                stream_name : textarea.value,
                storage: 0,
            }
            const result = await CreateStream(req)
            if (result) {
                setIsLoading(true)
            }
        }catch(error){
            console.log("err")
            console.log( error)
            throw error;
        }

    }
    return (
        <>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="container mx-auto py-10">
                        <div className="py-1">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Create Stream</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Create Stream</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid w-full gap-1.5">
                                            <Label htmlFor="streamName">
                                                Stream Name
                                            </Label>
                                            <Input
                                                id="streamName"
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid w-full gap-1.5">
                                            <Label htmlFor="subject">
                                                Subject
                                            </Label>
                                            <Input
                                                id="subject"
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid w-full gap-1.5">
                                            <Label htmlFor="storage">
                                                Storage
                                            </Label>

                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose>
                                            <Button type="button" onClick={handleEventCreateStream}>
                                                Create
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <DataTable breadItems={["Stream"]} data={data} columns={columns}/>
                    </div>
                </div>
            </SidebarInset>
        </>
    )
}