import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { useMemo, useState } from "react";
import Overview from "./Overview";
import { ChartOverview } from "./ChartOverview";
import { MonthlyHabits } from "./MonthlyHabit";
import { useFetch } from "@/hooks/use-fetch";
import WeeklyHabits from "./WeeklyHabits";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../Error";
import { useSearchParams } from "react-router-dom";

const Analytics: React.FC = () => {
  const [history, setHistory] = useSearchParams();
  const [selected, setSelected] = useState(
    history.get("frequency") || "weekly"
  );
  const [data, setData] = useState<{
    [key: string]: { date: string; count: number }[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    status: string;
  } | null>(null);

  const fetchData = async (frequency: string) => {
    if (!data[frequency]) {
      setLoading(true);
      try {
        const response = await useFetch(
          `/analytics/user-habit-count/${new Date().getFullYear()}/${
            new Date().getMonth() + 1
          }`,
          "get"
        );

        setData((prev) => ({
          ...prev,
          [frequency]: response.data.data,
        }));
      } catch (error: any) {
        console.log(error);
        setError({
          message: error.response?.data?.message ?? error.message,
          status: error.response?.status || error.status || error.code,
        });
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

  const handleChangeSelected = (frequency: string) => {
    setHistory({ frequency });
    setSelected(frequency);
  };

  if (error) {
    console.log(error);
    return <Error message={error.message} errorStatus={error.status} />;
  }

  return (
    <div className="w-full h-full min-h-dvh flex-1 bg-gradient-to-br from-[#2A3D43] to-[#40575C] lg:px-16">
      <div className="w-full p-12 flex-1 h-full px-5 space-y-4">
        <main>
          <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold mb-4 md:mb-0 tracking-wider text-lightYellow">
            Analytics
          </h1>
          <div className="w-full max-w-xl flex items-center justify-center gap-x-10 mx-auto mb-1">
            <Button
              variant="link"
              onClick={() => handleChangeSelected("weekly")}
            >
              <span
                className={`${
                  selected === "weekly"
                    ? "underline text-lightYellow font-semibold tracking-wide"
                    : "text-white"
                }`}
              >
                Weekly
              </span>
            </Button>
            <Button
              variant="link"
              onClick={() => handleChangeSelected("monthly")}
            >
              <span
                className={`${
                  selected === "monthly"
                    ? "underline text-lightYellow font-semibold tracking-wide"
                    : "text-white"
                }`}
              >
                Monthly
              </span>
            </Button>
          </div>
          <Separator className="bg-gray-500 opacity-25 mb-4" />
        </main>
        <Overview selected={selected} skippedDays={skippedDays} />
        <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap items-start justify-between gap-4">
          {loading ? (
            <Skeleton className=" w-full flex-1 h-96 bg-outerCard" />
          ) : selected === "monthly" ? (
            <MonthlyHabits />
          ) : (
            <WeeklyHabits />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
