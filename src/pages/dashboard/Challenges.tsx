import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/use-fetch";
import { Habit } from "@/utils/types";
import { Dumbbell, LoaderIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ChallengeCard: React.FC<{
  habit: Habit["habit"];
  checked: boolean;
  onCheck: (id: string, checked: boolean) => void;
  className?: string;
}> = ({ habit, checked, onCheck, className }) => {
  const [loading, setLoading] = useState(false);

  const updateAccomplishedStatus = async () => {
    setLoading(true);
    try {
      const response = await useFetch(
        `/habits/acc/${habit._id.toString()}`,
        "put"
      );
      if (response.status === 204) {
        toast.error("The data does not exist!");
        return;
      }
    } catch (error) {
      toast.error("Did not update habit. Reverting...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-1 bg-white border py-4 border-gray-300 rounded-2xl px-8 gap-4 align-middle justify-between transform transition-transform duration-500 ease-in-out ${className}`}
    >
      <div className="flex gap-4 items-center">
        <Dumbbell />
        <span className="text-xl font-medium">{habit.name}</span>
      </div>
      <div className="flex items-center gap-4">
        {loading ? (
          <LoaderIcon className="flex-shrink-0 w-6 h-6 animate-spin" />
        ) : (
          <>
            <Input
              type="checkbox"
              id={habit._id}
              checked={checked}
              onChange={(e) => {
                onCheck(habit._id, e.target.checked)
                updateAccomplishedStatus();
              }}
              disabled={loading}
              className="hidden"
            />
            <label
              htmlFor={habit._id}
              className={`cursor-pointer w-6 h-6 rounded-lg ${checked ? "bg-sageGreen" : "bg-gray-200"
                } flex items-center justify-center`}
            >
              {checked && <span className="text-white font-bold">✔</span>}
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
