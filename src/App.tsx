import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/Landing";
import LoginScreen from "@/pages/auth/Login";
import RegisterScreen from "@/pages/auth/Register";
import Navbar from "@/components/shared/Navbar";
import Dashboard from "@/pages/habits/Dashboard";
import PrivateRoute from "@/components/selfmade/PrivateRoute";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
