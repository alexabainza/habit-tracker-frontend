import { useFetch } from "@/hooks/use-fetch";
import { StreakCardProps } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../ui/loading";

const StreakCard: React.FC<StreakCardProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState({
    current: 0,
    best: 0,
  });

  useEffect(() => {
    const fetchStreak = async () => {
      setLoading(true);
      try {
        const response = await useFetch(`/analytics/habit-streak/${id}`, "get");
        const data = response.data.data;

        if (data.status === 204) {
          toast.error("Please do something first.");
          return;
        }

        setAmount({
          current: data.currentStreak,
          best: data.bestStreak,
        })
      } catch (error) {
        console.error(error);
      }
    };

    fetchStreak().finally(() => setLoading(false));
  }, [id]);

  return (
    loading ? (
      <Loading />
    ) : (
      <div className="w-full flex items-center gap-3 justify-between">
        <div className="flex flex-col w-full h-[200px] bg-white border py-8 border-gray-300 rounded-lg items-center justify-center gap-4 align-middle">
          <span className="text-5xl font-extrabold">{amount.current
          }</span >
          <span className="text-sm font-medium text-sageGreen">Current Streak</span>
        </div >
        <div className="flex flex-col w-full h-[200px] bg-white border py-8 border-gray-300 rounded-lg items-center justify-center gap-4 align-middle">
          <span className="text-5xl font-extrabold">{amount.best}</span>
          <span className="text-sm font-medium text-sageGreen">Best Streak</span>
        </div>
      </div >
    )
  )
};

export default StreakCard;
