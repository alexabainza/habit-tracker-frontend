import { Habit } from "@/utils/types";
import { Dumbbell } from "lucide-react";
import React from "react";

const ChallengeCard: React.FC<{
  habit: Habit["habit"];
  checked: boolean;
  onCheck: (id: string, checked: boolean) => void;
}> = ({ habit, checked, onCheck }) => {
  return (
    <div className="flex flex-1 bg-white border py-4 border-gray-300 rounded-2xl px-8 gap-4 align-middle justify-between">
      <div className="flex gap-4 items-center">
        <Dumbbell />
        <span className="text-xl font-medium">{habit.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          id={habit._id}
          checked={checked}
          onChange={(e) => onCheck(habit._id, e.target.checked)}
          className="hidden"
        />
        <label
          htmlFor={habit._id}
          className={`cursor-pointer w-6 h-6 rounded-lg ${
            checked ? "bg-sageGreen" : "bg-gray-200"
          } flex items-center justify-center`}
        >
          {checked && <span className="text-white font-bold">✔</span>}
        </label>
      </div>
    </div>
  );
};

export default ChallengeCard;
