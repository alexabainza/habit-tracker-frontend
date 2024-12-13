import { FaRunning } from "react-icons/fa";
import { RiHome6Line } from "react-icons/ri";
import { MdOutlineAutoGraph } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRightIcon } from "lucide-react";

const MenuItems = [
  { name: "Dashboard", link: "/dashboard", icon: RiHome6Line },
  { name: "Habits", link: "/habits", icon: FaRunning },
  { name: "Analytics", link: "/analytics", icon: MdOutlineAutoGraph },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <ul className="font-medium space-y-5 z-50 shadow-sm">
      {MenuItems.map((item, index) => (
        <li key={index}>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <Link
                  to={item.link}
                  className={`border border-dashed rounded-md border-lightYellow flex-shrink-0 flex items-center gap-2 p-2.5 hover:rounded-2xl transition-all duration-300 group ${
                    location.pathname === item.link
                      ? "bg-lightYellow text-main border-main"
                      : "text-lightYellow hover:text-main hover:bg-lightYellow hover:drop-shadow-sm"
                  }`}
                >
                  <item.icon
                    className={`h-6 w-6 ${
                      location.pathname === item.link
                        ? "text-main"
                        : "text-lightYellow group-hover:text-main"
                    }`}
                  />
                  <span className="md:hidden">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="hidden bg-black text-white text-md font-semibold md:flex items-center gap-x-1"
              >
                To
                <p className="font-bold">{item.name}</p>
                <ChevronRightIcon className="h-4 w-4" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      ))}
    </ul>
  );
};

export default Navigation;
