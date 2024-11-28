"use client"

import { Line, LineChart, CartesianGrid, XAxis } from "recharts"

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
                        <LineChart accessibilityLayer data={data} margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                        }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickMargin={12}
                                tickFormatter={(value) => value.split("-")[1] + "/" + value.split("-")[2]}
                            />
                            <ChartTooltip content={<ChartTooltipContent className="gap-2 bg-white" indicator="line"/>} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
