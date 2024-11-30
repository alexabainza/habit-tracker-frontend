import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import Loading from "@/components/ui/loading";
import { Check, Pencil, X } from "lucide-react";

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
    <div className="w-full bg-gradient-to-br from-[#2A3D43] to-[#40575C]">
      <div className="lg:px-16 sm:px-5 px-5 space-y-4 m-auto items-center justify-center mt-6 py-12">
        <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold text-lightYellow tracking-wider ">
          Profile
        </h1>
        <hr className="border-gray-400 border-t-2 opacity-80 py-2" />
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col mt-12">
            <div className="flex gap-2 pb-4 w-full">
              <div className="lg:px-8 sm:px-2 px-2">
                <div className="lg:h-[180px] lg:w-[180px] sm:w-[100px] sm:h-[100px] w-[100px] h-[100px] bg-[#5B838A] rounded-2xl flex justify-center items-center text-white lg:text-2xl sm:text-lg text-lg font-bold ">
                  {user?.username.slice(0, 2).toUpperCase()}
                </div>
              </div>

              {isEditing ? (
                <div className="flex flex-row align-middle w-5/6 items-center">
                  <Form {...form}>
                    <form
                      className="flex lg:flex-row sm:flex-col flex-col border-red-200 w-[100%] gap-2"
                      onSubmit={handleUpdateProfile}
                    >
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-0">
                            <FormControl>
                              <Input
                                placeholder="Habit name"
                                {...field}
                                className="border-gray-200 rounded-md placeholder-gray-200 text-white lg:h-12 md:h-12 sm:h-10 h-10 lg:text-2xl sm:text-lg text-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400" />
                          </FormItem>
                        )}
                      />

                      <div className="flex lg:justify-center sm:justify-start justify-start lg:gap-4 sm:gap-2 gap-2 items-center lg:w-1/6 sm:w-full w-full">
                        <Button
                          type="submit"
                          disabled={loading}
                          variant="outline"
                          className="border-green-300 border-2 text-green-300 hover:bg-green-300 hover:text-main rounded-full lg:h-12 lg:w-12 sm:h-8 sm:w-8 h-8 w-8"
                        >
                          <Check size={30} />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-red-200 border-2 text-red-200 hover:bg-red-200 hover:text-main rounded-full lg:h-12 lg:w-12 sm:h-8 sm:w-8 h-8 w-8"
                          onClick={() => {
                            form.reset({ username: user?.username });
                            setIsEditing(false);
                          }}
                        >
                          <X size={30} />{" "}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              ) : (
                <div className="flex justify-between w-5/6 space-y-2 ">
                  <div className="flex flex-col align-middle justify-center">
                    <p className="font-semibold lg:text-4xl sm:text-xl text-xl text-lightYellow">
                      {user?.username}
                    </p>
                    <p className="text-muted-foreground lg:text-xl sm:text-sm text-sm text-white italic">
                      {user?.email}
                    </p>
                  </div>
                  <div className="flex lg:justify-end items-center">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="rounded-full text-white hover:bg-white hover:text-main lg:px-8 sm:px-2 px-2 border lg:text-lg lg:py-2 sm:text-sm sm:py-2 text-sm py-2 flex items-center gap-2"
                    >
                      <span className="lg:hidden">
                        <Pencil className="w-5 h-5" />{" "}
                      </span>
                      <span className="hidden lg:inline">EDIT PROFILE</span>{" "}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <section className="space-y-4">
              <hr className="border-gray-400 border-t-2 opacity-80 mt-4" />
              <h1 className="lg:text-3xl sm:text-2xl text-lg font-bold text-lightYellow tracking-wider lg:pt-8">
                Profile Settings
              </h1>

              <Card className="text-white">
                <CardContent className="lg:py-6 sm:py-4 py-4 lg:px-6 sm:px-4 px-4 space-y-1 flex justify-between">
                  <div className="w-2/3 pe-4">
                    <CardTitle className="lg:text-lg sm:text-sm text-sm">
                      DELETE YOUR ACCOUNT
                    </CardTitle>
                    <CardDescription className="sm:text-xs text-xs">
                      Once you delete your profile, there is no going back.
                      Please be certain.
                    </CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="lg:w-[200px] sm:w-[100px] w-[100px] border border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                        DELETE<span className="hidden lg:inline">ACCOUNT</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={confirmDelete}
                          className="bg-red-600 text-white hover:bg-red-500"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
              <Card className="text-white">
                <CardContent className="lg:py-6 sm:py-4 py-4 lg:px-6 sm:px-4 px-4 space-y-1 flex justify-between">
                  <div className="w-2/3 pe-4">
                    <CardTitle className="lg:text-lg sm:text-sm text-sm">
                      LOGOUT
                    </CardTitle>
                    <CardDescription className="sm:text-xs text-xs">
                      Logout of your account
                    </CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="lg:w-[200px] sm:w-[100px] w-[100px] border border-blue-300 text-blue-300 hover:bg-blue-300 hover:text-white">
                        LOGOUT<span className="hidden lg:inline">ACCOUNT</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to logout?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onSignOut}
                          className="bg-black text-white hover:bg-gray-700"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
