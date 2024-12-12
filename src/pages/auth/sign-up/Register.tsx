import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserSchema } from "@/utils/schemas";
import {
  ChevronLeftIcon,
  CircleFadingPlusIcon,
  Eye,
  EyeOff,
  KeyIcon,
  Loader2,
  UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/use-fetch";
import { handleAuthError } from "@/utils/errorHandler";
import { z } from "zod";
import { toast } from "sonner";
import { MdMail } from "react-icons/md";

const RegisterScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<z.infer<typeof RegisterUserSchema>>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await useFetch(
        "/auth/register",
        "post",
        form.getValues()
      );
      const result = response.data;

      if (result.status == 201) {
        toast.success("Registration successful.");
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = handleAuthError(error.response, dispatch);
        toast.error(errorMessage);
      } else {
        toast.error("Failed to register.");
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
        variant="link"
      >
        <ChevronLeftIcon className="w-6 h-6" />
        Back to Home
      </Button>
      <Card className="w-[400px] md:w-[500px] sm:mx-5 mx-5 border-0 shadow-none">
        <CardHeader>
          <img src="/error.svg" alt="logo" className="w-40 h-40 mx-auto" />
          <CardTitle className="text-2xl md:text-4xl text-center">
            Join our Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel className="font-medium text-xs">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="w-5 h-5 absolute top-1/2 left-2 transform -translate-y-1/2" />
                        <Input
                          placeholder="John Doe"
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
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel className="font-medium text-xs">Email</FormLabel>
                    <FormControl className="relative">
                      <div className="relative">
                        <MdMail className="w-5 h-5 absolute top-1/2 left-2 transform -translate-y-1/2" />
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
                    <FormLabel className="font-medium text-xs">
                      Password
                    </FormLabel>
                    <FormControl className="relative">
                      <div className="flex flex-row items-center rounded-md">
                        <KeyIcon className="w-5 h-5 absolute top-1/2 left-2 transform -translate-y-1/2" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={`${showPassword ? "Password@123" : "********"
                            }`}
                          {...field}
                          className="placeholder:text-gray-400 border-[#6490BC] pl-9"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="ml-2 absolute right-3 w-5"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />
              <p className="text-xs text-gray-300">
                Already have an account? Login{" "}
                <Link to="/login" className="underline hover:font-bold">
                  here
                </Link>
              </p>
              <Button
                type="submit"
                className="relative w-full py-6 border border-white transition-all duration-300 text-white hover:bg-white/85 hover:text-black hover:border-transparent"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Loading
                  </>
                ) : (
                  <><CircleFadingPlusIcon className="flex-shrink-0 w-5 h-5" />Register</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterScreen;
