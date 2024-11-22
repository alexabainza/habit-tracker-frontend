import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { formatDate } from "@/utils/dateFormatter";
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
import axios from "axios";
import { resetState } from "@/redux/user/userSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [habits, setHabits] = useState([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [habitToUpdate, setHabitToUpdate] = useState<{
    id: string;
    name: string;
    goal: number;
  } | null>(null);

  const dispatch = useDispatch();
  // dispatch(resetState());
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
        const response = await axios.get("/api/habits");
        const result = response.data;
        setHabits(result.data);
        console.log("Fetched Habits:", result.data); // Log habits here
      } catch (error) {
        alert(error.response.data.message || "An error occurred.");
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
      const response = await axios.post("/api/habits", {
        ...form.getValues(),
        userRef: currentUser!._id,
      });
      const result = response.data;
      if (result.status === 400) {
        alert(result.message);
      } else {
        alert("Habit added successfully");
        setHabits((prevHabits) => [...prevHabits, result.data]);

        setIsDialogOpen(false);
      }
      setLoading(false);
      form.reset();
    } catch (error: any) {
      alert(error.response.data.message || "An error occurred.");
    }
  };
  const handleUpdateHabit = async () => {
    if (!habitToUpdate) return;

    setLoading(true);
    try {
      const { name, goal } = form.getValues();
      const response = await axios.put("/api/habits", {
        id: habitToUpdate.id,
        name,
        goal,
      });

      const updatedHabit = response.data.data; // Assuming updated habit is inside the 'data' field

      console.log("updated habit: ", updatedHabit.created_at);

      // Update the habits state directly with the updated habit data
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
      await axios.delete("/api/habits", { data: { id: habitId } });
      setHabits((prev) => prev.filter((habit) => habit.habit._id !== habitId));
      alert("Habit deleted successfully.");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete the habit.");
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
        {habits.length === 0 ? (
          <div className="text-center text-gray-500">No habits found.</div>
        ) : (
          habits.map((habit, index) => (
            <Card key={index} className="my-2">
              <CardHeader>
                <CardTitle>{habit.habit.name}</CardTitle>
                <CardDescription>Goal: {habit.habit.goal}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <p>Created at: {formatDate(habit.habit.created_at)}</p>
              <p>Modified at: {formatDate(habit.habit.updated_at)}</p> */}

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
                      id: habit.habit._id,
                      name: habit.habit.name,
                      goal: habit.habit.goal,
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
                        className="border-[#6490BC] rounded-md placeholder-gray-200" // Add your desired placeholder color here
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
