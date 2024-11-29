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
    <div className="space-y-6 h-64 w-full flex-[0.5]">
      <Calendar
        mode="single"
        className="border rounded-xl p-6"
        modifiers={modifiers}
        modifiersClassNames={{
          highActivity: "bg-green-600 hover:bg-green-600/80",
          mediumActivity: "bg-green-400 hover:bg-green-400/80",
          lowActivity: "bg-green-200 hover:bg-green-200/80",
        }}
      />
    </div>
  );
}
