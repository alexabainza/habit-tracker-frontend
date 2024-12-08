import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { MonthlyHabits } from "./MonthlyHabit";
import WeeklyHabits from "./WeeklyHabits";

import { useSearchParams } from "react-router-dom";

const Analytics: React.FC = () => {
  const [history, setHistory] = useSearchParams();
  const [selected, setSelected] = useState(
    history.get("frequency") || "weekly"
  );

  const handleChangeSelected = (frequency: string) => {
    setHistory({ frequency });
    setSelected(frequency);
  };

  return (
    <div className="w-full h-full min-h-dvh flex-1 bg-gradient-to-br from-[#2A3D43] to-[#40575C] xl:px-16">
      <div className="w-full p-12 flex-1 h-full px-5 space-y-4">
        <main>
          <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold mb-4 md:mb-0 tracking-wider text-lightYellow">
            Analytics
          </h1>
          <div className="w-full max-w-xl flex items-center justify-center gap-x-10 mx-auto mb-1">
            <Button
              variant="link"
              onClick={() => handleChangeSelected("weekly")}
            >
              <span
                className={`${
                  selected === "weekly"
                    ? "underline text-lightYellow font-semibold tracking-wide"
                    : "text-white"
                }`}
              >
                Weekly
              </span>
            </Button>
            <Button
              variant="link"
              onClick={() => handleChangeSelected("monthly")}
            >
              <span
                className={`${
                  selected === "monthly"
                    ? "underline text-lightYellow font-semibold tracking-wide"
                    : "text-white"
                }`}
              >
                Monthly
              </span>
            </Button>
          </div>
          <Separator className="bg-gray-500 opacity-25 mb-4" />
        </main>
        <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap items-start justify-between gap-4 transition-all duration-300">
          {selected === "monthly" ? <MonthlyHabits /> : <WeeklyHabits />}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
