import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentHabits() {
    return (
        <ScrollArea className="w-full h-64 md:h-80 rounded-md border p-5 my-0">
            <div className="mb-5">
                <h1 className="font-semibold">Statistics Summary</h1>
                <p className="text-gray-700/80 text-sm">
                    A summary of the recent transactions
                </p>
            </div>
            <div className="space-y-6">
                <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none max-w-24 md:max-w-44 lg:max-w-56 truncate">Olivia Martin</p>
                        <p className="text-sm text-muted-foreground max-w-24 md:max-w-44 lg:max-w-56 truncate">
                            olivia.martin@email.com
                        </p>
                    </div>
                    <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
                <div className="flex items-center">
                    <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                        <AvatarImage src="/avatars/02.png" alt="Avatar" />
                        <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none max-w-24 md:max-w-44 lg:max-w-56 truncate">Jackson Lee</p>
                        <p className="text-sm text-muted-foreground max-w-24 md:max-w-44 lg:max-w-56 truncate">jackson.lee@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$39.00</div>
                </div>
                <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/03.png" alt="Avatar" />
                        <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none max-w-24 md:max-w-44 lg:max-w-56 truncate">Isabella Nguyen</p>
                        <p className="text-sm text-muted-foreground max-w-24 md:max-w-44 lg:max-w-56 truncate">
                            isabella.nguyen@email.com
                        </p>
                    </div>
                    <div className="ml-auto font-medium">+$299.00</div>
                </div>
                <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/04.png" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none max-w-24 md:max-w-44 lg:max-w-56 truncate">William Kim</p>
                        <p className="text-sm text-muted-foreground max-w-24 md:max-w-44 lg:max-w-56 truncate">will@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$99.00</div>
                </div>
                <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/04.png" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none max-w-24 md:max-w-44 lg:max-w-56 truncate">William Kim</p>
                        <p className="text-sm text-muted-foreground max-w-24 md:max-w-44 lg:max-w-56 truncate">will@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$99.00</div>
                </div>
                <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/04.png" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none max-w-24 md:max-w-44 lg:max-w-56 truncate">William Kim</p>
                        <p className="text-sm text-muted-foreground max-w-24 md:max-w-44 lg:max-w-56 truncate">will@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$99.00</div>
                </div>
                <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/04.png" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none max-w-24 md:max-w-44 lg:max-w-56 truncate">William Kim</p>
                        <p className="text-sm text-muted-foreground max-w-24 md:max-w-44 lg:max-w-56 truncate">will@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$99.00</div>
                </div>
                <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/04.png" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none max-w-24 md:max-w-44 lg:max-w-56 truncate">William Kim</p>
                        <p className="text-sm text-muted-foreground max-w-24 md:max-w-44 lg:max-w-56 truncate">will@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$99.00</div>
                </div>
                <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/04.png" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none max-w-24 md:max-w-44 lg:max-w-56 truncate">William Kim</p>
                        <p className="text-sm text-muted-foreground max-w-24 md:max-w-44 lg:max-w-56 truncate">will@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+$99.00</div>
                </div>
            </div>
        </ScrollArea>
    )
}