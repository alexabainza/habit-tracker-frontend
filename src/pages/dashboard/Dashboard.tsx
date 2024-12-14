import React, { useEffect, useMemo, useState } from "react";
import ChallengeCard from "@/pages/dashboard/Challenges";
import Loading from "@/components/ui/loading";
import Error from "../Error";
import { useHabits } from "@/hooks/use-habits";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRightIcon, LoaderIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { Habit } from "@/utils/types";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard: React.FC = () => {
  const {
    habits,
    error,
    loading,
    numHabits,
    habitStates,
    setLoading,
    setHabits,
    setHabitStates,
    setWeeklyCounts,
    setNumHabits,
    handleCheck,
    setError,
  } = useHabits();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(searchParams.get("page") ? parseInt(searchParams.get("page") || "1") : 1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await useFetch(`/habits?page=${page}&limit=${limit}`, 'get');
        const result = response.data.data;
        if (result.data && result.data.length > 0) {
          console.log(result.data);
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
          setTotalPages(response.data.data.totalPages);
        } else {
          console.log(result.data.length > 0);
          setHabits([]);
          setNumHabits(0);
          setHabitStates({});
          setWeeklyCounts({});
        }
      } catch (error: any) {
        setHabits([]);
        setNumHabits(0);
        setHabitStates({});
        setWeeklyCounts({});
        setError({
          message: error.response?.data?.message || error.message,
          status: error.response?.status || "500",
        });
      } finally {
        setLoading(false);
      }
    };

    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, page: page.toString() });
    fetchHabits();
  }, [page]);

  const completed = useMemo(() => {
    return habits.filter((habit) => habitStates[habit.habit._id]).length;
  }, [habits, habitStates]);

  const percentage = (completed / numHabits) * 100;

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C] flex flex-col py-8 lg:px-16 sm:px-8 px-5">
        <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold text-lightYellow tracking-wider py-12">
          Dashboard
        </h1>
        <Skeleton
          className="w-full h-[500px] bg-innermostCard rounded-xl text-lightYellow text-center flex flex-col items-center justify-center gap-4"
        >
          <LoaderIcon className="w-20 h-20 animate-spin mx-auto text-lightYellow" />
          <span className="text-2xl font-bold">Loading...</span>
        </Skeleton>
      </div>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C] flex flex-col py-8 lg:px-16 sm:px-8 px-5">
        <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold text-lightYellow tracking-wider py-4">
          Dashboard
        </h1>
        <div className="m-auto space-y-8">
          <img src="/error.svg" alt="No habits found" className="w-96 object-cover" />
          <p className="text-white text-center text-xl md:text-3xl font-bold">No habits found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C]">
      <div className="lg:px-16 sm:px-8 px-5 space-y-4 m-auto items-center justify-center py-8">
        <section className="w-full flex flex-col py-8 md:flex-row items-end justify-between">
          <h1 className="lg:text-4xl sm:text-3xl text-2xl font-bold text-lightYellow tracking-wider w-full">
            Dashboard
          </h1>
          <div className="w-full flex md:justify-end items-center md:gap-4 mt-4 text-lightYellow">
            <Button
              disabled={page === 1}
              onClick={() => setPage(Math.max(page - 1, 1))}
            >
              <ChevronLeft className="flex-shrink-0 w-5 h-5" />
              <span>Previous</span>
            </Button>
            <span>
              {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(Math.min(page + 1, totalPages))}
            >
              <span>Next</span>
              <ChevronRightIcon className="flex-shrink-0 w-5 h-5" />
            </Button>
          </div>
        </section>
        <section className="bg-outerCard sm:px-8 px-4 py-8 rounded-xl  space-y-3">
          <div className="flex justify-between items-end px-2">
            <div className="lg:w-3/4 sm:w-full w-full space-y-4">
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
            <h1 className="text-xl text-lightYellow font-bold hidden lg:block">
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
