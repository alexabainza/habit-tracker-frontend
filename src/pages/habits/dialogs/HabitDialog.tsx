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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { habitSchema } from "@/utils/schemas";
import { toast } from "sonner";
import { useFetch } from "@/hooks/use-fetch";
import { Habit } from "@/utils/types";

type AddHabitDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onHabitAdded: (habit: Habit) => void;
  initialHabit?: Habit["habit"] | null; // Optional: For editing a habit
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
};

const AddHabitDialog: React.FC<AddHabitDialogProps> = ({
  isOpen,
  setIsOpen,
  onHabitAdded,
  initialHabit = null,
  isEditing = false,
}) => {
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
    if (initialHabit) {
      form.setValue("name", initialHabit.name);
      form.setValue("goal", initialHabit.goal);
      form.setValue("color", initialHabit.color);
    }
  }, [initialHabit, form]);

  const handleSubmit = async () => {
    try {
      const method = isEditing ? "put" : "post";
      const endpoint = isEditing ? "/habits" : "/habits";
      const body = isEditing
        ? { id: initialHabit?._id, ...form.getValues() }
        : form.getValues();

      const response = await useFetch(endpoint, method, body);

      const result = response.data;

      if (result.status === 400) {
        toast.error(result.message);
      } else {
        toast.success(
          isEditing
            ? "Habit updated successfully."
            : "Habit created successfully."
        );
        onHabitAdded(result.data);
        setIsOpen(false);
        form.reset();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error creating or updating habit."
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Habit" : "Add New Habit"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your habit."
              : "Fill out the form to create a new habit."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Habit name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="goal"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Goal (e.g., 7 days)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="color"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Color (e.g., #FF5733)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isEditing ? "Update Habit" : "Create Habit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
