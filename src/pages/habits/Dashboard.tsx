import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const Dashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  console.log(currentUser);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <main className="p-4">
          <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
