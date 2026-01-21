import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmPomodoroReset from "./confirm-pomodoro-reset";

describe("ConfirmPomodoroReset", () => {
  const defaultProps = {
    showModal: true,
    onSave: jest.fn(),
    onDiscard: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with required text", () => {
    render(<ConfirmPomodoroReset {...defaultProps} />);
    expect(screen.getByText("Your are about to stop the current pomodoro.")).toBeInTheDocument();
  });

  it("displays the correct buttons", () => {
    render(<ConfirmPomodoroReset {...defaultProps} />);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /discard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("calls onSave when Save button is clicked", () => {
    render(<ConfirmPomodoroReset {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
  });

  it("calls onDiscard when Discard button is clicked", () => {
    render(<ConfirmPomodoroReset {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /discard/i }));
    expect(defaultProps.onDiscard).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Close button is clicked", () => {
    render(<ConfirmPomodoroReset {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not show when showModal is false", () => {
    render(<ConfirmPomodoroReset {...defaultProps} showModal={false} />);
    expect(screen.queryByText("Your are about to stop the current pomodoro.")).not.toBeInTheDocument();
  });
});
