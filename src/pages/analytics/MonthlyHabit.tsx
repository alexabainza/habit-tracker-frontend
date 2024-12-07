import { Calendar } from "@/components/ui/calendar";
import { useFetch } from "@/hooks/use-fetch";
import { MonthlyHabitsProps } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { ChartOverview } from "./ChartOverview";
import Overview from "./Overview";

export function MonthlyHabits() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [habitData, setHabitData] = useState<MonthlyHabitsProps["data"]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await useFetch(
        `/analytics/user-habit-count/${selectedYear}/${selectedMonth}`,
        "get"
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch habit data");
      }
      setHabitData(response.data.data);
      console.log(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);
  const skippedDays = habitData.filter((item) => item.count === 0).length;
  console.log("monthly skipped days", skippedDays);

  const modifiers = useMemo(() => {
    const highActivity: Date[] = [];
    const mediumActivity: Date[] = [];
    const lowActivity: Date[] = [];

    habitData.forEach((item) => {
      const activityDate = new Date(item.date);
      if (item.count >= 5) {
        highActivity.push(activityDate);
      } else if (item.count >= 3) {
        mediumActivity.push(activityDate);
      } else if (item.count >= 1) {
        lowActivity.push(activityDate);
      }
    });

    return {
      highActivity,
      mediumActivity,
      lowActivity,
    };
  }, [habitData]);

  const handleMonthChange = (newMonth: Date) => {
    setSelectedMonth(newMonth.getMonth() + 1);
    setSelectedYear(newMonth.getFullYear());
  };

  const data = habitData.map((item) => ({
    date: item.date,
    count: item.count,
  }));

  return (
    <div className="space-y-6 w-full flex flex-col relative gap-4">
      <Overview selected="monthly" skippedDays={skippedDays} />
      <div className="flex gap-4">
        <div className="w-3/5">
          <ChartOverview view="monthly" loading={loading} data={data} />
        </div>
        <Calendar
          mode="single"
          className="text-white text-3xl bg-outerCard rounded-xl"
          modifiers={modifiers}
          onMonthChange={handleMonthChange}
          modifiersClassNames={{
            highActivity: "bg-green-600 text-outerCard hover:bg-green-600/80",
            mediumActivity:
              "bg-green-400 text-outerCard  hover:bg-green-400/80",
            lowActivity: "bg-green-200 text-outerCard hover:bg-green-200/80",
          }}
        />
      </div>
    </div>
  );
}
