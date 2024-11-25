import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "@/redux/user/userSlice";
import { useFetch } from "@/hooks/use-fetch";
import { User } from "@/utils/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserSchema } from "@/utils/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      username: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await useFetch("/profile", "get");
        const result = response.data;
        form.setValue("username", result.data.username);
        setUser(result.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await useFetch("/profile", "delete");
      dispatch(signOutUserStart());

      if (response.status === 200) {
        toast.success("Account deleted successfully.");
      }
      dispatch(signOutUserSuccess());

      navigate("/login");
    } catch (error) {
      toast.error("Failed to delete account.");
    } finally {
      setLoading(false);
      navigate("/login");
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

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { username } = form.getValues();
      const response = await useFetch("/profile", "put", {
        username,
      });

      if (response.status === 200) {
        setUser((prevUser) => ({
          ...prevUser,
          username,
        }));
        toast.success("Profile updated successfully.");
      }
    } catch (error: any) {
      toast.error("Failed to update profile.");
    } finally {
      setIsEditing(false);
      setLoading(false);
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
              <p className="font-semibold text-lg">{user?.username}</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <hr className="w-full pb-2 border-gray-400" />

          {isEditing ? (
            <>
              <Form {...form}>
                <form className="space-y-2" onSubmit={handleUpdateProfile}>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-0">
                        <FormControl>
                          <Input
                            placeholder="Habit name"
                            {...field}
                            className="border-[#6490BC] rounded-md placeholder-gray-200" // Add your desired placeholder color here
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-400" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="outline"
                      className=" border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className=" border-black hover:bg-black hover:text-white"
                      onClick={() => {
                        form.reset({ username: user?.username });
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
              >
                EDIT PROFILE
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                    DELETE ACCOUNT
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full border-2 border-black text-black hover:bg-black hover:text-white">
                    LOGOUT
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Logout </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onSignOut}
                      className="border-black text-black hover:bg-black hover:text-white border-1"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
