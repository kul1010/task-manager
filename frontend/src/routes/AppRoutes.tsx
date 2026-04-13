import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import Dashboard from "../components/Dashboard";

interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export default function AppRoutes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<UserPayload | null>(null);

  function handleLogin(token: string, userData: UserPayload) {
    setUser(userData);
    navigate("/dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          token && user ? (
            <Dashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}