import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TimeEntriesPage from "@/pages/time-entries-page";
import ActivitiesPage from "@/pages/activities-page";
import LoginForm from "@/components/login-form/login-form";
import { useIsAuthenticated } from "@/hooks";
import PreferencesPage from "@/pages/preferences-page";
import DashboardPage from "@/pages/dashboard-page";
import PomodoroPage from "@/pages/pomodoro-page";

export default function AppRouter() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Routes>
      <Route path="/" element={<TimeEntriesPage />} />
      <Route path="/pomodoro" element={<PomodoroPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/preferences" element={<PreferencesPage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
    </Routes>
  );
}
