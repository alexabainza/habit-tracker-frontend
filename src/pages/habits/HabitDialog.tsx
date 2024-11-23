import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema } from "@/utils/schemas";
import { Habit } from "@/utils/types";

interface HabitDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  habitToUpdate: Habit["habit"] | null;
  handleSubmit: () => Promise<void>;
  handleUpdateHabit: () => Promise<void>;
  loading: boolean;
}

const HabitDialog: React.FC<HabitDialogProps> = ({
  isOpen,
  setIsOpen,
  isEditing,
  habitToUpdate,
  handleSubmit,
  handleUpdateHabit,
  loading,
}) => {
  const form = useForm({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      goal: 0,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (habitToUpdate) {
      form.setValue("name", habitToUpdate.name);
      form.setValue("goal", habitToUpdate.goal);
    }
  }, [habitToUpdate, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[400px] py-12 bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-3xl">
            {isEditing ? "Update Habit" : "Create New Habit"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {isEditing
            ? "Edit the details of your habit."
            : "Enter the details for your new habit."}
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
  );
};

export default HabitDialog;
