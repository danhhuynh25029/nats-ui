import { AppSidebar } from "@/components/AppSideBar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import React, {useState} from "react";
import {DataTable} from "@/components/DataTable.tsx";


export interface BreadcrumbItem {
    label: string;
    path: string;
}


export default function Home() {
    const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>([]);

    const handleItemClick = (item: string) => {
        console.log(item)
        const newBreadCrumbItems = ["JetStream",item]
        setBreadcrumbItems(newBreadCrumbItems);
    };
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "19rem",
                } as React.CSSProperties
            }
         >
            <AppSidebar onItemClicked={handleItemClick} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        {/* <BreadcrumbList>
                            {  breadcrumbItems.length > 0 ?
                             breadcrumbItems.map((item, index, array) =>(
                                <><BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/table" key={item}>
                                        {item}
                                    </BreadcrumbLink>
                                  </BreadcrumbItem>
                                    {index != array.length - 1 ? <BreadcrumbSeparator className="hidden md:block"/> : null}
                                 </>
                                )
                            ) : null
                            }
                        </BreadcrumbList> */}
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="container mx-auto py-10">
                        <DataTable breadItems={breadcrumbItems}  />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
