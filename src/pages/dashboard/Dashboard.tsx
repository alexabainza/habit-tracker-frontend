import React from "react";
import ChallengeCard from "@/pages/dashboard/Challenges";
import Loading from "@/components/ui/loading";
import Error from "../Error";
import { useHabits } from "@/hooks/use-habits";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRightIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  const {
    habits,
    error,
    loading,
    percentage,
    completed,
    numHabits,
    habitStates,
    page,
    setPage,
    totalPages,
    handleCheck,
  } = useHabits();

  if (error && !loading) {
    return <Error message={error.message} errorStatus={error.status} />;
  }

  return loading ? (
    <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C] flex flex-col">
      <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold text-lightYellow tracking-wider lg:px-16 sm:px-5 px-5 py-12">
        Dashboard
      </h1>
      <Loading
        className="lg:px-16 sm:px-5 px-5 text-3xl"
        loaderClassName="w-10 h-10"
      />
    </div>
  ) : habits.length === 0 ? (
    <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C] flex flex-col">
      <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold text-lightYellow tracking-wider lg:px-16 sm:px-5 px-5 py-4">
        Dashboard
      </h1>
      <p className="text-white text-center">No habits found</p>
    </div>
  ) : (
    <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C]">
      <div className="lg:px-16 sm:px-8 px-5 space-y-4 m-auto items-center justify-center py-8">
        <section className="w-full flex flex-col md:flex-row items-end justify-between">
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
