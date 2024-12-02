import { useFetch } from "@/hooks/use-fetch";
import { Habit } from "@/utils/types";
import React, { useEffect, useState } from "react";
import ChallengeCard from "@/pages/dashboard/Challenges";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitStates, setHabitStates] = useState<{ [id: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [numHabits, setNumHabits] = useState(0);
  const [weeklyCounts, setWeeklyCounts] = useState<{ [id: string]: number }>(
    {}
  ); // Define weeklyCounts state

  const completed = Object.values(habitStates).filter(Boolean).length;
  const percentage = numHabits === 0 ? 0 : (completed / numHabits) * 100;

  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await useFetch("/habits", "get");
        const result = response.data;
        if (result.data && result.data.length > 0) {
          setHabits(result.data);
          setNumHabits(result.data.length);

          const validStates: { [key: string]: boolean } = {};
          const initialWeeklyCounts: { [key: string]: number } = {};

          result.data.forEach((habit: Habit) => {
            validStates[habit.habit._id] = habit.accomplished;
            initialWeeklyCounts[habit.habit._id] = habit.weeklyCount; // Capture the initial weeklyCount
          });

          setHabitStates(validStates);
          setWeeklyCounts(initialWeeklyCounts); // Set weekly counts state
        } else {
          setHabits([]);
        }
      } catch (error) {
        toast.error("Failed to fetch habits.");
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);
  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await useFetch("/habits", "get");
        const result = response.data;
        if (result.data && result.data.length > 0) {
          setHabits(result.data);
          setNumHabits(result.data.length);

          const validStates: { [key: string]: boolean } = {};
          const initialWeeklyCounts: { [key: string]: number } = {};

          result.data.forEach((habit: Habit) => {
            validStates[habit.habit._id] = habit.accomplished;
            initialWeeklyCounts[habit.habit._id] = habit.weeklyCount; // Capture the initial weeklyCount
          });

          setHabitStates(validStates);
          setWeeklyCounts(initialWeeklyCounts);
        } else {
          setHabits([]);
        }
      } catch (error) {
        toast.error("Failed to fetch habits.");
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);
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

  console.log(habits);

  return loading ? (
    <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C] flex flex-col items-center justify-center">
      <Loading
        className="lg:px-16 sm:px-5 px-5 text-3xl"
        loaderClassName="w-10 h-10"
      />
    </div>
  ) : habits.length === 0 ? (
    <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C]">
      <p className="text-white text-center">No habits found</p>
    </div>
  ) : (
    <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C]">
      <div className="lg:px-16 sm:px-5 px-5 space-y-4 m-auto items-center justify-center mt-6 py-12">
        <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold text-lightYellow tracking-wider ">
          Dashboard
        </h1>
        <section className="bg-outerCard lg:px-8 sm:px-4 px-4 py-12 rounded-xl  space-y-3">
          <div className="flex justify-between items-end px-2">
            <div className="w-3/4 space-y-4">
              <h1 className="font-semibold text-2xl text-lightYellow">
                Today's Challenges
              </h1>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between space-y-2">
                <p className="text-sm text-white">
                  You have completed{" "}
                  <strong className="text-green-300">{completed}</strong> out of{" "}
                  <strong>{numHabits}</strong> habits
                </p>
                <p className="text-sm text-green-300">
                  {percentage.toFixed()}%
                </p>
              </div>
            </div>
            <h1 className="text-xl text-lightYellow font-bold">
              Weekly progress
            </h1>
          </div>

          <div className="space-y-4">
            {habits.map((habit) => (
              <ChallengeCard
                key={habit.habit._id}
                habit={habit.habit}
                checked={habitStates[habit.habit._id] || false}
                onCheck={handleCheck}
                weeklyCount={habit.weeklyCount}
                weeklyProgress={habit.goalProgress}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
