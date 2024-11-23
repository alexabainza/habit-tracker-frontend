import { useFetch } from "@/hooks/use-fetch"
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from "@/redux/user/userSlice"
import { CogIcon, LogOutIcon, UserIcon } from "lucide-react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

const UserActions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSignOut = async () => {
        dispatch(signOutUserStart());

        try {
            const response = await useFetch("/auth/logout", "post");
            const result = response.data;

            if (result.status === 200) {
                dispatch(signOutUserSuccess());
                navigate("/login");
            } else {
                const data = await result.json();
                dispatch(signOutUserFailure(data.message || "Logout failed"));
            }
        } catch (error: any) {
            dispatch(
                signOutUserFailure(error.message || "An unexpected error occurred")
            );
        }
    };
    
    return (
        <ul className="font-medium space-y-4">
            <li>
                <Link to="/profile" className="border border-dashed rounded-full hover:border-gray-600 flex-shrink-0 flex items-center gap-2 p-2.5 hover:bg-gray-100 transition-all duration-300">
                    <UserIcon className="h-6 w-6 flex-shrink-0" />
                </Link>
            </li>
            <li>
                <Link to="/profile" className="border border-dashed rounded-md hover:border-gray-600 flex-shrink-0 flex items-center gap-2 p-2.5 hover:rounded-lg hover:bg-gray-100 transition-all duration-300">
                    <CogIcon className="h-6 w-6 flex-shrink-0" />
                </Link>
            </li>
            <li>
                <button type="button" onClick={onSignOut} className="border border-dashed rounded-md hover:border-gray-600 flex-shrink-0 flex items-center gap-2 p-2.5 hover:rounded-lg hover:bg-gray-100 transition-all duration-300">
                    <LogOutIcon className="h-6 w-6 flex-shrink-0" />
                    <p className="sr-only">Logout</p>
                </button>
            </li>
        </ul>
    )
}

export default UserActions