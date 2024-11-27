import { Calendar } from "@/components/ui/calendar";
import { RecentHabitsProps } from "@/utils/types";
import React from "react";

export function RecentHabits({ data }: RecentHabitsProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const modifiers = React.useMemo(() => {
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

  return (
    <div className="w-full h-64 md:h-80 rounded-md border p-5 my-0">
      <div className="space-y-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={modifiers}
          modifiersClassNames={{
            highActivity: "bg-green-500 no-hover",
            mediumActivity: "bg-green-300 no-hover",
            lowActivity: "bg-green-100 no-hover",
          }}
        />
      </div>
    </div>
  );
}
