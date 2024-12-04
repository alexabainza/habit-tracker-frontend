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
import { Habit } from "@/utils/types";
import { startOfWeek, endOfWeek, isThisWeek, isSameMonth, startOfToday } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DataType = {
    habit: string;
    day: Date[];
}

const WeeklyHabits = () => {
    const [loading, setLoading] = useState(false);
    const [habits, setHabits] = useState<DataType[]>([]);
    const [selectedDay, setSelectedDay] = useState<Date>(startOfToday());
    const currMonth = new Date().toLocaleString("default", { month: "long" });
    const startRange = startOfWeek(selectedDay);
    const endRange = endOfWeek(selectedDay);

    const fetchHabits = async () => {
        setLoading(true);
        try {
            const response = await useFetch(`/analytics/habit-days/${startOfWeek(selectedDay)}-${endOfWeek(selectedDay)}`, "get");
            const result = response.data;
            setHabits(result.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch habits.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchHabits();

        return () => {
            controller.abort();
        };
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
            const previousWeekStart = startOfWeek(new Date(newDate.setDate(newDate.getDate() - 7)));
            setSelectedDay(previousWeekStart);
        }
    };


    console.log(habits)

    return (
        <Card className="space-y-5 w-full flex-1 bg-outerCard border-none rounded-xl text-yellow-300 h-[425px] relative">
            <CardHeader className="pb-0">
                <CardTitle className="font-semibold flex items-center justify-between w-full max-w-sm mx-auto">
                    <Button
                        onClick={() => handleChangeWeek("prev")}
                        variant="outline"
                    >
                        <ChevronLeftIcon className="w-6 h-6 flex-shrink-0" />
                    </Button>
                    <span className="text-xl space-x-1.5">
                        {currMonth + " "}
                        {startRange.toLocaleDateString().split("/")[1] + " - "}
                        {endRange.toLocaleDateString().split("/")[1]}
                    </span>
                    <Button
                        onClick={() => handleChangeWeek("next")}
                        variant="outline"
                        disabled={isThisWeek(endOfWeek(selectedDay))}
                    >
                        <ChevronRightIcon className="w-6 h-6 flex-shrink-0" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="grid grid-cols-10 gap-2 mb-2">
                            <div className="col-span-3"></div>
                            {DaysInWeek.map((day, index) => (
                                <span
                                    key={`day-${index}`}
                                    className="text-center font-semibold text-sm text-yellow-300"
                                >
                                    {day}
                                </span>
                            ))}
                        </div>
                        <div className="grid grid-cols-10 gap-2">
                            {habits.map((habit) => (
                                <div key={`habit-${habit.habit}`} className="col-span-10 grid grid-cols-10 gap-2 items-center">
                                    <div className="col-span-3 truncate font-medium text-sm overflow-ellipsis overflow-hidden max-w-32">
                                        {habit.habit}
                                    </div>
                                    {DaysInWeek.map((day, index) => {
                                        const dateForDay = new Date(selectedDay);
                                        dateForDay.setDate(startOfWeek(selectedDay).getDate() + (index + 1));
                                        const isActive = habit.day.map(d => new Date(d).toISOString().split("T")[0]).includes(dateForDay.toISOString().split("T")[0]);
                                        return (
                                            <div
                                                key={`habit-${habit.habit}-day-${index}`}
                                                className={`col-span-1 row-span-1 h-10 flex items-center justify-center rounded-md ${isActive ? "bg-green-500" : "bg-gray-200"
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
    );
};

export default WeeklyHabits;
