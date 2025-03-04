import { DataTable } from "@/components/DataTable"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
    CreateBucket,
    CreateBucketRequest,
    CreateStream,
    CreateStreamReq,
    GetBucketFromJetStream,
    Stream
} from "@/services/jetstream"
import { Separator } from "@radix-ui/react-separator"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React from "react"
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
import {Textarea} from "@/components/ui/textarea.tsx";




const columnsBucket: ColumnDef<Stream>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "total_message",
        header: "Total Key"
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
            const bucket = row.original

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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><a href={"/buckets/keys?buckets=" + bucket.name} >View Keys</a></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];

export const ListBucketTable = () => {
    const [data, setData] = React.useState<Stream[]>([])
    const [columns, setColumn] = React.useState<ColumnDef<Stream>[]>([])
    const [isLoading, setIsLoading] = React.useState(false)

    React.useEffect(() => {
        const fetchMessage = async () => {
            try {
                const resp = await GetBucketFromJetStream();
                setData(resp)
                setColumn(columnsBucket)
            } catch (e) {
                console.log(e)
            }
        }
        fetchMessage()
    }, [isLoading]);


    const handleEventCreateBucket  =  async () => {
        const input = document.getElementById("bucket_name") as HTMLInputElement
        // add component select type storge
        try {
            const req : CreateBucketRequest = {
                bucket_name : input.value,
            }
            const result = await CreateBucket(req)
            if (result) {
                setIsLoading(true)
            }
        }catch(error){
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
                                    <Button variant="outline">Create Bucket</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Create Bucket</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid w-full gap-1.5">
                                            <Label htmlFor="bucket_name">
                                                Bucket Name
                                            </Label>
                                            <Input
                                                id="bucket_name"
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose>
                                            <Button type="button" onClick={handleEventCreateBucket}>
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