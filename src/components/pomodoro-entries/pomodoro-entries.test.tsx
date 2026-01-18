import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PomodoroEntries from "./pomodoro-entries";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import activitiesReducer from "@/features/activities/activities-slice";

const mockActivities: Activity[] = [
  { id: "a1", name: "Coding", type: "TASSEI", created: "", updated: "", monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, weekends: true },
  { id: "a2", name: "Reading", type: "TASSEI", created: "", updated: "", monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, weekends: true },
];

const mockEntries: PomodoroEntry[] = [
  {
    id: "e2",
    pomodoroId: "p1",
    activityId: "a2",
    minutes: 15,
    entryType: "WORK_INTERVAL",
    created: "2023-01-01T10:30:00Z",
    updated: "2023-01-01T10:30:00Z",
  },
  {
    id: "e1",
    pomodoroId: "p1",
    activityId: "a1",
    minutes: 25,
    entryType: "WORK_INTERVAL",
    created: "2023-01-01T10:00:00Z",
    updated: "2023-01-01T10:00:00Z",
  },
];

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

describe("PomodoroEntries", () => {
  it("renders entries sorted by most recent", () => {
    renderWithRedux(
      <PomodoroEntries entries={mockEntries} onEntryActivityChange={() => {}} activities={mockActivities} />
    );
    // After refactoring to Grid, entries are in Papers instead of Rows.
    // e2 (10:30) should be first, e1 (10:00) second.
    // We can look for the duration text.
    const durations = screen.getAllByText((_, element) => element?.textContent === "Total: 15m" || element?.textContent === "Total: 25m");
    expect(durations[0]).toHaveTextContent("15m");
    expect(durations[1]).toHaveTextContent("25m");
  });

  it("calls onEntryActivityChange when activity is changed", () => {
    const onEntryActivityChange = jest.fn();
    renderWithRedux(
      <PomodoroEntries
        entries={mockEntries}
        onEntryActivityChange={onEntryActivityChange}
        activities={mockActivities}
      />
    );

    const autocompletes = screen.getAllByRole("combobox");
    const entryAutocomplete = autocompletes[0]; // First entry (e2)

    fireEvent.mouseDown(entryAutocomplete);
    const options = screen.getAllByRole("option");
    fireEvent.click(options[0]); // Click "Coding" (a1)

    expect(onEntryActivityChange).toHaveBeenCalledWith("e2", "a1");
  });

  it("displays total time correctly (hours and minutes)", () => {
    const longEntries: PomodoroEntry[] = [
      { ...mockEntries[0], minutes: 75 }
    ];
    renderWithRedux(
      <PomodoroEntries entries={longEntries} onEntryActivityChange={() => {}} activities={mockActivities} />
    );
    expect(screen.getByText((_, element) => element?.textContent === "Total: 1h 15m")).toBeInTheDocument();
  });
});
