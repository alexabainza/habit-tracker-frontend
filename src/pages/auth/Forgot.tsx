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
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordSchema } from "@/utils/schemas";
import { handleAuthError } from "@/utils/errorHandler";
import { useFetch } from "@/hooks/use-fetch";
import { z } from "zod";
import { toast } from "sonner";

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
        <div className="flex justify-center items-center mt-12 w-full">
            <Card className="w-[400px] bg-[var(--color-background)] sm:mx-5 mx-5">
                <CardHeader>
                    <CardTitle className="text-4xl text-[var(--color-primary)] text-center">
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
                                            <Input
                                                placeholder="johndoe@gmail.com"
                                                {...field}
                                                className="border-[#6490BC] rounded-md placeholder:text-gray-400" // Add your desired placeholder color here
                                            />
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