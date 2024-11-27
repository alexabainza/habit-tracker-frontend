"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import Loading from "@/components/ui/loading"

const chartConfig = {
    count: {
        label: "Habits Accomplished",
        color: "#2563eb",
    },
} satisfies ChartConfig

type Data = {
    date: string,
    count: number,
}

type ChartOverviewProps = {
    loading: boolean,
    data: Data[],
}

export function ChartOverview({ loading, data }: ChartOverviewProps) {
    return (
        <Card className="w-full min-h-80">
            <CardTitle className="p-5">Overview</CardTitle>
            <CardContent>
                {loading ? (
                    <Loading />
                ) : (
                    <ChartContainer config={chartConfig} className="min-h-60 w-full">
                        <BarChart accessibilityLayer data={data}>
                            <CartesianGrid vertical={false} className="hover:bg-white" />
                            <XAxis
                                dataKey="date"
                                tickMargin={10}
                                tickFormatter={(value) => value.split("-")[1] + "/" + value.split("-")[2]}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="gap-2 bg-white" />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
