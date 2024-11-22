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
import { LoaderIcon } from "lucide-react";
import { habitSchema } from "@/utils/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
import { Habit } from "@/utils/types";

const Dashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [habitToUpdate, setHabitToUpdate] = useState<Habit["habit"] | null>(
    null
  );

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
        userRef: currentUser?.user._id, // Access _id properly here
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

      alert("Habit updated successfully.");
      setIsDialogOpen(false);
      setHabitToUpdate(null);
      form.reset();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error updating habit.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (habitId: string) => {
    setLoading(true);
    try {
      await useFetch("/habits", "delete", { id: habitId });
      setHabits((prev) => prev.filter((habit) => habit.habit._id !== habitId));
      toast({ title: "Habit deleted successfully." });
    } catch (error: any) {
      toast({
        title: "An error occurred.",
        description: error.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="items-start lg:px-16 sm:px-5 px-5 ">
      <div className="flex-1 flex flex-col">
        <main>
          <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        </main>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              setIsDialogOpen(true);
              setIsEditing(false); // Reset isEditing to false
            }}
          >
            Add Habit
          </Button>
        </DialogTrigger>
        {!habits || habits.length === 0 ? (
          <div className="text-center text-gray-500">No habits found.</div>
        ) : (
          habits.map((habit, index) => (
            <Card key={index} className="my-2">
              <CardHeader>
                <CardTitle>{habit.habit.name}</CardTitle>
                <CardDescription>Goal: {habit.habit.goal}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(habit.habit._id)}
                  disabled={loading}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setHabitToUpdate({
                      _id: habit.habit._id,
                      name: habit.habit.name,
                      goal: habit.habit.goal,
                      user_id: habit.habit.user_id || "",
                      deleted_at: habit.habit.deleted_at || null,
                      created_at: habit.habit.created_at || "",
                      updated_at: habit.habit.updated_at || "",
                    });

                    setIsEditing(true);
                    setIsDialogOpen(true);
                  }}
                >
                  Update
                </Button>
              </CardContent>
            </Card>
          ))
        )}

        <DialogContent className="sm:max-w-[400px] bg-slate-50">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Update Habit" : "Add Habit"}
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
                    <FormLabel className="font-medium text-xs">
                      Habit name
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
                name="goal"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-0">
                    <FormLabel className="font-medium text-xs">
                      Frequency per week
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="shadcn"
                        {...field}
                        className="border-[#6490BC] rounded-md placeholder-gray-200"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                className="hover:bg-[var(--color-primary)] hover:text-white"
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

export default Dashboard;
