"use client";

import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  count: {
    label: "Habits Accomplished",
    color: "#2563eb",
  },
} satisfies ChartConfig;

type Data = {
  date: string;
  count: number;
};

type ChartOverviewProps = {
  loading: boolean;
  data: Data[];
  view: "weekly" | "monthly";
  weeklyDateRange?: string;
};

export function ChartOverview({
  loading,
  data,
  view,
  weeklyDateRange,
}: ChartOverviewProps) {
  // Derive date range for monthly view
  const dateRange = data.length
    ? `${new Date(data[0]?.date).toDateString()} to ${new Date(
        data[data.length - 1]?.date
      ).toDateString()}`
    : null;

  if (loading) {
    return <Skeleton className="w-full min-h-[450px] flex-1 bg-innermostCard rounded-xl" />;
  }

  return (
    <Card className="w-full min-h-80 max-h-[450px] md:min-h-80 flex-[0.6] bg-outerCard border-2 relative flex flex-col">
      <CardTitle className="p-5 pb-1 text-xl text-lightYellow">
        {view === "monthly" ? (
          <span>
            Overview from
            <strong className="ml-2">{dateRange}</strong>
          </span>
        ) : (
          <span>
            Overview from
            <strong className="ml-2">{weeklyDateRange}</strong>
          </span>
        )}
      </CardTitle>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-60 w-full text-white text-md"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={view === "monthly"} />
            <XAxis
              dataKey="date"
              axisLine={{ stroke: "white" }}
              tick={{ fontSize: 12, stroke: "white", fontWeight: "semibold" }}
              tickLine={{ stroke: "#FBEF95" }}
              tickMargin={12}
              tickFormatter={(value) => value.split("-")[2]} // Assuming ISO date format
              interval="preserveStartEnd"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="gap-2 bg-white text-black"
                  indicator="line"
                />
              }
            />
            <ChartLegend
              stroke="white"
              content={<ChartLegendContent style={{ color: "white" }} />}
            />
            <Line dataKey="count" stroke="#FBEF95" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}