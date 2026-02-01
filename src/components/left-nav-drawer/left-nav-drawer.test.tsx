import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LeftNavDrawer from "./left-nav-drawer";

// Mocks for hooks used by the drawer
const mockLogout = jest.fn();
jest.mock("@/hooks", () => {
  return {
    useIsAuthenticated: jest.fn(),
    useAuth: () => ({ logout: mockLogout }),
  };
});

import { useIsAuthenticated } from "@/hooks";

describe("LeftNavDrawer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (options?: { isAuthenticated?: boolean }) => {
    (useIsAuthenticated as jest.Mock).mockReturnValue(!!options?.isAuthenticated);
    const onOpen = jest.fn();
    const onClose = jest.fn();
    render(
      <MemoryRouter initialEntries={["/"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LeftNavDrawer open onOpen={onOpen} onClose={onClose} />
      </MemoryRouter>
    );
    return { onOpen, onClose };
  };

  it("renders navigation title and core links when open", () => {
    setup({ isAuthenticated: false });

    expect(screen.getByText(/Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/Entries/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Activities/i)).toBeInTheDocument();
    expect(screen.getByText(/Preferences/i)).toBeInTheDocument();
    // Logout should not be present when not authenticated
    expect(screen.queryByText(/Logout/i)).toBeNull();
  });

  it("invokes onClose when the close icon button is clicked", async () => {
    const user = userEvent.setup();
    const { onClose } = setup({ isAuthenticated: false });

    await user.click(screen.getByRole("button", { name: /close drawer/i }));
    // SwipeableDrawer may call onClose multiple times depending on internal transitions
    expect(onClose).toHaveBeenCalled();
  });

  it("closes the drawer when a nav link is clicked", async () => {
    const user = userEvent.setup();
    const { onClose } = setup({ isAuthenticated: false });

    await user.click(screen.getByText(/Activities/i));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows Logout when authenticated and calls logout + onClose on click", async () => {
    const user = userEvent.setup();
    const { onClose } = setup({ isAuthenticated: true });

    const logoutItem = screen.getByText(/Logout/i);
    expect(logoutItem).toBeInTheDocument();

    await user.click(logoutItem);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalled();
  });
});
