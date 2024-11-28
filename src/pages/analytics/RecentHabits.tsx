import { Calendar } from "@/components/ui/calendar";
import { RecentHabitsProps } from "@/utils/types";
import { useMemo, useState } from "react";

export function RecentHabits({ data }: RecentHabitsProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  return (
    <div className="w-full h-64 md:h-80 rounded-md border p-5 my-0 flex-[0.5]">
      <div className="space-y-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border transition-all duration-300"
          modifiers={modifiers}
          modifiersClassNames={{
            highActivity: "bg-green-600 hover:bg-green-600/80",
            mediumActivity: "bg-green-400 hover:bg-green-400/80",
            lowActivity: "bg-green-200 hover:bg-green-200/80",
          }}
        />
      </div>
    </div>
  );
}
