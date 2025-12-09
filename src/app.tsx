import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import AppRouter from "./routes/app-router";
import NotificationCenter from "./components/notification-center/notification-center";
import { useIsAuthenticated } from "./hooks";
import LoginForm from "./components/login-form/login-form";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/root-store";
import { Box } from "@mui/material";

export default function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <PersistGate loading={null} persistor={persistor}>
        {isAuthenticated ? (
          <>
            <Header />
            <Box sx={{ flexGrow: 1, height: 'calc(100vh - 64px)', overflow: 'auto' }} >
              <AppRouter />
            </Box>
            <NotificationCenter />
          </>
        ) : (
          <Routes>
            <Route path="*" element={<LoginForm />} />
          </Routes>
        )}
      </PersistGate>
    </BrowserRouter>
  );
}
