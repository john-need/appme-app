import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/home-page";
import AboutPage from "../pages/about-page";
import LoginForm from "../components/login-form/login-form";
import { useIsAuthenticated } from "../hooks";

export default function AppRouter() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
    </Routes>
  );
}
