import { RootState } from "@/redux/store";
import React, { useState } from "react";
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
import { joiResolver } from "@hookform/resolvers/joi";
import { habitSchema } from "@/utils/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog open/close
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: joiResolver(habitSchema),
    defaultValues: {
      name: "",
      goal: 0,
    },
    mode: "onSubmit",
  });

  const handleSubmit = async () => {
    console.log(form.getValues());
    try {
      if (currentUser) {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/habits/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form.getValues(),
            userRef: currentUser._id,
          }),
        });
        const data = await res.json();
        if (data.success === false) {
          alert("Habit already exists");

          console.log(data.message);
        } else {
          alert("Habit addde successfully");
          setIsDialogOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
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
                      Frequency
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
