import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewPomodoro from "./new-pomodoro";

describe("NewPomodoro", () => {
  it("renders correctly", () => {
    render(
      <NewPomodoro onSubmit={() => {}} />
    );
    expect(screen.getByText(/New Pomodoro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
  });

  it("disables Start button when name is empty", () => {
    render(
      <NewPomodoro onSubmit={() => {}} />
    );
    const startBtn = screen.getByRole("button", { name: /start/i });
    expect(startBtn).toBeDisabled();
  });

  it("enables Start button when name is provided", async () => {
    render(
      <NewPomodoro onSubmit={() => {}} />
    );
    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(/Name/i);
    await user.type(nameInput, "Work");
    const startBtn = screen.getByRole("button", { name: /start/i });
    expect(startBtn).toBeEnabled();
  });

  it("submits the form with correct values", async () => {
    const onSubmit = jest.fn();
    render(
      <NewPomodoro onSubmit={onSubmit} />
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Name/i), "Study session");
    await user.type(screen.getByLabelText(/Notes/i), "Focus on math");
    await user.type(screen.getByLabelText(/Type/i), "Education");

    const startBtn = screen.getByRole("button", { name: /start/i });
    await user.click(startBtn);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Study session",
        notes: "Focus on math",
        activityId: "Education",
      })
    );
  });

  it("resets fields on cancel", async () => {
    render(
      <NewPomodoro onSubmit={() => {}} />
    );
    const user = userEvent.setup();
    
    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    await user.type(nameInput, "Temporary");
    expect(nameInput.value).toBe("Temporary");

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(nameInput.value).toBe("");
  });
});
