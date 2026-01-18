import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "@/theme/theme-provider";
import Header from "@/components/header/header";
import { store } from "@/store/root-store";
import { setCredentials } from "@/features/auth/auth-slice";
import { MemoryRouter } from "react-router-dom";

jest.mock("@/utils/jwt", () => ({
  isJwtValid: jest.fn().mockReturnValue(true),
}));

const queryClient = new QueryClient();

test("Header shows Pomodoro on / and Entries on /pomodoro", async () => {
  // ensure the store has authenticated user for this test so Header is shown
  store.dispatch(
    setCredentials({ jwt: "test-jwt", user: { id: "user-1", name: "Test User", email: "test@example.com" } })
  );

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MemoryRouter initialEntries={["/"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Header />
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );

  // On root, the Pomodoro link should be visible, Entries should be hidden
  expect(screen.getByRole("link", { name: /pomodoro/i })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /entries/i })).toBeNull();

  // Simulate navigation to /pomodoro by clicking the Pomodoro link
  const pomodoroLink = screen.getByRole("link", { name: /pomodoro/i });
  await userEvent.click(pomodoroLink);

  // Wait for Entries to appear and Pomodoro to disappear
  await waitFor(() => {
    expect(screen.getByRole("link", { name: /entries/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /pomodoro/i })).toBeNull();
  });
});
