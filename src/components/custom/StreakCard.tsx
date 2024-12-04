import { useFetch } from "@/hooks/use-fetch";
import { StreakCardProps } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../ui/loading";
import { Calendar } from "../ui/calendar";

const StreakCard: React.FC<StreakCardProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({
    current: 0,
    best: 0,
  });
  const [accomplishedDates, setAccomplishedDates] = useState<string[]>([]);

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

        setStreakData({
          current: data.currentStreak,
          best: data.bestStreak,
        });
        setAccomplishedDates(data.accomplishedDatesPerHabit);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStreak().finally(() => setLoading(false));
  }, [id]);

  const isAccomplished = (date: Date) => {
    const dateString = date.toLocaleDateString();
    return accomplishedDates.some(
      (accomplishedDate) => accomplishedDate === dateString
    );
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="w-full flex flex-col items-center gap-3 justify-between">
      <div className="flex gap-4">
        <div className="flex w-full h-[120px] bg-innermostCard py-8 rounded-lg gap-4 px-8 items-center">
          <span className="text-7xl font-extrabold text-lightYellow">
            {streakData.current}
          </span>
          <div>
            <p className="text-lg font-medium text-white">CURRENT STREAK</p>
            <p className="text-sm font-medium text-white opacity-90">
              Date if naa
            </p>
          </div>
        </div>
        <div className="flex w-full h-[120px] bg-innermostCard py-8 rounded-lg gap-4 px-8 items-center">
          <span className="text-7xl font-extrabold text-lightYellow">
            {streakData.best}
          </span>
          <div>
            <p className="text-lg font-medium text-white">BEST STREAK</p>
            <p className="text-sm font-medium text-white opacity-90">
              Date if naa
            </p>
          </div>
        </div>
      </div>
      <div className="w-full text-lightYellow">
        <Calendar
          date={new Date()}
          mode="single"
          markedDates={accomplishedDates.map((date) => new Date(date))}
          renderDay={(day: Date) => {
            const isDayAccomplished = accomplishedDates.some(
              (accomplishedDate) => {
                const dayString = day.toLocaleDateString();
                return accomplishedDate === dayString;
              }
            );

            return (
              <div
                className={`flex justify-center items-center w-10 h-10 rounded-full ${
                  isDayAccomplished ? "bg-lightYellow text-main" : ""
                }`}
              >
                {day.getDate()}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default StreakCard;
