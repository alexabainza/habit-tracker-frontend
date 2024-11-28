import { Calendar } from "@/components/ui/calendar";
import { RecentHabitsProps } from "@/utils/types";
import { useMemo } from "react";

export function RecentHabits({ data }: RecentHabitsProps) {
  // const [date, setDate] = useState<Date | undefined>(new Date());

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

  console.log(modifiers);

  return (
    <div className="space-y-6 h-64 w-full p-4">
      <Calendar
        mode="single"
        className="border-2 rounded-xl"
        modifiers={modifiers}
        modifiersClassNames={{
          highActivity: "bg-green-500",
          mediumActivity: "bg-green-400",
          lowActivity: "bg-green-300",
        }}
      />
    </div>
  );
}
