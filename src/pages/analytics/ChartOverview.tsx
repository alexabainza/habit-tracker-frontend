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

const chartData = [
    { month: "January", desktop: 18680 },
    { month: "February", desktop: 305200 },
    { month: "March", desktop: 237120 },
    { month: "April", desktop: 73190 },
    { month: "May", desktop: 209130 },
    { month: "June", desktop: 214140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
} satisfies ChartConfig

export function ChartOverview() {
    return (
        <Card className="w-full min-h-80">
            <CardTitle className="p-5">Overview</CardTitle>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-60 w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
