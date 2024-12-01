import { RootState } from "@/redux/store";
import { UserIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserActions = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <ul className="font-medium space-y-4">
      <li>
        <Link
          to="/profile"
          className="border border-dashed border-lightYellow rounded-full hover:border-main flex-shrink-0 flex items-center justify-center gap-2 p-2.5 hover:bg-lightYellow hover:text-main transition-all duration-300"
        >
          <UserIcon className="h-6 w-6 flex-shrink-0 text-lightYellow hover:text-main" />
          <span className="text-ellipsis md:hidden text-lightYellow">
            {currentUser && currentUser.user.username}
          </span>
        </Link>
      </li>
    </ul>
  );
};

export default UserActions;
