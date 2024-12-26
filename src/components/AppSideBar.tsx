import * as React from "react"
import { GalleryVerticalEnd, MoreHorizontal } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { title } from "process"
import { url } from "inspector"


const data = {
    navDashBoard: [
        {
            title: "Dashboard",
            url: "#"
        },
    ],
    navMain: [

        {
            title: "JetStream",
            url: "#",
            items: [
                {
                    title: "Streams",
                    url: "/streams",
                    isActive: false,
                },
                {
                    title: "Buckets",
                    url: "/buckets",
                    isActive: false,
                },
            ],
        },
        {
            title: "Community",
            url: "#",
            items: [
                {
                    title: "Contribution Guide",
                    url: "#",
                    isActive: false
                },
            ],
        },
    ],
}


interface SidebarProps {
    onItemClicked: (item: string) => void;
}

export const AppSidebar: React.FC<SidebarProps> = ({ onItemClicked }) => {
    // export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [menuData, setMenuData] = React.useState(data);
    const handleEvent = (item: { title: string; url: string; isActive: boolean } | { title: string; url: string; isActive?: undefined }) => {
        onItemClicked(item.title)
        const updatedMenuData = {
            ...menuData,
            navMain: menuData.navMain.map((menuItem) => ({
                ...menuItem,
                items: menuItem.items.map((i) => (i.title === item.title ? { ...i, isActive: true } : { ...i, isActive: false })),
            })),
        };
        setMenuData(updatedMenuData)
    }

    return (
        <Sidebar variant="floating" >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                {/*Change to icon nats-ui*/}
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Nats-UI</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>

                <SidebarGroup>
                    <SidebarGroupLabel className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <span>Dashboard</span>
                    </SidebarGroupLabel>
                </SidebarGroup>

                {menuData.navMain.map((item) => (
                    <Collapsible
                        key={item.title}
                        title={item.title}
                        defaultOpen
                        className="group/collapsible"
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel
                                asChild
                                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <CollapsibleTrigger>
                                    {item.title}{" "}
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {item.items.map((item) => (
                                            <SidebarMenuItem key={item.title} onClick={() => handleEvent(item)}>
                                                <SidebarMenuButton asChild isActive={item.isActive}>
                                                    <a href={item.url}>{item.title}</a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>
        </Sidebar>
    )
}
