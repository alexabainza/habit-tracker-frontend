import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, KeyIcon, Loader2, LogInIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { LoginSchema } from "@/utils/schemas";
import { handleAuthError } from "@/utils/errorHandler";
import { useFetch } from "@/hooks/use-fetch";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { resetState } from "@/redux/user/userSlice";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTPForm } from "./OtpForm";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState<string>("");

    const dispatch = useDispatch();

    dispatch(resetState());

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const response = await useFetch("/auth/login", "post", form.getValues());
            const result = response.data;

            if (result.status === 200) {
                toast.success(result.message);
                setOtpSent(result.data.email);
            }
        } catch (error: any) {
            if (error.response) {
                const errorMessage = handleAuthError(error.response, dispatch);
                toast.error(errorMessage);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        otpSent ? (
            <InputOTPForm email={otpSent} />
        ) : (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-0 relative">
                                <FormLabel className="uppercase font-medium text-xs space-x-1.5">
                                    <strong>Email</strong>
                                    <span className="lowercase">or</span>
                                    <strong>Username</strong>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <MailIcon className="w-5 h-5 absolute top-1/2 left-2 transform -translate-y-1/2" />
                                        <Input
                                            placeholder="johndoe@gmail.com"
                                            {...field}
                                            className="border-[#6490BC] rounded-md placeholder:text-gray-400 pl-9" // Add your desired placeholder color here
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs text-red-400" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-0">
                                <FormLabel className="uppercase font-bold text-xs flex items-center justify-between">
                                    <span>Password</span>
                                    <Link to='/forgot' className="lowercase font-semibold">Forgot Password?</Link>
                                </FormLabel>
                                <FormControl className="relative">
                                    <div className="flex flex-row items-center rounded-md relative">
                                        <KeyIcon className="w-5 h-5 absolute top-1/2 left-2 transform -translate-y-1/2" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder={`${showPassword ? "Password@123" : "********"}`}
                                            {...field}
                                            className="placeholder:text-gray-400 border-[#6490BC] pl-9"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="ml-2 absolute right-2 top-0 bottom-0 flex items-center justify-center w-5"
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs text-red-400" />
                            </FormItem>
                        )}
                    />
                    <p className="text-xs text-gray-200">
                        Don't have an account? Register{" "}
                        <Link to="/register" className="underline hover:font-bold">
                            here
                        </Link>
                    </p>
                    <Button
                        type="submit"
                        className="w-full py-6 border border-white transition-all duration-300 text-white hover:bg-white/85 hover:text-black hover:border-transparent"
                        disabled={isLoading}
                    >
                        {isLoading ? <><Loader2 className="animate-spin" /> Loading</> : <><LogInIcon className="flex-shrink-0 w-5 h-5" />Login</>}
                    </Button>
                </form>
            </Form>
        )
    )
}

export default LoginForm