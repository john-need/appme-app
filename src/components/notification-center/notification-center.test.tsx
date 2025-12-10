import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationCenter from "./notification-center";

// Mock hooks used by the component (dispatch + selector)
const dispatch = jest.fn();
const selector = jest.fn();
jest.mock("../../hooks", () => ({
  useAppDispatch: () => dispatch,
  useAppSelector: (fn: any) => selector(fn),
}));

// Mock action creator to a predictable action
jest.mock("../../features/notification/notification-slice", () => ({
  removeNotification: (id: string) => ({ type: "notification/remove", payload: id }),
}));

describe("NotificationCenter", () => {
  beforeEach(() => {
    dispatch.mockClear();
    selector.mockReset();
  });

  it("renders notifications and allows manual dismiss via close button", async () => {
    const user = userEvent.setup();
    // Provide two notifications
    selector.mockImplementation((fn: any) =>
      fn({
        notification: {
          list: [
            { id: "n1", message: "Saved successfully", severity: "success" },
            { id: "n2", message: "Something went wrong", severity: "error" },
          ],
        },
      })
    );

    render(<NotificationCenter />);

    // Messages should be visible
    expect(screen.getByText(/Saved successfully/i)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    // Click the first close button (Alert renders a close icon button when onClose is provided)
    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    await user.click(closeButtons[0]);

    expect(dispatch).toHaveBeenCalledWith({ type: "notification/remove", payload: "n1" });
  });

  it("auto-hides notifications after duration and dispatches remove", () => {
    jest.useFakeTimers();
    try {
      selector.mockImplementation((fn: any) =>
        fn({ notification: { list: [{ id: "n3", message: "Auto hide", severity: "info" }] } })
      );

      render(<NotificationCenter />);

      // Advance timers to trigger Snackbar autoHideDuration (6000ms)
      act(() => {
        jest.advanceTimersByTime(6000);
      });

      // Either Snackbar onClose or Alert onClose should dispatch removal
      expect(dispatch).toHaveBeenCalledWith({ type: "notification/remove", payload: "n3" });
    } finally {
      jest.useRealTimers();
    }
  });
});
