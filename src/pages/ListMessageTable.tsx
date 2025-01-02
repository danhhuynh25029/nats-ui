import { DataTable } from "@/components/DataTable"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
    GetMessageFromJetStreamReq,
    GetMessageFormJetStream,
    PublishMessageReq,
    PublishMessage,
    Message
} from "@/services/jetstream"
import { Separator } from "@radix-ui/react-separator"
import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { useSearchParams } from "react-router-dom"
import {
    Dialog,
    DialogClose,
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

const columnMessage: ColumnDef<Message>[] = [
    {
        accessorKey: "sequence",
        header: "Sequence",
    },
    {
        accessorKey: "data",
        header: "Data",
    },
    {
        accessorKey: "subject",
        header: "Subject",
    },
    {
        accessorKey: "received",
        header: "Received",
    },

]

export const ListMessageTable = () => {
    const [data, setData] = React.useState<Message[]>([])
    const [columns, setColumn] = React.useState<ColumnDef<Message>[]>([])
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = React.useState(false)
    React.useEffect(() => {
            const fetchMessage = async () => {
                    const req: GetMessageFromJetStreamReq = {
                        stream_name: searchParams.get("event")
                    }
                    try {
                        const resp = await GetMessageFormJetStream(req);
                        setColumn(columnMessage)
                        setData(resp.messages)
                    } catch (e) {
                        console.log(e)
                    }
                }
            fetchMessage()
        }, [isLoading]);

    const handleEventPublishMessage  =  async () => {
        const textarea = document.getElementById('message') as HTMLTextAreaElement
        console.log(textarea.value)
        const input = document.getElementById("subject") as HTMLInputElement
        console.log(input.value)

        try {
            const req : PublishMessageReq = {
                Subject : input.value,
                Message : textarea.value
            }
            const result = await PublishMessage(req)
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
                            <Button variant="outline" >Publish Message</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Publish Message</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="subject" >
                                        Subject
                                    </Label>
                                    <Input
                                        id="subject"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="message">Your message</Label>
                                    <Textarea placeholder="Type your message here." id="message"/>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose>
                                    <Button type="button" onClick={handleEventPublishMessage}>
                                        Publish
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    </div>

                    <DataTable breadItems={["Stream"]} data={data} columns={columns} />
                </div>
            </div>
        </SidebarInset>
    </>
    )
}