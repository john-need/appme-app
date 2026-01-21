import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PomodoroComponent from "./pomodoro";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import activitiesReducer from "@/features/activities/activities-slice";

const mockActivities: Activity[] = [
  { id: "a1", name: "Coding", type: "TASSEI", created: "", updated: "", monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, weekends: true },
  { id: "a2", name: "Reading", type: "TASSEI", created: "", updated: "", monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, weekends: true },
];

const mockPomodoro: Pomodoro = {
  id: "p1",
  name: "Task 1",
  activityId: "a1",
  notes: "Some notes",
  userId: "u1",
  created: "2023-01-01T10:00:00Z",
  updated: "2023-01-01T10:00:00Z",
  entries: [
    {
      id: "e1",
      pomodoroId: "p1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2023-01-01T10:00:00Z",
      updated: "2023-01-01T10:00:00Z",
    },
    {
      id: "e2",
      pomodoroId: "p1",
      activityId: "a2",
      minutes: 15,
      entryType: "WORK_INTERVAL",
      created: "2023-01-01T10:30:00Z",
      updated: "2023-01-01T10:30:00Z",
    },
  ],
};

const renderWithRedux = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      activities: activitiesReducer,
    },
    preloadedState: {
      activities: { items: mockActivities },
    },
  });
  return render(<Provider store={store}>{component}</Provider>);
};

describe("PomodoroComponent", () => {
  it("renders pomodoro details correctly", () => {
    renderWithRedux(<PomodoroComponent pomodoro={mockPomodoro} onChange={() => {}} activities={mockActivities} />);

    expect(screen.getByLabelText(/Name/i)).toHaveValue("Task 1");
    expect(screen.getByText(/2023-01-01/i)).toBeInTheDocument();
  });

  it("calls onChange when name is changed", async () => {
    const onChange = jest.fn();
    renderWithRedux(<PomodoroComponent pomodoro={mockPomodoro} onChange={onChange} activities={mockActivities} />);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Name/i);
    // Directly fire the change event to avoid multiple calls from typing
    fireEvent.change(nameInput, { target: { value: "Updated Task" } });

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: "Updated Task" }));
  });

  it("calls onChange when activity is changed", async () => {
    const onChange = jest.fn();
    renderWithRedux(<PomodoroComponent pomodoro={mockPomodoro} onChange={onChange} activities={mockActivities} />);

    const activityInput = screen.getAllByRole("combobox")[0]; // The first one is for Pomodoro activityId
    
    fireEvent.mouseDown(activityInput);
    const options = screen.getAllByRole("option");
    fireEvent.click(options[1]); // Click "Reading" (a2)

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ activityId: "a2" }));
  });
});
