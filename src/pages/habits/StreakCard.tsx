import { useFetch } from "@/hooks/use-fetch";
import { StreakCardProps } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/ui/loading";
import { Calendar } from "../../components/ui/calendar";
import { formatDateToMMM_d } from "@/utils/dateFormatter";
import { Skeleton } from "@/components/ui/skeleton";

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
          current: data.currentStreak || 0,
          best: data.bestStreak || 0,
          currentStreakDates: data.currentStreakDates || [],
          bestStreakDates: data.bestStreakDates || [],
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

  if(loading) {
    return <Skeleton className="w-full h-[550px] bg-innermostCard" />
  }

  return (
    <div className="w-full flex flex-col items-center justify-between">
      <div className="flex lg:flex-row md:flex-row  gap-2 w-full">
        <div className="flex w-full lg:max-h-[120px] sm:max-h-[80px] max-h-[80px] bg-innermostCard py-8 rounded-lg gap-4 lg:px-8 sm:px-4 px-4 items-center">
          <span className="lg:text-7xl sm:text-5xl text-5xl font-extrabold text-lightYellow">
            {streakData.current}
          </span>
          <div className="lg:w-full md:w-full">
            <p className="font-medium text-white">CURR STREAK</p>
            {streakData.currentStreakDates.length === 0 ? (
              <p className="text-white text-xs">No current streak</p>
            ) : (
              <>
                {streakData.currentStreakDates.length === 0 ? (
                  <p className="text-white text-xs text-start">
                    No best streak
                  </p>
                ) : streakData.currentStreakDates.length === 1 ? (
                  <p className="text-white text-xs text-start">
                    {formatDateToMMM_d(streakData.currentStreakDates[0])}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-white opacity-90">
                      {formatDateToMMM_d(streakData.currentStreakDates[0])}{" "}
                      {" - "}
                      {formatDateToMMM_d(streakData.currentStreakDates[1])}
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex w-full lg:max-h-[120px] sm:max-h-[80px] max-h-[80px] bg-innermostCard py-8 rounded-lg gap-4 lg:px-8 sm:px-4 px-4 items-center">
          <span className="lg:text-7xl sm:text-5xl text-5xl font-extrabold text-lightYellow">
            {streakData.best}
          </span>

          <div>
            <p className="font-medium text-white">BEST STREAK</p>
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
      <div className="w-full text-lightYellow flex justify-center">
        <Calendar
          mode="single"
          className="lg:py-4 sm:py-2 py-2 text-white text-3xl w-full px-0"
          modifiers={modifiers}
          modifiersClassNames={{
            accomplished:
              "bg-lightYellow text-main hover:bg-orange-100 rounded-full hover:text-main",
          }}
          classNames={{
            months: "lg:p-4 sm:p-2 p-2 rounded-xl bg-innermostCard w-full",
            table: "mt-8 w-full",
            caption_label:
              "lg:text-xl sm:text-lg text-lg font-medium text-lightYellow",
            day: "lg:h-12 sm:h-10 h-10 md:h-12 md:w-16 lg:w-16 sm:w-10 w-10",
            cell: "lg:text-lg sm:text-sm text-sm space-x-4 w-full",
            head_cell:
              "border border-none text-center text-sm lg:w-16 md:h-12 md:w-16 sm:w-10 w-10 w-full",
            nav_button: "hover:opacity-60 rounded-full text-lightYellow",
          }}
        />
      </div>
    </div>
  );
};

export default StreakCard;
