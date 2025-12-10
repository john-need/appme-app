import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./login-form";

// Mocks
const mockLogin = jest.fn();
const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Component imports hooks from "../../hooks"
jest.mock("../../hooks", () => ({
  useLogin: jest.fn(() => ({
    login: mockLogin,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  })),
  useAppDispatch: () => mockDispatch,
}));

import { useLogin } from "../../hooks";

type UseLoginReturn = {
  login: (email: string, password: string) => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isSuccess: boolean;
};

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // reset localStorage
    localStorage.clear();
  });

  function setUseLoginReturn(partial: Partial<UseLoginReturn>) {
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: false,
      ...partial,
    });
  }

  it("renders fields and Login button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("loads remembered email from localStorage and checks Remember me", async () => {
    localStorage.setItem("appme:rememberedEmail", "saved@example.com");
    render(<LoginForm />);
    // wait for effect to populate
    const email = (await screen.findByDisplayValue("saved@example.com")) as HTMLInputElement;
    expect(email.value).toBe("saved@example.com");
    const remember = screen.getByLabelText(/Remember me/i) as HTMLInputElement;
    expect(remember.checked).toBe(true);
  });

  it("shows validation messages for invalid email (custom) and short password, and clears on change", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/Email/i));
    // use an email that passes native validation but fails component regex (missing TLD dot)
    await user.type(screen.getByLabelText(/Email/i), "a@b");
    await user.clear(screen.getByLabelText(/Password/i));
    await user.type(screen.getByLabelText(/Password/i), "123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/Please enter a valid email address/)).toBeInTheDocument();
    expect(screen.getByText(/Password must be at least 6 characters/)).toBeInTheDocument();

    // Fix email should clear its error helper text
    await user.clear(screen.getByLabelText(/Email/i));
    await user.type(screen.getByLabelText(/Email/i), "a@b.com");
    expect(screen.queryByText(/Please enter a valid email address/)).toBeNull();
  });

  it("calls login with email and password and persists remembered email when checked", async () => {
    setUseLoginReturn({ isLoading: false, isSuccess: false });
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Email/i), "me@example.com");
    await user.type(screen.getByLabelText(/Password/i), "secret1");
    await user.click(screen.getByLabelText(/Remember me/i));

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockLogin).toHaveBeenCalledWith("me@example.com", "secret1");
    expect(localStorage.getItem("appme:rememberedEmail")).toBe("me@example.com");
  });

  it("removes remembered email when checkbox is unchecked on submit", async () => {
    // start with saved value present
    localStorage.setItem("appme:rememberedEmail", "old@example.com");
    setUseLoginReturn({});
    render(<LoginForm />);
    const user = userEvent.setup();

    // ensure checkbox is initially checked due to saved email, then uncheck it
    const remember = screen.getByLabelText(/Remember me/i);
    expect((remember as HTMLInputElement).checked).toBe(true);
    await user.click(remember);

    await user.clear(screen.getByLabelText(/Password/i));
    await user.type(screen.getByLabelText(/Password/i), "secret1");
    // email already prefilled from localStorage
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(localStorage.getItem("appme:rememberedEmail")).toBeNull();
  });

  it("disables button and shows loader when isLoading is true", () => {
    setUseLoginReturn({ isLoading: true });
    render(<LoginForm />);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    // loader rendered inside the button
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("dispatches success notification and navigates on isSuccess", async () => {
    setUseLoginReturn({ isSuccess: true });
    render(<LoginForm />);
    // wait for effect dispatch and navigate
    await screen.findByRole("heading", { name: /login/i }); // yield to effects
    // effects happen asynchronously; use waitFor to avoid race
    await (async () => {
      // simple retry loop via RTL's waitFor
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { waitFor } = require("@testing-library/react");
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: "notification/addNotification" })
        );
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    })();
  });
});
