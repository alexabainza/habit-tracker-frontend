import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Habit } from "@/utils/types";
import { SquarePen, Trash2 } from "lucide-react";
import { colors } from "@/utils/colors";
import { Button } from "@/components/ui/button";
import StreakCard from "@/components/custom/StreakCard";

interface HabitCardProps {
  habit: Habit["habit"];
  streak: number;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit["habit"]) => void;
  loading: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  streak,
  onDelete,
  onEdit,
  loading,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => setOpenDialog(false);
  useEffect(() => {
    console.log(habit, "habit");
  }, []);
  return loading ? (
    <div className="animate-pulse flex justify-between bg-softGreen" />
  ) : (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger>
          <Card className="flex justify-between lg:col-span-2 xl:col-span-1 bg-softGreen shadow shadow-green-900">
            <CardHeader className="space-y-0 max-w-32 ">
              <CardTitle className="lg:text-2xl sm:text-xl text-xl text-ellipsis text-nowrap overflow-hidden w-full">
                {habit.name}
              </CardTitle>
              <CardDescription>Goal: {habit.goal}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center align-middle gap-4">
              <Trash2
                onClick={() => onDelete(habit._id)}
                color="red"
                size={20}
                className="cursor-pointer hover:opacity-30"
              />
              <SquarePen
                onClick={() => onEdit(habit)}
                size={20}
                color={colors.mossGreen}
                className="cursor-pointer hover:opacity-30"
              />
            </CardContent>
          </Card>
          <DialogContent className="bg-gray-50 flex flex-col justify-center items-center">
            <DialogTitle className="text-2xl">
              Statistics for {habit.name}
            </DialogTitle>
            <DialogHeader>
              <DialogDescription className="grid grid-cols-2 gap-4">
                <StreakCard amount={streak} label="Longest streak" />
                <StreakCard amount={streak} label="Current streak" />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseDialog}
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogTrigger>
      </Dialog>
    </>
  );
};

export default HabitCard;
