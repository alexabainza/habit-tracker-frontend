import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from "react-redux";
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
import { ChevronLeftIcon, Eye, EyeOff, Loader2, MountainIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LoginSchema } from "@/utils/schemas";
import { handleAuthError } from "@/utils/errorHandler";
import { useFetch } from "@/hooks/use-fetch";
import { z } from "zod";
import { toast } from "sonner";

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
        dispatch(signInSuccess(result.data));

        toast.success("Login successful.");
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
      <Button
        className="absolute top-5 left-5 text-white"
        onClick={() => navigate("/")}
        variant='link'
      >
        <ChevronLeftIcon className="w-6 h-6" />
        Back to Home
      </Button>
      <Card className="w-[400px] sm:mx-5 mx-5 border-0 shadow-none ">
        <CardHeader>
          <CardTitle className="text-4xl text-center">
            <MountainIcon className="w-20 h-20 mx-auto mb-20" />
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
                    <FormLabel className="uppercase font-medium text-xs space-x-1.5">
                      <strong>Email</strong>
                      <span className="lowercase">or</span>
                      <strong>Username</strong>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel className="uppercase font-bold text-xs">
                      Password
                    </FormLabel>
                    <FormControl className="relative">
                      <div className="flex flex-row items-center rounded-md relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={`${showPassword ? "Password@123" : "********"}`}
                          {...field}
                          className="placeholder:text-gray-400 border-[#6490BC] "
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
                className=" w-full py-6 border border-white transition-all duration-300 text-white hover:bg-white/85 hover:text-black hover:border-transparent"
                disabled={isLoading}
              >
                {isLoading ? <><Loader2 className="animate-spin" /> Loading</> : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
