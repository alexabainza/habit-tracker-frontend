import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/Landing";
import LoginScreen from "@/pages/auth/sign-in/Login";
import RegisterScreen from "@/pages/auth/sign-up/Register";
import Navbar from "@/components/shared/navbar/Navbar";
import Dashboard from "@/pages/dashboard/Dashboard";
import PrivateRoute from "@/components/shared/routing/PrivateRoute";
import GuestRoute from "./components/shared/routing/AuthRedirectRoute";
import Analytics from "@/pages/analytics/Analytics";
import Habits from "@/pages/habits/Habits";
import Profile from "@/pages/profile/Profile";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ResetPassword from "./pages/auth/reset-pwd/Reset";
import ForgotPassword from "./pages/auth/forgot-pwd/Forgot";
import Verify from "./pages/auth/verification/Verify";
import Error from "./pages/Error";
import { HabitsProvider } from "./hooks/use-habits";

function App() {
  return (
    <main className="min-h-dvh w-full flex justify-between">
      <BrowserRouter>
        <Sonner duration={1500} />
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/verify-email" element={<Verify />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={
              <HabitsProvider>
                <Dashboard />
              </HabitsProvider>
            } />
            <Route path="/habits" element={
              <HabitsProvider>
                <Habits />
              </HabitsProvider>
            } />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Error />} />
        </Routes>

        {/* Navbar */}
      </BrowserRouter>
    </main>
  );
}

export default App;
