import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/Landing";
import LoginScreen from "@/pages/auth/Login";
import RegisterScreen from "@/pages/auth/Register";
import Navbar from "./components/shared/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
