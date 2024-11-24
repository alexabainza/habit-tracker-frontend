"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "@/redux/user/userSlice";
import { useFetch } from "@/hooks/use-fetch";
import { User } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/redux/store";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    console.log(currentUser.token);

    try {
      await useFetch("/profile", "delete");
      toast({ title: "User deleted successfully" });
    } catch (error) {
      toast({ title: "An error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
      navigate("/register");
    }
  };
  const onSignOut = async () => {
    dispatch(signOutUserStart());

    try {
      const response = await useFetch("/auth/logout", "post");
      const result = response.data;

      if (result.status === 200) {
        dispatch(signOutUserSuccess());
        navigate("/login");
      } else {
        const data = await result.json();
        dispatch(signOutUserFailure(data.message || "Logout failed"));
      }
    } catch (error: any) {
      dispatch(
        signOutUserFailure(error.message || "An unexpected error occurred")
      );
    }
  };
  return (
    <div className="w-full py-12 flex-1 h-full lg:px-16 sm:px-5 px-5 mt-6 space-y-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="border text-2xl">
                {user?.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-lg">
                {currentUser?.user.username}
              </p>
              <p className="text-muted-foreground">{currentUser?.user.email}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            onClick={() => setIsEditing(true)}
            className="w-full border-2 border-blue-700 text-blue-700"
          >
            EDIT PROFILE
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full border-red-600 text-red-600 border-2 hover:bg-red-600 hover:text-white">
                DELETE ACCOUNT
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-400"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <br />
          <hr className="w-full pb-2 border-gray-400" />

          <Button
            onClick={onSignOut}
            variant="outline"
            className="w-full hover:bg-black hover:text-white"
          >
            LOGOUT
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
