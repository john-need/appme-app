import React from "react";
import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./theme/theme-provider";
import App from "./app";
import { store } from "./store/root-store";
import { setCredentials } from "./features/auth/auth-slice";

jest.mock("./utils/jwt", () => ({
  isJwtValid: jest.fn().mockReturnValue(true),
}));

const queryClient = new QueryClient();

test("renders app header", () => {
  // ensure store has authenticated user for this test so Header is shown
  store.dispatch(setCredentials({ jwt: "test-jwt", user: { id: "user-1", name: "Test User", email: "test@example.com" } }));

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );

  const banner = screen.getByRole("banner");
  expect(within(banner).getByText(/appme/i)).toBeInTheDocument();
});
