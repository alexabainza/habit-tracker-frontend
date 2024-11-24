import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import Overview from "./Overview";
import { ChartOverview } from "./ChartOverview";
import { RecentHabits } from "./RecentHabits";

const Analytics: React.FC = () => {
  const [selected, setSelected] = useState("weekly");

  return (
    <div className="w-full flex-1 h-full lg:px-16 sm:px-5 px-5 mt-6 space-y-4 pb-8">
      <main>
        <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold mb-4 md:mb-0">
          Analytics
        </h1>
        <div className="w-full max-w-xl flex items-center justify-center gap-x-10 mx-auto mb-1">
          <Button variant="link" onClick={() => setSelected("weekly")}>
            <span className={`${selected === "weekly" ? 'underline text-black' : "text-black/60"}`}>Weekly</span>
          </Button>
          <Button variant="link" onClick={() => setSelected("monthly")}>
            <span className={`${selected === "monthly" ? 'underline text-black' : "text-black/60"}`}>Monthly</span>
          </Button>
          <Button variant="link" onClick={() => setSelected("all")}>
            <span className={`${selected === "all" ? 'underline text-black' : "text-black/60"}`}>All Time</span>
          </Button>
        </div>
        <Separator className="bg-gray-500 opacity-25 mb-4" />
      </main>
      <Overview selected={selected} />
      <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap items-start justify-between gap-2 md:gap-5 lg:gap-8">
        <ChartOverview />
        <RecentHabits />
      </div>
    </div>
  );
};

export default Analytics;
