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
import { GiDeadWood } from "react-icons/gi";
import { ChartOverview } from "./ChartOverview";
import { formatDate } from "@/utils/dateFormatter";
import Overview from "./Overview";
import Error from "../Error";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

type DataType = {
  habit: string;
  day: Date[];
};

type Data = {
  date: string;
  count: number;
};

const WeeklyHabits = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState({
    habits: false,
    userHabitCount: false,
  });
  const [habits, setHabits] = useState<DataType[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(startOfToday());
  const [error, setError] = useState<string | null>(null);
  const [userHabitCount, setUserHabitCount] = useState<Data[]>([]);
  const [page, setPage] = useState(searchParams.get("page") ? parseInt(searchParams.get("page") || "1") : 1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;

  const startRange = startOfWeek(selectedDay, { weekStartsOn: 0 });
  const endRange = endOfWeek(selectedDay, { weekStartsOn: 0 });
  const skippedDays = userHabitCount.filter((item) => item.count === 0).length;

  const fetchHabits = async () => {
    setLoading((prevState) => ({ ...prevState, habits: true }));
    try {
      const response = await useFetch(
        `/analytics/habit-days/${startRange}-${endRange}?page=${page}&limit=${limit}`,
        "get"
      );
      const result = response.data.data;

      setHabits(result.data || []);
      setTotalPages(result.totalPages);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading((prevState) => ({ ...prevState, habits: false }));
    }
  };


  const fetchUserHabitCount = async () => {
    try {
      const response = await useFetch(
        `/analytics/user-habit-count/${startOfWeek(startRange).toISOString()}_${endRange.toISOString()}`,
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
      setLoading((prevState) => ({ ...prevState, userHabitCount: true }));
      try {
        await Promise.all([fetchHabits(), fetchUserHabitCount()]);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading((prevState) => ({ ...prevState, userHabitCount: false }));
      }
    };

    fetchData();
  }, [selectedDay]);

  useEffect(() => {
    setSearchParams({ page: page.toString() });
    fetchHabits();
  }, [page]);

  const handleChangeWeek = (direction: "next" | "prev") => {
    const newDate = new Date(selectedDay);
    if (direction === "next") {
      setSelectedDay(new Date(newDate.setDate(newDate.getDate() + 7)));
    } else {
      const previousWeekStart = startOfWeek(
        new Date(newDate.setDate(newDate.getDate() - 7)),
        { weekStartsOn: 0 }
      );
      setSelectedDay(previousWeekStart);
    }
  };

  if (error) {
    return <Error message={error} errorStatus="500" />;
  }

  console.log(habits)
  return (
    <div className="space-y-4 w-full flex flex-col gap-1">
      <Overview selected="weekly" skippedDays={skippedDays} />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full md:max-w-2xl lg:max-w-3xl md:mx-auto lg:m-0">
          <ChartOverview
            data={userHabitCount}
            view="weekly"
            loading={loading.userHabitCount}
            weeklyDateRange={`${formatDate(startRange)} - ${formatDate(
              endRange
            )}`}
          />
        </div>
        <Card className="w-full md:min-w-96 md:max-w-2xl lg:max-w-xl mx-auto lg:mr-0 border-none rounded-xl text-yellow-300 min-h-96 sm:min-h-96 lg:min-h-96 relative flex flex-col items-center gap-5 shadow-none">
          <CardHeader className="p-0 w-full">
            <CardTitle className="font-semibold flex items-center justify-center w-full mx-auto gap-4 pb-2 border-b border-b-lightYellow border-opacity-40">
              <button
                onClick={() => handleChangeWeek("prev")}
                type="button"
                className="disabled:opacity-50"
              >
                <ChevronLeftIcon className="w-7 h-7 flex-shrink-0" />
                <p className="sr-only">Prev</p>
              </button>
              <span className="text-lg space-x-1.5">
                {format(startRange, "LLLL") + " "}
                {startRange
                  .toLocaleDateString()
                  .split("/")[1]
                  .padStart(2, "0") + " - "}
                {format(startRange, "LLLL") +
                  " " +
                  endRange.toLocaleDateString().split("/")[1].padStart(2, "0")}
              </span>
              <button
                onClick={() => handleChangeWeek("next")}
                type="button"
                disabled={isThisWeek(endRange)}
                className="disabled:opacity-50"
              >
                <ChevronRightIcon className="w-7 h-7 flex-shrink-0" />
                <p className="sr-only">Next</p>
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            {loading.habits ? (
              <Loading className="mt-5" />
            ) : habits.length === 0 || userHabitCount.length === 0 ? (
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
                          startOfWeek(selectedDay, {
                            weekStartsOn: 0,
                          }).getDate() +
                          (index + 1)
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
                <div className="w-full flex justify-center gap-4 items-center mt-5">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    className="col-span-1"
                  >
                    <ChevronLeftIcon className="flex-shrink-0 w-5 h-5" />
                  </Button>
                  <span className="col-span-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    disabled={page === totalPages}
                    onClick={() => setPage(Math.min(page + 1, totalPages))}
                  >
                    <ChevronRightIcon className="flex-shrink-0 w-5 h-5" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyHabits;
