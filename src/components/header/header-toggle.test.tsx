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

test("Header shows Dashboard on / and Entries on /dashboard", async () => {
  // ensure the store has authenticated user for this test so Header is shown
  store.dispatch(
    setCredentials({ jwt: "test-jwt", user: { id: "user-1", name: "Test User", email: "test@example.com" } })
  );

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Header />
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );

  // On root, the Dashboard link should be visible, Entries should be hidden
  expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /entries/i })).toBeNull();

  // Simulate navigation to /dashboard by clicking the Dashboard link
  const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
  await userEvent.click(dashboardLink);

  // Wait for Entries to appear and Dashboard to disappear
  await waitFor(() => {
    expect(screen.getByRole("link", { name: /entries/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /dashboard/i })).toBeNull();
  });
});
