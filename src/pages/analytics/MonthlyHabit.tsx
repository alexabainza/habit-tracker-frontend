import { Calendar } from "@/components/ui/calendar";
import { MonthlyHabitsProps } from "@/utils/types";
import { useMemo } from "react";

export function MonthlyHabits({
  data,
  onMonthYearChange,
}: MonthlyHabitsProps & {
  onMonthYearChange?: (month: number, year: number) => void;
}) {
  const modifiers = useMemo(() => {
    const highActivity: Date[] = [];
    const mediumActivity: Date[] = [];
    const lowActivity: Date[] = [];

    data.forEach((item) => {
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
  }, [data]);
  const handleMonthChange = (newMonth: Date) => {
    const month = newMonth.getMonth() + 1;
    const year = newMonth.getFullYear();
    console.log(`Month: ${month}, Year: ${year}`);

    onMonthYearChange?.(month, year);
  };
  return (
    <div className="space-y-6 w-full flex-[0.5] bg-outerCard border-none rounded-xl relative">
      <Calendar
        mode="single"
        className="p-6 text-white text-3xl h-[500px] md:h-[600px]"
        modifiers={modifiers}
        onMonthChange={handleMonthChange}
        modifiersClassNames={{
          highActivity: "bg-green-600 text-outerCard hover:bg-green-600/80",
          mediumActivity: "bg-green-400 text-outerCard  hover:bg-green-400/80",
          lowActivity: "bg-green-200 text-outerCard hover:bg-green-200/80",
        }}
      />
    </div>
  );
}
