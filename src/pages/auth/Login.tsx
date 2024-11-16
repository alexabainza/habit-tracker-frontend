import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "@/redux/user/userSlice";
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
import { userSchema } from "@/utils/schemas";

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.user.loading);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm({
    resolver: joiResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
  });

  function onSubmit(data: any) {
    dispatch(signInStart());
    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: data.username,
        password: data.password,
      }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (result.status === 200) {
          dispatch(signInSuccess(result.data));
          alert("Login successful!");
          localStorage.setItem("token", result.data);
          navigate("/dashboard");
        } else {
          if (result.status === 404) {
            dispatch(signInFailure(result.message));
            alert("User does not exist. Please register.");
          } else if (result.error === "Invalid credentials") {
            dispatch(signInFailure(result.message));
            alert("Invalid credentials. Please try again.");
          } else {
            dispatch(signInFailure(result.message));
            alert(result.message || "An error occurred. Please try again.");
          }
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("Something went wrong. Please try again later.");
      });
  }

  return (
    <div className="flex justify-center items-center mt-12">
      <Card className="w-[400px] bg-[var(--color-background)]">
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
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel className="font-medium text-xs">
                      Username / Email
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
