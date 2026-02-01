import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./app";
import { store } from "./store/root-store";
import ThemeProvider from "./theme/theme-provider";
import { queryClient } from "./api/query-client";
import "./styles.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// prime react-query cache from persisted auth in store if available
try {
  const state = store.getState();
  if (state && state.auth) {
    const auth = state.auth as { user?: unknown; jwt?: string | null };
    if (auth.user) queryClient.setQueryData(["auth", "user"], auth.user);
    if (auth.jwt) queryClient.setQueryData(["auth", "token"], auth.jwt);
  }
} catch (e) {
  // ignore
}

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
          </LocalizationProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
