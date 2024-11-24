import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PropsWithChildren } from "react"

type OverviewProps = {
    selected: string
}

type OverviewCardProps = {
    title: string
    value: string
    frequency?: string
    description?: string
}

const Overview: React.FC<OverviewProps> = () => {
    return (
        <Card>
            <CardHeader className="p-3 pb-0">
                <CardTitle>Streak Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between overflow-x-auto max-w-full py-3 md:py-1 lg:py-3 gap-3">
                <OverviewCard title="ALL TIME CONSISTENCY" value="85">
                    <p className="font-semibold text-xl">%</p>
                </OverviewCard>
                <OverviewCard title="CURRENT STREAK" value="3" frequency="days" description="Nov 20 - 23" />
                <OverviewCard title="BEST STREAK" value="5" frequency="days" description="Nov 20 - 23" />
                <OverviewCard title="Skipped Days this week" value="2" frequency="days" description="Nov 20 - 23" />
            </CardContent>
        </Card>
    )
}

const OverviewCard: React.FC<OverviewCardProps & PropsWithChildren> = ({ title, description, frequency, value, children }) => {
    return (
        <Card className="w-full max-w-[190px] md:max-w-64 lg:max-w-[300px] h-24 flex flex-col md:flex-row items-center justify-center md:gap-3 flex-shrink-0">
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