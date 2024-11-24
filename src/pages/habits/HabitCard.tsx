import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Habit } from "@/utils/types";
import { SquarePen, Trash2 } from "lucide-react";
import { colors } from "@/utils/colors";

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
  return (
    loading ? (
      <div className="animate-pulse flex justify-between bg-softGreen" />
    ) : (
      <Card className="flex justify-between lg:col-span-2 xl:col-span-1 bg-softGreen shadow shadow-green-900">
        <CardHeader className="space-y-0 ">
          <CardTitle className="lg:text-2xl sm:text-xl text-xl">
            {habit.name
            }
          </CardTitle >
          <CardDescription>Goal: {habit.goal}</CardDescription>
        </CardHeader >
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
      </Card >
    )
  );
};

export default HabitCard;
