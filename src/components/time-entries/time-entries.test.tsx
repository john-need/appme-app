import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TimeEntries from "./time-entries";
import { useAppSelector } from "@/hooks";
import activityFactory from "@/factories/activity-factory";

jest.mock("@/hooks", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(() => jest.fn()),
}));


const mockActivities = [
  activityFactory({ id: "a1", name: "Activity 1", monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true }),
  activityFactory({ id: "a2", name: "Activity 2", monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true }),
];

describe("TimeEntries", () => {
  const defaultProps = {
    timeEntries: [],
    onAddTime: jest.fn(),
    startStopWatch: jest.fn(),
    onDeleteTimeEntry: jest.fn(),
    onAddTimeEntry: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockReturnValue(mockActivities);
  });

  it("renders the start timer button", () => {
    render(<TimeEntries {...defaultProps} />);
    expect(screen.getByTestId("start-timer-button")).toBeInTheDocument();
  });

  it("calls onAddTimeEntry and startStopWatch when start timer button is clicked", () => {
    render(<TimeEntries {...defaultProps} />);
    
    // Select activity (it should be auto-selected to Activity 1 based on the component logic)
    const startTimerButton = screen.getByTestId("start-timer-button");
    fireEvent.click(startTimerButton);

    expect(defaultProps.onAddTimeEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        activityId: "a1",
        minutes: 0,
      })
    );
    expect(defaultProps.startStopWatch).toHaveBeenCalledWith(
      expect.objectContaining({
        activityId: "a1",
        minutes: 0,
      })
    );
  });

  it("optimistically excludes the activity and selects the next one when start timer is clicked", () => {
    render(<TimeEntries {...defaultProps} />);

    const startTimerButton = screen.getByTestId("start-timer-button");
    const select = screen.getByTestId("activity-select").querySelector("input") as HTMLInputElement;

    // Initially Activity 1 is selected
    expect(select.value).toBe("a1");

    fireEvent.click(startTimerButton);

    // After clicking, Activity 1 should be excluded and Activity 2 should be selected
    expect(select.value).toBe("a2");

    // Click again for Activity 2
    fireEvent.click(startTimerButton);

    // Now both a1 and a2 should be excluded, and since no more activities are available, it might be empty or disabled
    // In our mock there are only 2 activities.
  });

  it("disables the start timer button if no activity is selected", () => {
    (useAppSelector as jest.Mock).mockReturnValue([]);
    render(<TimeEntries {...defaultProps} />);
    const startTimerButton = screen.getByTestId("start-timer-button");
    expect(startTimerButton).toBeDisabled();
  });
});
