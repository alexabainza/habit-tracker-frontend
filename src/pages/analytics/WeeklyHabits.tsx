import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { useFetch } from "@/hooks/use-fetch";
import { DaysInWeek } from "@/utils/constants"; // Example: ["M", "T", "W", "T", "F", "S", "S"]
import { Habit, MonthlyHabitsProps } from "@/utils/types";
import { startOfWeek, endOfWeek } from "date-fns";
import { getDay } from "date-fns/esm";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type IsAccomplished = {
    accomplished: boolean;
    date_changed: string;
}

const WeeklyHabits = ({ data }: MonthlyHabitsProps) => {
    const [loading, setLoading] = useState(false);
    const [habits, setHabits] = useState<Habit[]>([]);
    const currMonth = new Date().toLocaleString("default", { month: "long" });
    const startRange = startOfWeek(new Date());
    const endRange = endOfWeek(new Date());

    const fetchHabits = async () => {
        setLoading(true);
        try {
            const response = await useFetch("/habits", "get");
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
        fetchHabits();
    }, []);

    return (
        <Card className="space-y-2 w-full flex-1 bg-outerCard border-none rounded-xl text-yellow-300">
            <CardHeader className="pb-0">
                <CardTitle className="font-semibold">Weekly Habit Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="grid grid-cols-10 gap-2 mb-2">
                            <div className="col-span-3"></div>
                            {DaysInWeek.map((day) => (
                                <span
                                    key={day}
                                    className="text-center font-semibold text-sm text-yellow-300"
                                >
                                    {day}
                                </span>
                            ))}
                        </div>
                        <div className="grid grid-cols-10 gap-2">
                            {habits.map((habit) => (
                                <>
                                    <div
                                        key={`name-${habit.habit._id}`}
                                        className="col-span-3 truncate font-medium text-sm overflow-ellipsis overflow-hidden"
                                        title={habit.habit.name}
                                    >
                                        {habit.habit.name}
                                    </div>
                                    {/* <div
                                        key={`heatmap-${habit.habit._id}`}
                                        className="col-span-7 grid grid-cols-7 gap-1"
                                    >
                                        {DaysInWeek.map((_, index) => {
                                            const accomplished = habit.weeklyCount.find(
                                                (entry: IsAccomplished) =>
                                                    getDay(new Date(entry.date_changed)) === index &&
                                                    entry.accomplished
                                            );

                                            return (
                                                <div
                                                    key={index}
                                                    className={`h-8 rounded-md ${accomplished
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                        }`}
                                                ></div>
                                            );
                                        })}
                                    </div> */}
                                </>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default WeeklyHabits;
