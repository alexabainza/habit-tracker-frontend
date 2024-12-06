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
import { startOfWeek, endOfWeek, isThisWeek, startOfToday, format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GiDeadWood } from "react-icons/gi";

type DataType = {
    habit: string;
    day: Date[];
}

const WeeklyHabits = () => {
    const [loading, setLoading] = useState(false);
    const [habits, setHabits] = useState<DataType[]>([]);
    const [selectedDay, setSelectedDay] = useState<Date>(startOfToday());
    const [error, setError] = useState<string | null>(null);

    const startRange = startOfWeek(selectedDay);
    const endRange = endOfWeek(selectedDay);
    const cacheKey = `habits-${startRange.toISOString()}-${endRange.toISOString()}`;

    const fetchHabits = async () => {
        setLoading(true);
        try {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                setHabits(JSON.parse(cachedData));
            } else {
                const response = await useFetch(`/analytics/habit-days/${startOfWeek(selectedDay)}-${endOfWeek(selectedDay)}`, "get");
                const result = response.data;
                setHabits(result.data || []);
                localStorage.setItem(cacheKey, JSON.stringify(result.data || []));
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
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

    if (error) {
        return null;
    };

    return (
        <Card className="w-full mx-auto md:min-w-96 lg:max-w-xl flex-1 bg-outerCard border-none rounded-xl text-yellow-300 min-h-96 sm:min-h-96 lg:min-h-96 relative flex flex-col items-center gap-5">
            <CardHeader className="pb-0 w-full">
                <CardTitle className="font-semibold flex items-center justify-between w-full mx-auto gap-4">
                    <Button
                        onClick={() => handleChangeWeek("prev")}
                        variant="outline"
                    >
                        <ChevronLeftIcon className="w-6 h-6 flex-shrink-0" />
                    </Button>
                    <span className="text-lg space-x-1.5">
                        {format(startRange, "LLLL") + " "}
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
            <CardContent className="w-full">
                {loading ? (
                    <Loading className="mt-5" />
                ) : habits.length === 0 ? (
                    <CardDescription className="space-y-5 text-center text-lg absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <GiDeadWood className="w-40 h-40 mx-auto" />
                        <h3>Seems barren here. <br /><strong>Start being productive!</strong></h3>
                    </CardDescription>
                ) : (
                    (
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
                                    <div key={`habit-${habit.habit}`} className="col-span-11 grid grid-cols-11 gap-2 items-center">
                                        <div className="col-span-4 truncate font-medium text-sm overflow-ellipsis overflow-hidden max-w-40">
                                            {habit.habit}
                                        </div>
                                        {DaysInWeek.map((day, index) => {
                                            const dateForDay = new Date(selectedDay);
                                            dateForDay.setDate(startOfWeek(selectedDay).getDate() + (index + 1));
                                            const isActive = habit.day.map(d => new Date(d).toISOString().split("T")[0]).includes(dateForDay.toISOString().split("T")[0]);
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
                    )
                )}
            </CardContent>
        </Card>
    );
};

export default WeeklyHabits;
