import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft, ChevronRight, LoaderIcon, Plus } from "lucide-react";
import { habitSchema } from "@/utils/schemas";
import { useFetch } from "@/hooks/use-fetch";
import { Habit } from "@/utils/types";
import HabitCard from "@/pages/habits/HabitCard";
import ConfirmationDialog from "@/pages/habits/dialogs/ConfirmationDialog";
import { toast } from "sonner";
import { CardColor } from "@/utils/constants";
import { Label } from "@/components/ui/label";
import { useHabits } from "@/hooks/use-habits";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";

const Habits: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const {
    habits,
    error,
    loading,
    numHabits,
    habitStates,
    setLoading,
    setHabits,
    setHabitStates,
    setWeeklyCounts,
    setNumHabits,
    handleCheck,
    setError,
  } = useHabits();

  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(searchParams.get("page") ? parseInt(searchParams.get("page") || "1") : 1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [habitToUpdate, setHabitToUpdate] = useState<Habit["habit"] | null>(
    null
  );
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await useFetch(`/habits?page=${page}&limit=${limit}`, 'get');
        const result = response.data.data;
        if (result.data && result.data.length > 0) {
          setHabits(result.data);
          setNumHabits(result.total);

          const states: { [key: string]: boolean } = {};
          const counts: { [key: string]: number } = {};

          result.data.forEach((habit: Habit) => {
            states[habit.habit._id] = habit.accomplished;
            counts[habit.habit._id] = habit.weeklyCount;
          });

          setHabitStates(states);
          setWeeklyCounts(counts);
          setTotalPages(response.data.data.totalPages);
        } else {
          console.log(result.data.length > 0);
          setHabits([]);
          setNumHabits(0);
          setHabitStates({});
          setWeeklyCounts({});
        }
      } catch (error: any) {
        setHabits([]);
        setNumHabits(0);
        setHabitStates({});
        setWeeklyCounts({});
        setError({
          message: error.response?.data?.message || error.message,
          status: error.response?.status || "500",
        });
      } finally {
        setLoading(false);
      }
    };

    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, page: page.toString() });
    fetchHabits();
  }, [page]);

  const form = useForm({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      goal: 0,
      color: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (habitToUpdate) {
      form.setValue("name", habitToUpdate.name);
      form.setValue("goal", habitToUpdate.goal);
      form.setValue("color", habitToUpdate.color);
    }
  }, [habitToUpdate, form]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await useFetch("/habits", "post", {
        ...form.getValues(),
        userRef: currentUser?.user._id,
      });
      const result = response.data;
      if (result.status === 400) {
        toast.error(result.message);
      } else {
        toast.success("Habit created successfully.");
        setHabits((prevHabits: Habit[]) => [...prevHabits, result.data]);

        setIsDialogOpen(false);
      }
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating habit.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHabit = async () => {
    if (!habitToUpdate) return;

    setLoading(true);

    try {
      const { name, goal, color } = form.getValues();
      const response = await useFetch("/habits", "put", {
        id: habitToUpdate._id,
        name,
        goal,
        color,
      });

      const updatedHabit = response.data.data;
      setHabits((prevHabits: Habit[]) =>
        prevHabits.map((habit) =>
          habit.habit._id === updatedHabit._id
            ? { ...habit, habit: updatedHabit }
            : habit
        )
      );
      setIsDialogOpen(false);
      setHabitToUpdate(null);
      toast.success("Habit updated successfully.");
      form.reset();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error updating habit.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (habitId: string) => {
    setHabitToDelete(habitId);
    setIsDeleteDialogOpen(true); // Open confirmation dialog
  };

  const confirmDelete = async () => {
    if (!habitToDelete) return;

    setLoading(true);
    try {
      await useFetch("/habits", "delete", { id: habitToDelete });
      setHabits((prev: Habit[]) =>
        prev.filter((habit) => habit.habit._id !== habitToDelete)
      );
      toast.success("Habit deleted successfully.");
    } catch (error) {
      toast.error("Error deleting habit.");
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  console.log(loading)

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-[#2A3D43] to-[#40575C] relative overflow-hidden">
      <div className="w-full py-12 lg:px-16 sm:px-5 px-5 space-y-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="flex gap-4 justify-between">
            <section className="w-full flex flex-col items-end justify-between">
              <h1 className="w-full lg:text-4xl sm:text-3xl text-2xl font-bold text-lightYellow tracking-wider ">
                Your Habits
              </h1>
              {totalPages > 1 && (
                <div className="md:hidden w-full flex md:justify-end items-center md:gap-4 mt-4 text-lightYellow gap-4">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(Math.max(page - 1, 1))}
                  >
                    <ChevronLeft className="flex-shrink-0 w-5 h-5" />
                    <span>Previous</span>
                  </Button>
                  <span>
                    {page} of {totalPages}
                  </span>
                  <Button
                    disabled={page === totalPages}
                    onClick={() => setPage(Math.min(page + 1, totalPages))}
                  >
                    <span>Next</span>
                    <ChevronRight className="flex-shrink-0 w-5 h-5" />
                  </Button>
                </div>
              )}
            </section>
            <DialogTrigger asChild>
              <Button
                className="h-16 w-16 md:h-12 md:w-fit bg-lightYellow text-black hover:bg-yellow-500 fixed bottom-5 right-5 md:bottom-0 md:right-0 md:relative rounded-full md:rounded-md shadow-md shadow-neutral-900 z-50"
                onClick={() => {
                  setIsDialogOpen(true);
                  setIsEditing(false);
                }}
              >
                <Plus className="w-12 h-12 flex-shrink-0" />
                <span className="ml-1 hidden md:block ">Create Habit</span>
              </Button>
            </DialogTrigger>
          </div>

          <div className="mt-6 grid gap-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 w-full mt-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-24 lg:col-span-2 xl:col-span-1 bg-innermostCard" />
                ))}
              </div>
            ) : habits.length === 0 ? (
              <div className="space-y-8 mt-28">
                <img src="/error.svg" alt="No habits found" className="w-96 object-cover mx-auto" />
                <p className="text-white text-center text-xl md:text-3xl font-bold">No habits found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.habit._id}
                    habit={habit.habit}
                    onDelete={() => handleDelete(habit.habit._id)}
                    onEdit={(habit) => {
                      setHabitToUpdate(habit);
                      setIsEditing(true);
                      setIsDialogOpen(true);
                    }}
                    loading={loading}
                  />
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="w-full max-w-5xl hidden md:flex justify-center items-center gap-4 text-lightYellow mx-auto md:fixed bottom-5 left-1/2 transform -translate-x-1/2">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(Math.max(page - 1, 1))}
                >
                  <ChevronLeft className="flex-shrink-0 w-5 h-5" />
                  <span>Previous</span>
                </Button>
                <span>
                  {page} of {totalPages}
                </span>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(Math.min(page + 1, totalPages))}
                >
                  <span>Next</span>
                  <ChevronRight className="flex-shrink-0 w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
          <ConfirmationDialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            title="Confirm Delete"
            description="Are you sure you want to delete this habit?"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={confirmDelete}
            isDestructive={true}
          />
          <DialogContent className="sm:max-w-[400px] py-12 bg-slate-200">
            <DialogHeader>
              <DialogTitle className="text-3xl">
                {isEditing ? "Update Habit" : "Create New Habit"}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              {isEditing
                ? "Edit the details of your habit."
                : "Enter the details for your new habit."}{" "}
            </DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  isEditing ? handleUpdateHabit : handleSubmit
                )}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-0">
                      <FormControl>
                        <Input
                          placeholder="Habit name"
                          {...field}
                          className="border-[#6490BC] rounded-md placeholder-gray-200"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-0">
                      <FormLabel className="font-bold text-xs text-deepOlive">
                        Repetitions per week
                      </FormLabel>
                      <FormControl>
                        <div className="flex justify-between">
                          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                            <label
                              key={value}
                              className={`px-4 py-1 rounded-full cursor-pointer border-2 border-main ${field.value === value
                                ? "bg-main text-white"
                                : ""
                                }`}
                            >
                              <input
                                type="radio"
                                {...field}
                                value={value}
                                checked={field.value === value}
                                onChange={() => field.onChange(value)}
                                className="hidden"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </FormControl>

                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-0">
                      <FormLabel className="font-bold text-xs text-deepOlive">
                        Set card color
                      </FormLabel>
                      <FormControl>
                        <div className="flex justify-evenly">
                          {Object.entries(CardColor).map(([key, value]) => (
                            <Label
                              key={key}
                              className={`relative w-10 h-10 rounded-full cursor-pointer border border-main`}
                              style={{ backgroundColor: value }}
                            >
                              <input
                                type="radio"
                                {...field}
                                value={value}
                                checked={field.value === value}
                                onChange={() => {
                                  field.onChange(value); // Update the form state
                                }}
                                className="hidden "
                              />
                              {field.value === value && (
                                <span
                                  className="absolute inset-0 flex items-center justify-center text-main font-bold text-xl"
                                  style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                    borderRadius: "50%",
                                  }}
                                >
                                  ✓
                                </span>
                              )}
                            </Label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-400">
                        {form.formState.errors.color?.message}
                      </FormMessage>{" "}
                    </FormItem>
                  )}
                />

                <Button
                  className="bg-sageGreen hover:bg-mutedGreen w-full text-white text-sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-x-1.5">
                      <LoaderIcon className="w-6 h-6 animate-spin" />
                      Loading...
                    </div>
                  ) : isEditing ? (
                    "Update Habit"
                  ) : (
                    "Add Habit"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Habits;
