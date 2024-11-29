import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { useMemo, useState } from "react";
import Overview from "./Overview";
import { ChartOverview } from "./ChartOverview";
import { RecentHabits } from "./RecentHabits";
import { useFetch } from "@/hooks/use-fetch";
import { toast } from "sonner";

const Analytics: React.FC = () => {
  const [selected, setSelected] = useState("weekly");
  const [data, setData] = useState<{
    [key: string]: { date: string; count: number }[];
  }>({});
  const [loading, setLoading] = useState(false);

  const fetchData = async (frequency: string) => {
    if (!data[frequency]) {
      setLoading(true);
      try {
        const response = await useFetch(
          `/analytics/user-habit-count/${frequency}`,
          "get"
        );
        if (response.status === 204) {
          toast.error("Please do something first.");
          return;
        }
        setData((prev) => ({
          ...prev,
          [frequency]: response.data.data,
        }));
      } catch (error) {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }
  };

  useMemo(() => {
    fetchData(selected);
  }, [selected]);

  const currentData = data[selected] || [];
  const skippedDays = currentData.filter((item) => item.count === 0).length;
  console.log("current data:", currentData);

  return (
    <div className="w-full flex-1 h-full lg:px-16 sm:px-5 px-5 mt-6 space-y-4 pb-8">
      <main>
        <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold mb-4 md:mb-0">
          Analytics
        </h1>
        <div className="w-full max-w-xl flex items-center justify-center gap-x-10 mx-auto mb-1">
          <Button variant="link" onClick={() => setSelected("weekly")}>
            <span
              className={`${
                selected === "weekly" ? "underline text-black" : "text-black/60"
              }`}
            >
              Weekly
            </span>
          </Button>
          <Button variant="link" onClick={() => setSelected("monthly")}>
            <span
              className={`${
                selected === "monthly"
                  ? "underline text-black"
                  : "text-black/60"
              }`}
            >
              Monthly
            </span>
          </Button>
        </div>
        <Separator className="bg-gray-500 opacity-25 mb-4" />
      </main>
      <Overview selected={selected} skippedDays={skippedDays} />
      <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap items-start justify-between gap-2 md:gap-5">
        <ChartOverview loading={loading} data={currentData} />
        <RecentHabits data={currentData} />
      </div>
    </div>
  );
};

export default Analytics;
