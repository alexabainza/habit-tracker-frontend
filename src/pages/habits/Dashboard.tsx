import { RootState } from "@/redux/store";
import React, { useState } from "react";
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
// import { resetState } from "@/redux/user/userSlice";

const Dashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const dispatch = useDispatch();
  // dispatch(resetState());
  const form = useForm({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      goal: 0,
    },
    mode: "onSubmit",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/habits/", {
        ...form.getValues(),
        userRef: currentUser!._id,
      });
      const result = response.data;
      if (result.status === 400) {
        alert(result.message);
      } else {
        alert("Habit added successfully");
        setIsDialogOpen(false);
      }
      setLoading(false);
      form.reset();
    } catch (error: any) {
      alert(error.response.data.message || "An error occurred.");
    }
  };

  return (
    <div>
      <div className="flex-1 flex flex-col">
        <main className="p-4">
          <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        </main>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Add Habit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-slate-50">
          <DialogHeader>
            <DialogTitle>Add habit</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Enter the details for your new habit.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
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
                ) : (
                  "Add habit"
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
