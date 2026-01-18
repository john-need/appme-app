import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewPomodoroModal from "./new-pomodoro-modal";

describe("NewPomodoroModal", () => {
  it("renders when show is true", () => {
    render(
      <NewPomodoroModal show={true} onSubmit={() => {}} onCancel={() => {}} />
    );
    expect(screen.getByText(/New Pomodoro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
  });

  it("does not render when show is false", () => {
    render(
      <NewPomodoroModal show={false} onSubmit={() => {}} onCancel={() => {}} />
    );
    expect(screen.queryByText(/New Pomodoro/i)).not.toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const onCancel = jest.fn();
    render(
      <NewPomodoroModal show={true} onSubmit={() => {}} onCancel={onCancel} />
    );
    const user = userEvent.setup();
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when close (X) button is clicked", async () => {
    const onCancel = jest.fn();
    render(
      <NewPomodoroModal show={true} onSubmit={() => {}} onCancel={onCancel} />
    );
    const user = userEvent.setup();
    const closeBtn = screen.getByRole("button", { name: /close/i });
    await user.click(closeBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables Add button when name is empty", () => {
    render(
      <NewPomodoroModal show={true} onSubmit={() => {}} onCancel={() => {}} />
    );
    const addBtn = screen.getByRole("button", { name: /add/i });
    expect(addBtn).toBeDisabled();
  });

  it("enables Add button when name is provided", async () => {
    render(
      <NewPomodoroModal show={true} onSubmit={() => {}} onCancel={() => {}} />
    );
    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(/Name/i);
    await user.type(nameInput, "Work");
    const addBtn = screen.getByRole("button", { name: /add/i });
    expect(addBtn).toBeEnabled();
  });

  it("submits the form with correct values", async () => {
    const onSubmit = jest.fn();
    render(
      <NewPomodoroModal show={true} onSubmit={onSubmit} onCancel={() => {}} />
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Name/i), "Study session");
    await user.type(screen.getByLabelText(/Notes/i), "Focus on math");
    await user.type(screen.getByLabelText(/Type/i), "Education");

    const addBtn = screen.getByRole("button", { name: /add/i });
    await user.click(addBtn);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Study session",
        notes: "Focus on math",
        activityId: "Education",
      })
    );
  });
});
