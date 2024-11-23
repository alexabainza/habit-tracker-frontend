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
import { useToast } from "@/hooks/use-toast";
import { Habit } from "@/utils/types";
import HabitCard from "@/pages/habits/HabitCard";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const Habits: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

        if (response.status === 204) {
          toast({ title: "No habits found.", duration: 2000 });
        }
      } catch (error) {
        console.error(error);
        toast({ title: "An error occurred.", variant: "destructive" });
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
        toast({ title: result.message, variant: "destructive" });
      } else {
        toast({ title: "Habit added successfully." });
        setHabits((prevHabits) => [...prevHabits, result.data]);

        setIsDialogOpen(false);
      }
      setLoading(false);
      form.reset();
    } catch (error: any) {
      toast({ title: error.response?.data?.message || "An error occurred." });
    }
  };
  const handleUpdateHabit = async () => {
    if (!habitToUpdate) return;

    setLoading(true);
    try {
      const { name, goal } = form.getValues();
      const response = await useFetch("/habits", "put", {
        id: habitToUpdate._id,
        name,
        goal,
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
      toast({ title: "Habit deleted successfully." });
    } catch (error) {
      toast({ title: "An error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <div className="w-full flex-1 h-full lg:px-16 sm:px-5 px-5 mt-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex lg:flex-row sm:flex-col flex-col sm:gap-4 justify-between">
          <main>
            <h1 className="lg:text-4xl sm:text-3xl text-3xl font-bold mb-4">
              Your habits
            </h1>
          </main>
          <DialogTrigger asChild>
            <Button
              className="px-20 bg-sageGreen text-white hover:bg-mutedGreen"
              onClick={() => {
                setIsDialogOpen(true);
                setIsEditing(false); // Reset isEditing to false
              }}
            >
              <Plus />
              Create New Habit
            </Button>
          </DialogTrigger>
        </div>

        <div className="mt-6 grid gap-4">
          {habits.length === 0 ? (
            <div className="text-center text-gray-500">No habits found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        <DialogContent className="sm:max-w-[400px] py-12 bg-slate-50">
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
                        className="border-[#6490BC] rounded-md placeholder-gray-200" // Add your desired placeholder color here
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
                            className={`px-4 py-1 rounded-full cursor-pointer border-2 border-black ${
                              field.value === value ? "bg-softGreen" : ""
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
  );
};

export default Habits;
