import { Habit } from "@/utils/types";
import { createContext, PropsWithChildren, useContext, useState } from "react";

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
    handleCheck: (id: string, checked: boolean) => void;
}

const HabitsContextInstance = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider = ({ children }: PropsWithChildren) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [habitStates, setHabitStates] = useState<{ [id: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [numHabits, setNumHabits] = useState(0);
    const [weeklyCounts, setWeeklyCounts] = useState<{ [id: string]: number }>({});
    const [error, setError] = useState<{ message: string; status: string } | null>(null);

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
                handleCheck,
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
