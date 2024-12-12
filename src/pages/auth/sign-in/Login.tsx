import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();

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
      <Card className="w-[400px] md:w-[500px] sm:mx-5 mx-5 border-0 shadow-none ">
        <CardHeader>
          <img src="/error.svg" alt="logo" className="w-40 h-40 mx-auto" />
          <CardTitle className="text-2xl md:text-4xl text-center">
            Sign In to Continue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
