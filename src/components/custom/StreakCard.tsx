import { StreakCardProps } from "@/utils/types";
import React from "react";

const StreakCard: React.FC<StreakCardProps> = ({ amount, label }) => {
  return (
    <div className="flex flex-col w-[200px] h-[200px] bg-white border py-8 border-gray-300 rounded-lg items-center justify-center gap-4 align-middle">
      <span className="text-5xl font-extrabold">{amount}</span>
      <span className="text-sm font-medium text-sageGreen">{label}</span>
    </div>
  );
};

export default StreakCard;
