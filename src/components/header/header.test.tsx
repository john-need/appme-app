import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "@/theme/theme-provider";
import Header from "./header";
import { store } from "@/store/root-store";
import { setCredentials } from "@/features/auth/auth-slice";
import { MemoryRouter } from "react-router-dom";

jest.mock("@/utils/jwt", () => ({
  isJwtValid: jest.fn().mockReturnValue(true),
}));

const queryClient = new QueryClient();

// Mock LeftNavDrawer to reflect `open` prop and call onClose when its internal close button is clicked
jest.mock("../left-nav-drawer/left-nav-drawer", () => ({
  __esModule: true,
  default: ({ open, onClose }: { open?: boolean; onClose?: () => void }) => {
    return React.createElement(
      React.Fragment,
      null,
      open ? React.createElement("div", { "data-testid": "left-drawer-open" }, "drawer") : null,
      React.createElement("button", { "data-testid": "drawer-close", onClick: onClose }, "close")
    );
  },
}));

describe("Header component", () => {
  beforeEach(() => {
    // ensure authenticated user in store
    store.dispatch(
      setCredentials({ jwt: "test-jwt", user: { id: "user-1", name: "Test User", email: "test@example.com" } })
    );
  });

  it("shows the authenticated user's name in the title", () => {
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

    expect(screen.getByText(/AppMe\s*-\s*Test User/)).toBeInTheDocument();
  });

  it("opens the left drawer when the menu button is clicked and closes when drawer close is clicked", async () => {
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

    const menuButton = screen.getByRole("button", { name: /menu/i });
    await userEvent.click(menuButton);

    // the drawer should be visible
    expect(screen.getByTestId("left-drawer-open")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("drawer-close");
    await userEvent.click(closeBtn);

    // drawer should be closed (no longer in the document)
    expect(screen.queryByTestId("left-drawer-open")).toBeNull();
  });
});
