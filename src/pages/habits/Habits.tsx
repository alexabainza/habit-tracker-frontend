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
import { LoaderIcon, Plus } from "lucide-react";
import { habitSchema } from "@/utils/schemas";
import { useFetch } from "@/hooks/use-fetch";
import { Habit } from "@/utils/types";
import HabitCard from "@/pages/habits/HabitCard";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import Loading from "@/components/ui/loading";
import { toast } from "sonner";
import { CardColor } from "@/utils/constants";

const Habits: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [habitToUpdate, setHabitToUpdate] = useState<Habit["habit"] | null>(
    null
  );
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const response = await useFetch("/habits", "get");
        const result = response.data;
        setHabits(result.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch habits.");
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  useEffect(() => {
    if (habitToUpdate) {
      form.setValue("name", habitToUpdate.name);
      form.setValue("goal", habitToUpdate.goal);
      form.setValue("color", habitToUpdate.color);
    }
  }, [habitToUpdate, form]);

  const handleSubmit = async () => {
    setLoading(true);
    console.log("form values", form.getValues());

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
        setHabits((prevHabits) => [...prevHabits, result.data]);

        setIsDialogOpen(false);
      }
      setLoading(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating habit.");
      setLoading(false);
    }
  };
  const handleUpdateHabit = async () => {
    if (!habitToUpdate) return;

    setLoading(true);
    console.log(form.getValues());

    try {
      const { name, goal, color } = form.getValues();
      const response = await useFetch("/habits", "put", {
        id: habitToUpdate._id,
        name,
        goal,
        color,
      });

      const updatedHabit = response.data.data;
      setHabits((prevHabits) =>
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
      setHabits((prev) =>
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

  console.log(habits);

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-[#2A3D43] to-[#40575C]">
      <div className="w-full py-12 lg:px-16 sm:px-5 px-5 mt-6 space-y-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="flex lg:flex-row sm:flex-col flex-col sm:gap-4 justify-between">
            <main>
              <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold mb-4 text-lightYellow tracking-wider">
                Your habits
              </h1>
            </main>
            <DialogTrigger asChild>
              <Button
                className="bg-lightYellow text-black hover:bg-lightYellow/90"
                onClick={() => {
                  setIsDialogOpen(true);
                  setIsEditing(false);
                }}
              >
                <Plus className="w-8 h-8" />
                <span className="ml-2">Create Habit</span>{" "}
              </Button>
            </DialogTrigger>
          </div>

          <div className="mt-6 grid gap-4">
            {loading ? (
              <Loading />
            ) : habits.length === 0 ? (
              <div className="text-center text-white">No habits found.</div>
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
                              className={`px-4 py-1 rounded-full cursor-pointer border-2 border-main ${
                                field.value === value
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
                            <label
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
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
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
