import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/Landing";
import LoginScreen from "@/pages/auth/Login";
import RegisterScreen from "@/pages/auth/Register";
import Navbar from "@/components/shared/navbar/Navbar";
import Dashboard from "@/pages/dashboard/Dashboard";
import PrivateRoute from "@/components/shared/routing/PrivateRoute";
import GuestRoute from "./components/shared/routing/AuthRedirectRoute";
import Analytics from "@/pages/analytics/Analytics";
import Habits from "@/pages/habits/Habits";
import Profile from "@/pages/profile/Profile";
import { Toaster as Sonner } from "@/components/ui/sonner";

function App() {
  return (
    <main className="min-h-dvh w-full flex justify-between">
      <BrowserRouter>
        <Navbar />
        <Sonner duration={1500} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/analytics" element={<Analytics />} />{" "}
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
