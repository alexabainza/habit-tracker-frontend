import { useFetch } from "@/hooks/use-fetch";
import { Habit } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ChallengeCard from "@/pages/dashboard/Challenges";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitStates, setHabitStates] = useState<{ [id: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [numHabits, setNumHabits] = useState(0);
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
          result.data.forEach((habit: Habit) => {
            validStates[habit.habit._id] = habit.accomplished;
          });

          setHabitStates(validStates);
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
    setHabitStates((prevStates) => ({ ...prevStates, [id]: checked }));
  };

  console.log(habits.length === 0);

  return (
    loading ? (
      <Loading className="text-3xl" loaderClassName="w-10 h-10"/>
    ) : habits.length === 0 ? (
      <p className="text-black m-auto">No habits found.</p>
    ) : (
      <div className="w-full py-12 flex-1 h-full lg:px-16 sm:px-5 px-5 mt-6 space-y-4">
        <main>
          <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold mb-4">
            Dashboard
          </h1>
        </main>
        <section className="border-sageGreen border lg:px-8 sm:px-4 px-4 py-6 rounded-xl lg:w-1/2 sm:w-full w-full space-y-3">
          <h1 className="font-semibold text-2xl">Today's Challenges</h1>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-700">
              You have completed <strong>{completed}</strong> out of{" "}
              <strong>{numHabits}</strong> habits
            </p>
            <p className="text-sm text-green-600">{percentage.toFixed()}%</p>
          </div>
          <div className="space-y-4">
            {habits.map((habit) => (
              <ChallengeCard
                key={habit.habit._id}
                habit={habit.habit}
                checked={habitStates[habit.habit._id] || false}
                onCheck={handleCheck}
              />
            ))}
          </div>
        </section>
      </div>
    )
  );
};

export default Dashboard;
