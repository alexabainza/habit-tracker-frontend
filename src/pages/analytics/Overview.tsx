import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetch } from "@/hooks/use-fetch"
import { useToast } from "@/hooks/use-toast"
import { PropsWithChildren, useEffect, useState } from "react"

type OverviewProps = {
    selected: string
}

type OverviewCardProps = {
    title: string
    value: number | string
    frequency?: string
    description?: string
}

const Overview: React.FC<OverviewProps> = ({ selected }) => {
    const { toast } = useToast();
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
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await useFetch(`/analytics/user-streak/${selected}`, "get");
                const result = response.data;

                if (result.status === 200) {
                    setData((prev) => {
                        return {
                            ...prev,
                            currentStreak: { days: result.data.currentStreak, interval: result.data.currentStreakInterval },
                            bestStreak: { days: result.data.bestStreak, interval: result.data.bestStreakInterval },
                        };
                    });

                    toast({ title: "Streak data fetched.", duration: 2000 });
                }
            } catch (error) {
                toast({ title: "An error occurred.", variant: "destructive" });
            }
        };

        fetchData().finally(() => setLoading(false));
    }, [selected]);

    return (
        <Card>
            <CardHeader className="p-3 pb-0">
                <CardTitle>Streak Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between overflow-x-auto max-w-full py-3 lg:py-3 gap-3">
                {loading ? (
                    <>
                        <Skeleton className="w-full max-w-72 h-24 bg-gray-400" />
                        <Skeleton className="w-full max-w-72 h-24 bg-gray-400" />
                        <Skeleton className="w-full max-w-72 h-24 bg-gray-400" />
                        <Skeleton className="w-full max-w-72 h-24 bg-gray-400" />
                    </>
                ) : (
                    <>
                        <OverviewCard title="ALL TIME CONSISTENCY" value="85">
                            <p className="font-semibold text-xl">%</p>
                        </OverviewCard>
                        <OverviewCard title="CURRENT STREAK" value={data.currentStreak.days} frequency="days" description={data.currentStreak.interval} />
                        <OverviewCard title="BEST STREAK" value={data.bestStreak.days} frequency="days" description={data.bestStreak.interval} />
                        <OverviewCard title="Skipped Days this week" value="2" frequency="days" description="Nov 20 - 23" />
                    </>
                )}
            </CardContent >
        </Card >
    )
}

const OverviewCard: React.FC<OverviewCardProps & PropsWithChildren> = ({ title, description, frequency, value, children }) => {
    return (
        <Card className="w-full max-w-[190px] md:max-w-64 lg:max-w-[300px] h-24 flex flex-col md:flex-row items-center justify-center md:gap-3 flex-shrink-0 transition-all duration-300 translate-x-[-2px] translate-y-[-2px] shadow-[4px_4px_0px_black] hover:translate-x-0 hover:translate-y-0 hover:rounded-md hover:shadow-none">
            <CardContent className="pt-4 p-0 flex items-center justify-center gap-1.5">
                <h1 className="text-xl md:text-5xl font-bold text-center">{value}</h1>
                {children}
                {frequency && (
                    <>
                        <p className="hidden text-[10px] uppercase text-gray-600 tracking-wider md:flex flex-col leading-tight font-medium">
                            {frequency.split('').map((char, index) => (
                                <span key={index}>{char}</span>
                            ))}
                        </p>
                        <h1 className="uppercase text-sm md:text-lg tracking-wider md:hidden">{frequency}</h1>
                    </>
                )}
            </CardContent>
            <CardHeader className="p-0 md:p-5 md:px-0 gap-0 space-y-0 text-center md:text-left">
                <CardTitle className="text-wrap md:max-w-28 text-gray-600 text-sm tracking-tighter">{title}</CardTitle>
                <CardDescription className="text-gray-500 text-xs">{description}</CardDescription>
            </CardHeader>
        </Card>
    )
}

export default Overview