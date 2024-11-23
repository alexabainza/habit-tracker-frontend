import { FaRunning } from "react-icons/fa";
import { RiHome6Line } from "react-icons/ri";
import { MdOutlineAutoGraph } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const MenuItems = [
    { name: "Home", link: "/dashboard", icon: RiHome6Line },
    { name: "Habits", link: "/habits", icon: FaRunning },
    { name: "Analytics", link: "/analytics", icon: MdOutlineAutoGraph },
    { name: "Streaks", link: "/streaks", icon: IoCalendarOutline },
];

const Navigation = () => {
    return (
        <ul className="font-medium space-y-5 z-50">
            {MenuItems.map((item, index) => (
                <li key={index}>
                    <Link to={item.link} className="border border-dashed rounded-md hover:border-gray-600 flex-shrink-0 flex items-center gap-2 p-2.5 hover:rounded-lg hover:bg-gray-100 transition-all duration-300">
                        <item.icon className="h-6 w-6" />
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default Navigation