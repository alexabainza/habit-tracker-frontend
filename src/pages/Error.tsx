import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

type ErrorProps = {
    errorStatus?: string;
    message?: string;
};
const Error = ({ errorStatus = '404', message = "Page not found" }: ErrorProps) => {
    const { currentUser } = useSelector((state: RootState) => state.user);

    return (
        <div className="w-full h-full min-h-dvh flex-1 bg-gradient-to-br from-[#2A3D43] to-[#40575C] relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center space-y-5">
                <img src={`/404.svg`} alt={`${errorStatus}`} className="w-[400px] mx-auto" />
                <h1 className={`${errorStatus === 'ERR_NETWORK' ? 'text-3xl' : "text-8xl"} text-lightYellow font-bold`}>{errorStatus}</h1>
                <h1 className="text-xl text-white">{message}</h1>
                <Button className="border-lightYellow border-2 p-6 hover:bg-lightYellow transition-all duration-300 text-lightYellow hover:text-mossGreen" size='lg'>
                    <Link to={currentUser ? "/dashboard" : "/"} className="block no-underline uppercase">Go to {currentUser ? "Dashboard" : "Home"}</Link>
                </Button>
            </div>
        </div>
    )
}

export default Error