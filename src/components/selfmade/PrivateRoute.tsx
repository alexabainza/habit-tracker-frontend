import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
export default function PrivateRoute() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/" />;
}
