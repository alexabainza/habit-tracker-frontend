import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "@/redux/user/userSlice";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import { handleAuthError } from "@/utils/errorHandler";

const RegisterScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const isLoading = useSelector((state: any) => state.user.loading);
  // dispatch(resetState());
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm({
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
      const response = await useFetch(
        "/auth/register",
        "post",
        form.getValues()
      );
      const result = response.data;

      if (result.status == 201) {
        toast({
          title: "Registration successful!",
          description: "Redirecting to login...",
        });
        dispatch(signInSuccess(result.data));
        navigate("/login");
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
      <Card className="w-[400px] bg-[var(--color-background)]">
        <CardHeader>
          <CardTitle className="text-4xl text-[var(--color-primary)] text-center">
            Register
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
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel className="font-medium text-xs">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
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
                Already have an account? Login{" "}
                <Link to="/login" className="underline hover:font-bold">
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
                  Register
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterScreen;
