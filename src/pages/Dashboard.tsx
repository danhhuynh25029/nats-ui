"use client"


import {
    ChartConfig,
} from "@/components/ui/chart"
import {SidebarInset, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {useEffect, useState} from "react";
import {GetMessageFormJetStream, GetMessageFromJetStreamReq, GetStreamFromJetStream} from "@/services/jetstream.ts";
import {any} from "zod";


export default function DashBoard() {
    const [chartData,setChartData] = useState<unknown[]>([])
    const [chartConfig,setChartConfig] = useState<ChartConfig>(any)
    useEffect( () => {
        const fetchData = async () => {
            try {
                const resp = await GetStreamFromJetStream();
                console.log(resp)
                const newConfig = {
                    message: {
                        label: "message",
                    },
                }
                const newChartData = [];
                for (const item of resp) {
                    newConfig[item.name] = {
                        label: item.name,
                        color: `hsl(var(--chart-${resp.indexOf(item) + 1}))` // Generate unique colors
                    };
                    const req: GetMessageFromJetStreamReq = {
                        stream_name: item.name
                    }
                    const respMessage = await GetMessageFormJetStream(req);
                    newChartData.push({
                        browser: item.name,
                        message: respMessage.total,
                        fill: `var(--color-${item.name})`
                    })
                }
                console.log(newConfig)
                console.log(newChartData)
                setChartConfig(newConfig)
                setChartData(newChartData)
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    },[])
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
                    <div className="container mx-auto py-5">
                    </div>
                </div>
                </SidebarInset>
            </>
    )
}
