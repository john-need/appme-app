import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PreferencesPage from "./preferences-page";

// Mock theme provider hook
const toggleMode = jest.fn();
jest.mock("@/theme/theme-provider", () => ({
  useColorMode: () => ({ mode: "light", toggleMode }),
}));

// Mock app hooks
const setUserInStore = jest.fn();
jest.mock("@/hooks", () => ({
  useCurrentUser: () => ({
    id: "u1",
    name: "John Doe",
    startOfWeek: "MONDAY",
    defaultView: "DAY",
  }),
  useAuth: () => ({ updateUser: setUserInStore }),
  useJwt: () => "jwt123",
}));

// Mock update user mutation hook
const mutate = jest.fn();
jest.mock("@/data-layer/update-user", () =>
  () => ({ mutate, isLoading: false })
);

describe("PreferencesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders and toggles theme when icon button clicked", async () => {
    const user = userEvent.setup();
    render(<PreferencesPage />);
    const toggleBtn = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleBtn);
    expect(toggleMode).toHaveBeenCalled();
  });

  it("calls mutate with current form values and jwt on Save", async () => {
    const user = userEvent.setup();
    render(<PreferencesPage />);
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mutate).toHaveBeenCalledWith({
      user: { id: "u1", name: "John Doe", startOfWeek: "MONDAY", defaultView: "DAY" },
      jwt: "jwt123",
    });
  });

  it("resets edited fields back to current user values", async () => {
    const user = userEvent.setup();
    render(<PreferencesPage />);
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, "Jane");
    expect(nameInput.value).toBe("Jane");

    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(nameInput.value).toBe("John Doe");
  });
});
