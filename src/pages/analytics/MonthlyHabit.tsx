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
    <div className="space-y-5 w-full flex flex-col relative gap-2 min-h-dvh overflow-x-hidden md:max-w-2xl lg:max-w-none md:mx-auto lg:m-0">
      <Overview selected="monthly" skippedDays={skippedDays} />
      <div className="flex lg:flex-row md:flex-col sm:flex-col flex-col gap-4 md:gap-6">
        <div className="w-full lg:max-w-xl xl:max-w-3xl flex-1">
          <ChartOverview view="monthly" loading={loading} data={data} className="max-h-[550px]"/>
        </div>
        <Calendar
          mode="single"
          className="text-white text-3xl bg-outerCard rounded-xl flex flex-1 justify-center border-2 border-black py-5 max-h-[550px] w-full lg:max-w-lg px-5 pl-0"
          modifiers={modifiers}
          onMonthChange={handleMonthChange}
          modifiersClassNames={{
            highActivity:
              "bg-green-600 rounded-full text-outerCard hover:bg-green-600/80",
            mediumActivity:
              "bg-green-400 rounded-full text-outerCard  hover:bg-green-400/80",
            lowActivity:
              "bg-green-200 rounded-full text-outerCard hover:bg-green-200/80",
          }}
          classNames={{
            months: "lg:p-4 sm:p-2 p-2 rounded-xl w-full",
            table: "mt-8 w-full",
            caption_label:
              "lg:text-xl sm:text-lg text-lg font-medium text-lightYellow",
            day: "lg:h-12 md:h-14 sm:h-16 h-10 lg:w-12 md:w-14 sm:w-16 w-10 text-center",
            cell: "lg:text-lg sm:text-sm text-sm lg:w-4 md:w-16 sm:w-10 w-10 text-center mx-auto",
            head_cell: "text-center text-sm lg:w-12 md:w-14 sm:w-10 w-10 mt-4 w-full mx-auto",
            nav_button: "hover:opacity-60 rounded-full text-lightYellow",
          }}
        />
      </div>
    </div>
  );
}
