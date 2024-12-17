"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader2Icon, LogInIcon } from "lucide-react"
import { useState } from "react"
import { OtpSchema } from "@/utils/schemas"
import { useFetch } from "@/hooks/use-fetch"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { resetState, signInSuccess } from "@/redux/user/userSlice"
import { useNavigate } from "react-router-dom"
import { handleAuthError } from "@/utils/errorHandler"

export function InputOTPForm({ email }: { email: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    dispatch(resetState());

    const form = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            email,
            otp: "",
        },
    });

    async function onSubmit() {
        try {
            setIsLoading(true);

            const response = await useFetch("/auth/verify-otp", "post", form.getValues());
            const result = response.data;

            if (result.status === 200) {
                toast.success(result.message);
                dispatch(signInSuccess(result.data));
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center justify-center gap-5">
                            <FormLabel className="md:text-xl">One-Time Password</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    {Array.from({ length: 6 }).map((_, index: number) => (
                                        <InputOTPGroup key={index}>
                                            <InputOTPSlot index={index} className="rounded-md" />
                                            {index < 5 && <InputOTPSeparator className="-mr-2" />}
                                        </InputOTPGroup>
                                    ))}
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Please enter the one-time password sent to your email.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full py-6 border border-white transition-all duration-300 text-white hover:bg-white/85 hover:text-black hover:border-transparent"
                    disabled={isLoading}
                >
                    {isLoading ? <><Loader2Icon className="animate-spin" /> Loading</> : <><LogInIcon className="flex-shrink-0 w-5 h-5" />Login</>}
                </Button>
            </form>
        </Form>
    )
}
