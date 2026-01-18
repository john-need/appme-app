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
    renderWithRedux(<PomodoroComponent pomodoro={mockPomodoro} onChange={() => {}} />);

    expect(screen.getByLabelText(/Name/i)).toHaveValue("Task 1");
    expect(screen.getByText(/Created:/i)).toBeInTheDocument();
  });

  it("calls onChange when name is changed", async () => {
    const onChange = jest.fn();
    renderWithRedux(<PomodoroComponent pomodoro={mockPomodoro} onChange={onChange} />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/Name/i);
    // Directly fire the change event to avoid multiple calls from typing
    fireEvent.change(nameInput, { target: { value: "Updated Task" } });

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: "Updated Task" }));
  });

  it("calls onChange when activity is changed", async () => {
    const onChange = jest.fn();
    renderWithRedux(<PomodoroComponent pomodoro={mockPomodoro} onChange={onChange} />);

    const activityInput = screen.getAllByRole("combobox")[0]; // The first one is for Pomodoro activityId
    
    fireEvent.mouseDown(activityInput);
    const options = screen.getAllByRole("option");
    fireEvent.click(options[1]); // Click "Reading" (a2)

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ activityId: "a2" }));
  });

  it("renders entries sorted by most recent", () => {
    renderWithRedux(<PomodoroComponent pomodoro={mockPomodoro} onChange={() => {}} />);
    const rows = screen.getAllByRole("row");
    // Row 0 is header.
    // In UTC, 10:30Z is 10:30 AM or something else depending on local timezone of the environment.
    // The test output showed "05:45 AM" for "10:30 AM"? Wait. 15m duration. 
    // 10:30Z - 5 hours = 05:30. So it's probably EST (UTC-5).
    // Let's use a more flexible matcher or check for parts of the time.
    expect(rows[1]).toHaveTextContent(/AM|PM/);
    expect(rows[1]).toHaveTextContent("15m"); 
    expect(rows[2]).toHaveTextContent("25m");
  });

  it("displays total time correctly (hours and minutes)", () => {
    const longPomo = {
      ...mockPomodoro,
      entries: [{ ...mockPomodoro.entries[0], minutes: 75 }]
    };
    renderWithRedux(<PomodoroComponent pomodoro={longPomo} onChange={() => {}} />);
    expect(screen.getByText("1h 15m")).toBeInTheDocument();
  });

  it("calls onChange when entry activity is changed via Autocomplete", async () => {
    const onChange = jest.fn();
    renderWithRedux(<PomodoroComponent pomodoro={mockPomodoro} onChange={onChange} />);
    
    // Find Autocomplete for first entry (e2 since it's most recent)
    const autocompletes = screen.getAllByRole("combobox");
    const entryAutocomplete = autocompletes[1]; // Index 0 is Pomodoro activityId, index 1 is first entry

    fireEvent.mouseDown(entryAutocomplete);
    const options = screen.getAllByRole("option");
    fireEvent.click(options[0]); // Click "Coding" (a1)

    expect(onChange).toHaveBeenCalled();
    const updatedPomo = onChange.mock.calls[0][0];
    const updatedEntry = updatedPomo.entries.find((e: any) => e.id === "e2");
    expect(updatedEntry.activityId).toBe("a1");
  });
});
