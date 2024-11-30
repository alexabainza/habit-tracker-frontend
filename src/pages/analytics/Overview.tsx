import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { PropsWithChildren, useEffect, useState } from "react";
import { toast } from "sonner";

type OverviewProps = {
  selected: string;
  skippedDays?: number;
};

type OverviewCardProps = {
  title: string;
  value: number | string;
  frequency?: string;
  description?: string;
};

const cache: Record<string, any> = {};

const Overview: React.FC<OverviewProps> = ({ selected, skippedDays }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    currentStreak: {
      days: 0,
      interval: "",
    },
    bestStreak: {
      days: 0,
      interval: "",
    },
    consistency: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const streakCacheKey = `/analytics/user-streak/${selected}`;
        const consistencyCacheKey = `/analytics/user-consistency/${selected}`;

        // Check if data is in the cache
        const streakData =
          cache[streakCacheKey] ||
          (await useFetch(`/analytics/user-streak/${selected}`, "get"));
        const consistencyData =
          cache[consistencyCacheKey] ||
          (await useFetch(`/analytics/user-consistency/${selected}`, "get"));

        // Save data to cache
        cache[streakCacheKey] = streakData;
        cache[consistencyCacheKey] = consistencyData;

        if (streakData.status === 204 || consistencyData.status === 204) {
          toast.error("Please do something first.");
          return;
        }

        const streakResult = streakData.data;
        const consistencyResult = consistencyData.data;

        setData((prev) => ({
          ...prev,
          currentStreak: {
            days: streakResult.data.currentStreak,
            interval: streakResult.data.currentStreakInterval,
          },
          bestStreak: {
            days: streakResult.data.bestStreak,
            interval: streakResult.data.bestStreakInterval,
          },
          consistency: consistencyResult.data.percentage.toFixed(0),
        }));
      } catch (error) {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selected]);

  return (
    <Card className="bg-outerCard py-4 border-none px-8 space-y-2">
      <CardHeader className="p-3 pb-0  ">
        <CardTitle className="text-lightYellow text-xl">
          Streak Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 overflow-x-auto max-w-full py-3 lg:py-3 ">
        {loading ? (
          <>
            <Skeleton className="w-full max-w-72 h-24 bg-gray-400" />
            <Skeleton className="w-full max-w-72 h-24 bg-gray-400" />
            <Skeleton className="w-full max-w-72 h-24 bg-gray-400" />
            <Skeleton className="w-full max-w-72 h-24 bg-gray-400" />
          </>
        ) : (
          <>
            <OverviewCard
              title={`${selected} Consistency`}
              value={data.consistency}
            >
              <p className="font-semibold text-xl text-white">%</p>
            </OverviewCard>
            <OverviewCard
              title="CURRENT STREAK"
              value={data.currentStreak.days}
              frequency="days"
              description={data.currentStreak.interval}
            />
            <OverviewCard
              title="BEST STREAK"
              value={data.bestStreak.days}
              frequency="days"
              description={data.bestStreak.interval}
            />
            <OverviewCard
              title={`Skipped Days this ${selected} period`}
              value={skippedDays || 0}
              frequency="days"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

const OverviewCard: React.FC<OverviewCardProps & PropsWithChildren> = ({
  title,
  description,
  frequency,
  value,
  children,
}) => {
  return (
    <Card className="w-full max-w-[190px] md:max-w-64 lg:max-w-[300px] border-none bg-innermostCard h-24 flex flex-col md:flex-row items-center justify-center md:gap-3 flex-shrink-0 transition-all duration-300 translate-x-[-2px] translate-y-[-2px] shadow-[4px_4px_0px_black] hover:translate-x-0 hover:translate-y-0 hover:rounded-md hover:shadow-none">
      <CardContent className="pt-4 p-0 flex items-center justify-center gap-1.5">
        <h1 className="text-xl md:text-5xl font-bold text-center text-lightYellow">
          {value}
        </h1>
        {children}
        {frequency && (
          <>
            <p className="hidden text-[10px] uppercase text-white tracking-wider md:flex flex-col leading-tight font-medium">
              {frequency.split("").map((char, index) => (
                <span key={index}>{char}</span>
              ))}
            </p>
            <h1 className="uppercase text-sm md:text-lg tracking-wider md:hidden text-white">
              {frequency}
            </h1>
          </>
        )}
      </CardContent>
      <CardHeader className="p-0 md:p-5 md:px-0 gap-0 space-y-0 text-center md:text-left">
        <CardTitle className="text-wrap md:max-w-28 text-white opacity-90 text-sm tracking-tighter capitalize ">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-200 text-xs">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default Overview;
