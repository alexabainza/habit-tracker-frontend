import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { resetState } from "@/redux/user/userSlice";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronLeftIcon, ChevronRightIcon, Loader2, MountainIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ForgotPasswordSchema } from "@/utils/schemas";
import { handleAuthError } from "@/utils/errorHandler";
import { useFetch } from "@/hooks/use-fetch";
import { z } from "zod";
import { toast } from "sonner";
import { MdEmail } from "react-icons/md";

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    dispatch(resetState());

    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const response = await useFetch("/auth/forgot-password", "post", form.getValues());

            const result = response.data;

            console.log(response)
            if (result.status === 200) {
                toast.success(result.message);
                navigate("/dashboard");
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
        <div className="flex justify-center items-center w-full bg-gradient-to-br from-[#2A3D43] via-[#40575C] to-[#61878A] text-white">
            <div className="w-full inline-flex items-center justify-between absolute top-0 p-5">
                <p className="text-md text-gray-200 gap-1.5 flex items-end">
                    <span className="hidden md:block">No account?</span>
                    <Link to="/register" className="underline hover:font-semibold transition-all duration-300">
                        <ChevronLeftIcon className="w-5 h-5 inline-block" />
                        Register
                    </Link>
                </p>
                <p className="text-md text-gray-200 gap-1.5 flex items-end">
                    <span className="hidden md:block">Remembered it?</span>
                    <Link to="/login" className="underline hover:font-semibold transition-all duration-300">
                        Login
                        <ChevronRightIcon className="w-5 h-5 inline-block" />
                    </Link>
                </p>
            </div>
            <Card className="w-[400px] sm:mx-5 mx-5 border-0 shadow-none">
                <CardHeader>
                    <MountainIcon className="w-12 h-12 text-white mx-auto mb-14" />
                    <CardTitle className="text-2xl md:text-4xl text-center">
                        Forgot Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-0">
                                        <FormLabel className="font-medium text-xs">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MdEmail className="w-5 h-5 absolute top-1/2 left-2 transform -translate-y-1/2" />
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
                            <Button
                                type="submit"
                                className="w-full py-6 border border-white transition-all duration-300 text-white hover:bg-white/85 hover:text-black hover:border-transparent"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Send Request"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;