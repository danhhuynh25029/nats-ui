import { DataTable } from "@/components/DataTable"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
    Key,
    GetKeyRequest,
    GetKeyFromBucket,
    CreateKeyReq, CreateKey
} from "@/services/jetstream"
import { Separator } from "@radix-ui/react-separator"
import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { useSearchParams } from "react-router-dom"
import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

const columnMessage: ColumnDef<Key>[] = [
    {
        accessorKey: "key",
        header: "Key Name",
    },
    {
        accessorKey: "value",
        header: "Value",
    },
]

export const ListKeyTable = () => {
    const [data, setData] = React.useState<Key[]>([])
    const [columns, setColumn] = React.useState<ColumnDef<Key>[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [searchParams] = useSearchParams();

     React.useEffect(() => {
            const fetchMessage = async () => {
                    const req: GetKeyRequest = {
                        bucket: searchParams.get("buckets")
                    }
                    try {
                        const resp = await GetKeyFromBucket(req);
                        setColumn(columnMessage)        
                        setData(resp.keys)
                    } catch (e) {
                        console.log(e)
                    }
                }
            fetchMessage()
        }, [isLoading]);

    const handleEventCreateKey  =  async () => {
        const key = document.getElementById("key") as HTMLInputElement
        // add component select type storge
        const value = document.getElementById("value") as HTMLTextAreaElement
        try {
            const req : CreateKeyReq = {
                bucket_name: searchParams.get("buckets"),
                key : key.value,
                value : value.value,
            }
            const result = await CreateKey(req)
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
                                <Button variant="outline">
                                    Creat Key/Value
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid w-full gap-1.5">
                                        <Label htmlFor="key">
                                            Key
                                        </Label>
                                        <Input
                                            id="key"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid w-full gap-1.5">
                                        <Label htmlFor="value">Value</Label>
                                        <Textarea placeholder="Type your value here." id="value"/>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose>
                                        <Button type="button" onClick={handleEventCreateKey}>
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