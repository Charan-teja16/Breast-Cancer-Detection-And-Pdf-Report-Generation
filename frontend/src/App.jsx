import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Result from "./pages/Result";
import VerifyOtp from "./pages/VerifyOtp";

function AppLayout() {
  const location = useLocation();
  const isVerified = localStorage.getItem("isVerified") === "true";

  // ✅ hide Navbar on login & register
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* default route → login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route
          path="/upload"
          element={isVerified ? <Upload /> : <Navigate to="/login" />}
        />
        <Route
          path="/predict"
          element={isVerified ? <Upload /> : <Navigate to="/login" />}
        />
        <Route
          path="/result"
          element={isVerified ? <Result /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;