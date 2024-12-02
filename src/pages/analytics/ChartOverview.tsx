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
import Loading from "@/components/ui/loading";

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
};

export function ChartOverview({ loading, data }: ChartOverviewProps) {
  const dateRange = `${new Date(data[0]?.date).toDateString()} to ${new Date(data[data.length - 1]?.date).toDateString()}`;
  return (
    <Card className="w-full min-h-80 md:min-h-32 flex-[0.8] bg-outerCard border-none">
      <CardTitle className="p-5 text-xl text-lightYellow">
        {loading ? (
          <span className="animate-pulse">Fetching...</span>
        ) : (
          <span>
            Overview from
            <strong className="ml-2">{dateRange}</strong>
          </span>
        )}
      </CardTitle>
      <CardContent>
        {loading ? (
          <Loading />
        ) : (
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
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={{ stroke: "white" }}
                tick={{ fontSize: 12, stroke: "white", fontWeight: "semibold" }}
                tickLine={{ stroke: "#FBEF95" }}
                tickMargin={12}
                tickFormatter={(value) =>
                  value.split("-")[2]
                }
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
              <Line
                dataKey="count"
                stroke="#FBEF95"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
