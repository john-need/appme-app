import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewPomodoro from "./new-pomodoro";

const mockActivities: Activity[] = [
  {
    id: "a1",
    name: "Education",
    type: "TASSEI",
    created: "2023-01-01",
    updated: "2023-01-01",
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    weekends: false,
  },
  {
    id: "a2",
    name: "Work",
    type: "TASSEI",
    created: "2023-01-01",
    updated: "2023-01-01",
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    weekends: false,
  },
];

describe("NewPomodoro", () => {
  it("renders correctly", () => {
    render(
      <NewPomodoro onSubmit={() => {}} activities={mockActivities} />
    );
    expect(screen.getByText(/New Pomodoro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Main Activity/i)).toBeInTheDocument();
  });

  it("disables Start button when name is empty", () => {
    render(
      <NewPomodoro onSubmit={() => {}} activities={mockActivities} />
    );
    const startBtn = screen.getByRole("button", { name: /start/i });
    expect(startBtn).toBeDisabled();
  });

  it("enables Start button when name is provided", async () => {
    render(
      <NewPomodoro onSubmit={() => {}} activities={mockActivities} />
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
      <NewPomodoro onSubmit={onSubmit} activities={mockActivities} />
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Name/i), "Study session");
    await user.type(screen.getByLabelText(/Notes/i), "Focus on math");
    
    // Select activity from Autocomplete
    const activityInput = screen.getByLabelText(/Main Activity/i);
    await user.click(activityInput);
    const option = await screen.findByText("Education");
    await user.click(option);

    const startBtn = screen.getByRole("button", { name: /start/i });
    await user.click(startBtn);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Study session",
        notes: "Focus on math",
        activityId: "a1",
      })
    );
  });

  it("resets fields on clear", async () => {
    render(
      <NewPomodoro onSubmit={() => {}} activities={mockActivities} />
    );
    const user = userEvent.setup();
    
    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    await user.type(nameInput, "Temporary");
    expect(nameInput.value).toBe("Temporary");

    const clearBtn = screen.getByRole("button", { name: /clear/i });
    await user.click(clearBtn);

    expect(nameInput.value).toBe("");
  });
});
