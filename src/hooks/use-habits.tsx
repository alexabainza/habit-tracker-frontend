import { Habit } from "@/utils/types";
import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { useSearchParams } from "react-router-dom";

interface HabitsContextType {
    habits: any[];
    setHabits: (habits: any) => void;
    habitStates: { [id: string]: boolean };
    setHabitStates: (habitStates: { [id: string]: boolean }) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    numHabits: number;
    setNumHabits: (numHabits: number) => void;
    weeklyCounts: { [id: string]: number };
    setWeeklyCounts: (weeklyCounts: { [id: string]: number }) => void;
    error: { message: string; status: string } | null;
    setError: (error: { message: string; status: string } | null) => void;
    completed: number;
    percentage: number;
    handleCheck: (id: string, checked: boolean) => void;
    page: number;
    setPage: (page: number) => void;
    limit: number;
    totalPages: number;
}

const HabitsContextInstance = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider = ({ children }: PropsWithChildren) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [habitStates, setHabitStates] = useState<{ [id: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [numHabits, setNumHabits] = useState(0);
    const [weeklyCounts, setWeeklyCounts] = useState<{ [id: string]: number }>({});
    const [error, setError] = useState<{ message: string; status: string } | null>(null);

    const [page, setPage] = useState(1);
    const limit = 4;
    const [totalPages, setTotalPages] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
     
    useEffect(() => {
        const fetchHabits = async () => {
            setLoading(true);
            setSearchParams({ page: page.toString() });
            try {
                const response = await useFetch(`/habits?page=${page}&limit=${limit}`, 'get');
                const result = response.data.data;
                
                if (result.data && result.data.length > 0) {
                    setHabits(result.data);
                    setNumHabits(result.total);

                    const states: { [key: string]: boolean } = {};
                    const counts: { [key: string]: number } = {};
                    
                    result.data.forEach((habit: Habit) => {
                        states[habit.habit._id] = habit.accomplished;
                        counts[habit.habit._id] = habit.weeklyCount;
                    });
                    
                    setHabitStates(states);
                    setWeeklyCounts(counts);
                }
                setTotalPages(response.data.data.totalPages);
            } catch (error: any) {
                setError({
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status || "500",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchHabits();
    }, [page]);

    const completed = Object.values(habitStates).filter(Boolean).length;
    const percentage = numHabits === 0 ? 0 : (completed / numHabits) * 100;
    
    const handleCheck = (id: string, checked: boolean) => {
        setHabitStates((prevStates) => {
            const updatedHabitStates = { ...prevStates };
            const updatedWeeklyCounts = { ...weeklyCounts };
            
            const habit = habits.find((h) => h.habit._id === id);
            if (habit) {
                const newWeeklyCount = checked
                    ? updatedWeeklyCounts[id] + 1
                    : updatedWeeklyCounts[id] - 1;
                updatedWeeklyCounts[id] = newWeeklyCount;

                const newGoalProgress = (newWeeklyCount / habit.habit.goal) * 100;

                habit.weeklyCount = newWeeklyCount;
                habit.goalProgress = newGoalProgress;

                updatedHabitStates[id] = checked;
            }
            setWeeklyCounts(updatedWeeklyCounts);
            return updatedHabitStates;
        });
    };

    return (
        <HabitsContextInstance.Provider
            value={{
                habits,
                setHabits,
                habitStates,
                setHabitStates,
                loading,
                setLoading,
                numHabits,
                setNumHabits,
                weeklyCounts,
                setWeeklyCounts,
                error,
                setError,
                completed,
                percentage,
                handleCheck,
                page,
                setPage,
                limit,
                totalPages,
            }}
        >
            {children}
        </HabitsContextInstance.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitsContextInstance);
    if (!context) {
        throw new Error("useHabits must be used within a HabitsProvider");
    }
    return context;
};
