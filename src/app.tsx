import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import AppRouter from "./routes/app-router";
import NotificationCenter from "./components/notification-center/notification-center";
import { useIsAuthenticated } from "./hooks";
import LoginForm from "./components/login-form/login-form";
export default function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <BrowserRouter  future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}>
      {isAuthenticated ? (
        <>
          <Header />
          <AppRouter />
          <NotificationCenter />
        </>
      ) : (
        <Routes>
          <Route path="*" element={<LoginForm />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
