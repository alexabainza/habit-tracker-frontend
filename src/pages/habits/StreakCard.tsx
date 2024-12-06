import { useFetch } from "@/hooks/use-fetch";
import { StreakCardProps } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/ui/loading";
import { Calendar } from "../../components/ui/calendar";
import { formatDate, formatDateToMMM_d } from "@/utils/dateFormatter";

const StreakCard: React.FC<StreakCardProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({
    current: 0,
    best: 0,
    currentStreakDates: [] as string[],
    bestStreakDates: [] as string[],
  });

  const [accomplishedDates, setAccomplishedDates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

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
          currentStreakDates: data.currentStreakDates,
          bestStreakDates: data.bestStreakDates,
        });

        setAccomplishedDates(data.accomplishedDatesPerHabit);
      } catch (error) {
        setError("Failed to fetch streak data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [id]);

  if (error && !loading) {
    return (
      <div className="text-white">
        <img src="/error.svg" alt="error" className="w-60 h-60" />
        <span className="text-xl text-center">{error}</span>
      </div>
    );
  }

  const modifiers = {
    accomplished: accomplishedDates.map((date) => new Date(date)),
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
            {streakData.currentStreakDates.length === 0 ? (
              <p className="text-white text-xs">No current streak</p>
            ) : (
              <>
                {streakData.currentStreakDates.length === 0 ? (
                  <p className="text-white text-xs">No best streak</p>
                ) : streakData.currentStreakDates.length === 1 ? (
                  <p className="text-white text-xs">
                    {formatDateToMMM_d(streakData.currentStreakDates[0])}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-white opacity-90">
                      {formatDateToMMM_d(streakData.currentStreakDates[1])}{" "}
                      {" - "}
                      {formatDateToMMM_d(streakData.currentStreakDates[0])}
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex w-full h-[120px] bg-innermostCard py-8 rounded-lg gap-4 px-8 items-center">
          <span className="text-7xl font-extrabold text-lightYellow">
            {streakData.best}
          </span>
          <div>
            <p className="text-lg font-medium text-white">BEST STREAK</p>
            {streakData.bestStreakDates.length === 0 ? (
              <p className="text-white text-xs">No best streak</p>
            ) : streakData.bestStreakDates.length === 1 ? (
              <p className="text-white text-xs">
                {formatDateToMMM_d(streakData.bestStreakDates[0])}
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-white opacity-90">
                  {formatDateToMMM_d(streakData.bestStreakDates[0])} {" - "}
                  {formatDateToMMM_d(streakData.bestStreakDates[1])}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full text-lightYellow">
        <Calendar
          mode="single"
          className="p-6 text-white text-3xl"
          modifiers={modifiers}
          modifiersClassNames={{
            accomplished:
              "bg-lightYellow text-main rounded-full hover:bg-orange-300 hover:text-main",
          }}
          onMonthChange={(newMonth) => console.log("Month changed:", newMonth)}
        />
      </div>
    </div>
  );
};

export default StreakCard;
