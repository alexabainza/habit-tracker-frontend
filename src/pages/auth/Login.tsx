import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { resetState, signInSuccess } from "@/redux/user/userSlice";
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
import { Link, useNavigate } from "react-router-dom";
import { LoginSchema } from "@/utils/schemas";
import { handleAuthError } from "@/utils/errorHandler";
import { useToast } from "@/hooks/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import Cookies from "js-cookie";

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.user.loading);
  dispatch(resetState());
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async () => {
    try {
      const response = await useFetch("/auth/login", "post", form.getValues());

      const result = response.data;
      if (result.status === 200) {
        dispatch(signInSuccess(result.data));
        
        toast({
          title: "Login successful!",
          description: "Redirecting to dashboard...",
          duration: 1500,
        });

        Cookies.set("token", result.data.token, { expires: 7, secure: true });

        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = handleAuthError(error.response, dispatch);
        toast({
          variant: "destructive",
          title: errorMessage,
        });
      } else {
        toast({
          variant: "destructive",
          title: "An unexpected error occurred.",
          description: "Please try again later.",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center mt-12">
      <Card className="w-[400px] bg-[var(--color-background)] sm:mx-5 mx-5">
        <CardHeader>
          <CardTitle className="text-4xl text-[var(--color-primary)] text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel className="font-medium text-xs">
                      Email/Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        {...field}
                        className="border-[#6490BC] rounded-md placeholder-gray-200" // Add your desired placeholder color here
                      />
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
                    <FormLabel className="font-medium text-xs">
                      Password
                    </FormLabel>
                    <FormControl className="relative">
                      <div className="flex flex-row items-center rounded-md">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          className="placeholder-gray-200 border-[#6490BC] "
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
              <p className="text-xs text-gray-500">
                Don't have an account yet? Register{" "}
                <Link to="/register" className="underline hover:font-bold">
                  here
                </Link>
              </p>
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  Loading{" "}
                </Button>
              ) : (
                <Button
                  className="bg-[#536489] hover:bg-[var(--color-primary)] text-white"
                  type="submit"
                >
                  Login
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
