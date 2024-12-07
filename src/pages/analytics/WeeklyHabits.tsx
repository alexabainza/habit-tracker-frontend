import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { useFetch } from "@/hooks/use-fetch";
import { DaysInWeek } from "@/utils/constants";
import {
  startOfWeek,
  endOfWeek,
  isThisWeek,
  startOfToday,
  format,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GiDeadWood } from "react-icons/gi";
import { ChartOverview } from "./ChartOverview";
import { formatDate } from "@/utils/dateFormatter";

type DataType = {
  habit: string;
  day: Date[];
};

type Data = {
  date: string;
  count: number;
};

const WeeklyHabits = () => {
  const [loading, setLoading] = useState(false);
  const [habits, setHabits] = useState<DataType[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(startOfToday());
  const [error, setError] = useState<string | null>(null);
  const [userHabitCount, setUserHabitCount] = useState<Data[]>([]);

  const startRange = startOfWeek(selectedDay, { weekStartsOn: 0 });
  const endRange = endOfWeek(selectedDay);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const response = await useFetch(
        `/analytics/habit-days/${startOfWeek(selectedDay, { weekStartsOn: 1 })}-${endOfWeek(
          selectedDay, { weekStartsOn: 1 }
        )}`,
        "get"
      );
      const result = response.data;
      setHabits(result.data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHabitCount = async () => {
    try {
      const response = await useFetch(
        `/analytics/user-habit-count/${startOfWeek(
          selectedDay, { weekStartsOn: 1 }
        ).toISOString()}_${endOfWeek(selectedDay, { weekStartsOn: 1 }).toISOString()}`,
        "get"
      );
      const result = response.data;

      if (result.data && result.data.length > 0) {
        setUserHabitCount(result.data);
      } else {
        setUserHabitCount([]);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchHabits(), fetchUserHabitCount()]);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDay]);

  const handleChangeWeek = (direction: "next" | "prev") => {
    const newDate = new Date(selectedDay);
    if (direction === "next") {
      if (endOfWeek(newDate) >= endOfWeek(new Date())) {
        toast.info("Cannot view future weeks.");
        return;
      }
      setSelectedDay(new Date(newDate.setDate(newDate.getDate() + 7)));
    } else {
      const previousWeekStart = startOfWeek(
        new Date(newDate.setDate(newDate.getDate() - 7)),
        { weekStartsOn: 1 }
      );
      setSelectedDay(previousWeekStart);
    }
  };

  if (error) {
    return null;
  }

  return (
    <>
      <ChartOverview
        data={userHabitCount}
        view="weekly"
        loading={loading}
        weeklyDateRange={`${formatDate(startRange)} - ${formatDate(endRange)}`}
      />
      <Card className="w-full md:min-w-96 flex-[0.4] border-none rounded-xl text-yellow-300 min-h-96 sm:min-h-96 lg:min-h-96 relative flex flex-col items-center gap-5">
        <CardHeader className="p-0 w-full">
          <CardTitle className="font-semibold flex items-center justify-center w-full mx-auto gap-4 p-5 border-b border-b-lightYellow border-opacity-40">
            <button onClick={() => handleChangeWeek("prev")} type="button" className="disabled:opacity-50">
              <ChevronLeftIcon className="w-7 h-7 flex-shrink-0" />
              <p className="sr-only">Prev</p>
            </button>
            <span className="text-lg space-x-1.5">
              {format(startRange, "LLLL") + " "}
              {startRange.toLocaleDateString().split("/")[1].padStart(2, "0") + " - "}
              {format(startRange, "LLLL") + " " + endRange.toLocaleDateString().split("/")[1].padStart(2, "0")}
            </span>
            <button
              onClick={() => handleChangeWeek("next")} type="button"
              disabled={isThisWeek(endOfWeek(selectedDay))}
              className="disabled:opacity-50"
            >
              <ChevronRightIcon className="w-7 h-7 flex-shrink-0" />
              <p className="sr-only">Next</p>
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          {loading ? (
            <Loading className="mt-5" />
          ) : habits.length === 0 ? (
            <CardDescription className="space-y-5 text-center text-lg absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <GiDeadWood className="w-40 h-40 mx-auto" />
              <h3>
                Seems barren here. <br />
                <strong>Start being productive!</strong>
              </h3>
            </CardDescription>
          ) : (
            <>
              <div className="grid grid-cols-11 gap-2 mb-2">
                <div className="col-start-2 col-span-3"></div>
                {DaysInWeek.map((day, index) => (
                  <span
                    key={`day-${index}`}
                    className="text-center font-semibold text-sm text-yellow-300"
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-11 gap-2">
                {habits.map((habit) => (
                  <div
                    key={`habit-${habit.habit}`}
                    className="col-span-11 grid grid-cols-11 gap-2 items-center"
                  >
                    <div className="col-span-4 truncate font-medium text-sm overflow-ellipsis overflow-hidden max-w-40">
                      {habit.habit}
                    </div>
                    {DaysInWeek.map((day, index) => {
                      const dateForDay = new Date(selectedDay);
                      dateForDay.setDate(
                        startOfWeek(selectedDay, { weekStartsOn: 0 }).getDate() + (index + 1)
                      );
                      const isActive = habit.day
                        .map((d) => new Date(d).toISOString().split("T")[0])
                        .includes(dateForDay.toISOString().split("T")[0]);
                      return (
                        <div
                          key={`habit-${habit.habit}-day-${index}`}
                          className={`col-span-1 row-span-1 h-6 sm:h-8 lg:h-6 flex items-center justify-center rounded-md ${isActive ? "bg-green-500" : "bg-gray-200"
                            }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default WeeklyHabits;
