import React, { useState } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Habit } from "@/utils/types";
import { DumbbellIcon, SquarePen, Trash2 } from "lucide-react";
import { colors } from "@/utils/colors";
import { Button } from "@/components/ui/button";
import StreakCard from "@/components/custom/StreakCard";

interface HabitCardProps {
  habit: Habit["habit"];
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit["habit"]) => void;
  loading: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onDelete,
  onEdit,
  loading,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => setOpenDialog(false);

  return loading ? (
    <div className="animate-pulse flex justify-between bg-softGreen" />
  ) : (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <Card
          style={{ backgroundColor: habit.color }}
          className={`w-full flex justify-between lg:col-span-2 xl:col-span-1 shadow shadow-green-900 hover:scale-[1.05] transition-all duration-300 ease-in-out overflow-hidden relative hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_black]`}
        >
          <DialogTrigger>
            <CardHeader className="space-y-0 md:max-w-32 lg:max-w-40 group">
              <DumbbellIcon className="w-72 h-72 absolute top-1/2 -right-10 transform -translate-y-2/3 opacity-5" />
              <CardTitle className="lg:text-2xl sm:text-xl text-xl text-ellipsis text-nowrap overflow-hidden w-full">
                {habit.name}
              </CardTitle>
              <CardDescription className="text-left">
                Goal: {habit.goal}
              </CardDescription>
            </CardHeader>
          </DialogTrigger>
          <CardContent className="flex flex-col lg:flex-row justify-center items-center align-middle gap-4 md:gap-2 pb-0">
            <SquarePen
              onClick={() => onEdit(habit)}
              color={colors.mossGreen}
              className="cursor-pointer hover:opacity-30 w-5 z-10"
            />
            <Trash2
              onClick={() => onDelete(habit._id)}
              color="red"
              className="cursor-pointer hover:opacity-30 w-5 z-10"
            />
          </CardContent>
        </Card>
        <DialogContent className="bg-gray-50 flex flex-col justify-center items-center">
          <DialogTitle className="text-2xl">
            Statistics for <strong>{habit.name}</strong>
          </DialogTitle>
          <DialogHeader className="w-full flex md:flex-row items-center gap-3">
            <StreakCard id={habit._id} />
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
      </Dialog>
    </>
  );
};

export default HabitCard;
