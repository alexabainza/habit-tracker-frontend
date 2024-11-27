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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ResetPasswordSchema } from "@/utils/schemas";
import { useFetch } from "@/hooks/use-fetch";
import { z } from "zod";
import { toast } from "sonner";

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    dispatch(resetState());
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            id: queryParams.get('id') ?? "",
            token: queryParams.get('token') ?? "",
            new_password: "",
            confirm_password: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const response = await useFetch('/auth/reset-password', "post", form.getValues());

            const result = response.data;
            if (result.status === 200) {
                toast.success("Password reset successfully.");
                navigate("/login");
            }
        } catch (error: any) {
            toast.error('An error occurred while resetting password.')
        } finally {
            setIsLoading(false);
        }
    };

    console.log(location)

    return (
        <div className="flex justify-center items-center mt-12 w-full">
            <Card className="w-[400px] bg-[var(--color-background)] sm:mx-5 mx-5">
                <CardHeader>
                    <CardTitle className="text-4xl text-[var(--color-primary)] text-center">
                        Reset Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="new_password"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-0">
                                        <FormLabel className="font-medium text-xs">
                                            New Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex flex-row items-center rounded-md">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder={`${showPassword ? "Password@123" : "********"}`}
                                                    {...field}
                                                    className="placeholder:text-gray-400 border-[#6490BC] "
                                                />
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="ml-2 text-[var(--color-primary)] "
                                                >
                                                    {showPassword ? <EyeOff /> : <Eye />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-0">
                                        <FormLabel className="font-medium text-xs">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl className="relative">
                                            <div className="flex flex-row items-center rounded-md">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder={`${showPassword ? "Password@123" : "********"}`}
                                                    {...field}
                                                    className="placeholder:text-gray-400 border-[#6490BC] "
                                                />
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="ml-2 text-[var(--color-primary)] "
                                                >
                                                    {showPassword ? <EyeOff /> : <Eye />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="bg-[#536489] hover:bg-[var(--color-primary)] text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
