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
import { GiDesert } from "react-icons/gi";

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
  const dateRange = `${new Date(data[0]?.date).toDateString()} to ${new Date(
    data[data.length - 1]?.date
  ).toDateString()}`;

  return (
    <Card className="w-full min-h-[450px] max-h-[450px] flex-[0.6] bg-outerCard border-2 relative px-5">
      {loading ? (
        <Loading />
      ) : !loading && data.length === 0 ? (
        <div className="text-xl text-center text-yellow-300 absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 space-y-5">
          <GiDesert className="w-40 h-40 mx-auto" />
          <h3>
            <strong>No data available</strong> for the selected date range.
          </h3>
        </div>
      ) : view === "monthly" ? (
        <>
          <CardTitle className="p-5 text-xl text-lightYellow">
            <span>
              Overview from
              <strong className="ml-2">{dateRange}</strong>
            </span>
          </CardTitle>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-60 w-full text-white text-md -mt-20"
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
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey="date"
                  axisLine={{ stroke: "white" }}
                  tick={{
                    fontSize: 12,
                    stroke: "white",
                    fontWeight: "semibold",
                  }}
                  tickLine={{ stroke: "#FBEF95" }}
                  tickMargin={12}
                  tickFormatter={(value) => value.split("-")[2]}
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
        </>
      ) : (
        <>
          <CardTitle className="p-5 text-xl text-lightYellow">
            <span>
              Overview from
              <strong className="ml-2">{weeklyDateRange}</strong>
            </span>
          </CardTitle>
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
                tickFormatter={(value) => value.split("-")[2]}
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
        </>
      )}
    </Card>
  );
}
