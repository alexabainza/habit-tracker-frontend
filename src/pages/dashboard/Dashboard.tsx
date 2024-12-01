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
        <section className="bg-outerCard lg:px-8 sm:px-4 px-4 py-12 rounded-xl lg:w-1/2 sm:w-full w-full space-y-3">
          <h1 className="font-semibold text-2xl text-lightYellow">
            Today's Challenges
          </h1>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-white">
              You have completed{" "}
              <strong className="text-green-300">{completed}</strong> out of{" "}
              <strong>{numHabits}</strong> habits
            </p>
            <p className="text-sm text-green-300">{percentage.toFixed()}%</p>
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
    </div>
  );
};

export default Dashboard;
