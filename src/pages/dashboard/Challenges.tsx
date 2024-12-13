import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/use-fetch";
import { Habit } from "@/utils/types";
import { LoaderIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { RadialBarChart, RadialBar } from "recharts";

const ChallengeCard: React.FC<{
  habit: Habit["habit"];
  checked: boolean;
  onCheck: (id: string, checked: boolean) => void;
  className?: string;
  weeklyCount: number;
  weeklyProgress: number;
}> = ({ habit, checked, onCheck, className, weeklyCount, weeklyProgress }) => {
  const [loading, setLoading] = useState(false);
  const data = [{ name: habit.name, value: weeklyProgress, fill: habit.color }];
  const [progress, setProgress] = useState(0); // Track the progress in state
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check if screen size is small
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640); // 640px is typical for small screens
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (progress !== weeklyProgress) {
      let currentProgress = progress;
      const interval = setInterval(() => {
        if (currentProgress < weeklyProgress) {
          currentProgress++;
          setProgress(currentProgress);
        } else if (currentProgress > weeklyProgress) {
          currentProgress--;
          setProgress(currentProgress);
        } else {
          clearInterval(interval);
        }
      }, 10);

      return () => clearInterval(interval);
    }
  }, [weeklyProgress, progress]);

  const updateAccomplishedStatus = async () => {
    setLoading(true);
    try {
      const response = await useFetch(
        `/habits/acc/${habit._id.toString()}`,
        "put"
      );
      if (response.status === 204) {
        toast.error("The data does not exist!");
        return;
      }
    } catch (error) {
      toast.error("Did not update habit. Reverting...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-1 bg-innermostCard py-4 h-28 rounded-2xl px-8 gap-4 align-middle justify-between transform transition-transform duration-500 ease-in-out ${className}`}
    >
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-4 w-3/4">
          <>
            {loading ? (
              <LoaderIcon className="flex-shrink-0 w-6 h-6 animate-spin text-white" />
            ) : (
              <>
                <Input
                  type="checkbox"
                  id={habit._id}
                  checked={checked}
                  onChange={(e) => {
                    onCheck(habit._id, e.target.checked);
                    updateAccomplishedStatus();
                  }}
                  disabled={loading}
                  className="hidden"
                />
                <label
                  htmlFor={habit._id}
                  className={`cursor-pointer w-6 h-6 rounded-lg ${
                    checked ? "bg-white" : "border-2 border-white"
                  } flex items-center justify-center`}
                >
                  {checked && <span className="text-main font-bold">✔</span>}
                </label>
              </>
            )}
          </>
          <span className="text-xl font-medium text-white overflow-hidden text-ellipsis whitespace-nowrap lg:w-full md:w-full sm:w-[100px] w-[100px]">
            {habit.name}
          </span>
        </div>
        <div className="relative w-[120px] h-[120px]">
          <RadialBarChart
            width={120}
            height={120}
            innerRadius="60%"
            outerRadius="90%"
            data={data}
            barSize={10}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              fill="transparent"
              data={[{ value: 100 }]}
            />

            <RadialBar
              dataKey="value"
              fill={habit.color || "#8884d8"}
              background={{ fill: "#446062" }}
              startAngle={90}
              endAngle={(360 * weeklyProgress) / 100}
              isAnimationActive={true}
              animationDuration={3000}
            />
          </RadialBarChart>
          <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-md">
            {isSmallScreen
              ? `${weeklyCount} / ${habit.goal}`
              : `${Math.round(weeklyProgress)}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
