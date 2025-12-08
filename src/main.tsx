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

// prime react-query cache from persisted auth in store if available
try {
  const state = store.getState();
  if (state && state.auth) {
    const { user, jwt } = state.auth as { user: any; jwt: string | null };
    if (user) queryClient.setQueryData(['auth', 'user'], user);
    if (jwt) queryClient.setQueryData(['auth', 'token'], jwt);
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
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
