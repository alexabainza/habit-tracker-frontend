import StreakCard from "@/components/custom/StreakCard";
import { useFetch } from "@/hooks/use-fetch";
import { Habit } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ChallengeCard from "@/pages/dashboard/Challenges";

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitStates, setHabitStates] = useState<{ [id: string]: boolean }>({});
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await useFetch("/habits", "get");
        const result = response.data;
        setHabits(result.data || []);

        const savedStates = JSON.parse(
          localStorage.getItem("habitStates") || "{}"
        );

        const validStates: { [key: string]: boolean } = {};
        result.data.forEach((habit: Habit) => {
          validStates[habit.habit._id] = savedStates[habit.habit._id] || false;
        });

        setHabitStates(validStates);
        if (response.status === 204) {
          toast({ title: "No habits found.", duration: 2000 });
        }
      } catch (error) {
        toast({ title: "An error occurred.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);
  useEffect(() => {
    if (Object.keys(habitStates).length > 0) {
      localStorage.setItem("habitStates", JSON.stringify(habitStates));
    }
  }, [habitStates]);
  const handleCheck = (id: string, checked: boolean) => {
    console.log("toggled: ", id);

    setHabitStates((prevStates) => ({ ...prevStates, [id]: checked }));
  };

  return (
    <div className="w-full py-12 flex-1 h-full lg:px-16 sm:px-5 px-5 mt-6 space-y-4">
      <main>
        <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold mb-4">
          Dashboard
        </h1>
      </main>
      <section className="border-sageGreen border lg:px-8 sm:px-4 px-4 py-6 rounded-md text-lg space-y-2">
        <h1 className="font-semibold text-md">Streak Overview</h1>
        <div className="flex justify-between gap-4 flex-wrap">
          <StreakCard amount={10} label="All time consistency" />
          <StreakCard amount={10} label="All time consistency" />
          <StreakCard amount={10} label="All time consistency" />
        </div>
      </section>
      <section className="border-sageGreen border lg:px-8 sm:px-4 px-4 py-6 rounded-xl lg:w-1/2 sm:w-full w-full space-y-3">
        <h1 className="font-semibold text-2xl">Today's Challenges</h1>
        {loading ? (
          <div>
            <Loader2 className="animate-spin" />
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );
};

export default Dashboard;
