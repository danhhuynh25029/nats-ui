import { DataTable } from "@/components/DataTable"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Key, GetKeyRequest, GetKeyFromBucket } from "@/services/jetstream"
import { Separator } from "@radix-ui/react-separator"
import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { useSearchParams } from "react-router-dom"

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
                            <BreadcrumbPage>Stream</BreadcrumbPage>
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