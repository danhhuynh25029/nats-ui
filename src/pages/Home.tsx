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
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable.tsx";


export interface BreadcrumbItem {
    label: string;
    path: string;
}


export default function Home() {

    const [activeItem, setActiveItem] = useState({
        title: "Welcome",
        content: "Select an item from the sidebar to view its content.",
    })

    const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>([]);

    const handleItemClick = (item: string) => {
        const newBreadCrumbItems =  [item]
        setBreadcrumbItems(newBreadCrumbItems);
    };
    return (
        <>
            {/* <AppSidebar onItemClicked={handleItemClick} /> */}
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
                                <BreadcrumbPage>{breadcrumbItems[0]}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
            </SidebarInset>
            </>
    )   
}
