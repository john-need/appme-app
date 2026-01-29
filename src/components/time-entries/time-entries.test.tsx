import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TimeEntries from "./time-entries";
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
    todayActivities: mockActivities,
    otherActivities: [],
    activities: mockActivities,
    timeEntries: [],
    onAddTime: jest.fn(),
    startStopWatch: jest.fn(),
    onDeleteTimeEntry: jest.fn(),
    onAddTimeEntry: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the start timer button", () => {
    render(<TimeEntries {...defaultProps} />);
    expect(screen.getByTestId("start-timer-button")).toBeInTheDocument();
  });

  it("calls onAddTimeEntry and startStopWatch when start timer button is clicked", () => {
    render(<TimeEntries {...defaultProps} />);
    
    // Select activity
    const select = screen.getByTestId("activity-select").querySelector("input") as HTMLInputElement;
    fireEvent.change(select, { target: { value: "a1" } });

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

  it("resets activityId to the first available after start timer is clicked", () => {
    render(<TimeEntries {...defaultProps} />);

    const startTimerButton = screen.getByTestId("start-timer-button");
    const select = screen.getByTestId("activity-select").querySelector("input") as HTMLInputElement;

    // Select Activity 2
    fireEvent.change(select, { target: { value: "a2" } });
    expect(select.value).toBe("a2");

    fireEvent.click(startTimerButton);

    // After clicking, it should reset to the first available activity in todayActivities (Activity 1)
    expect(select.value).toBe("a1"); 
  });

  it("disables the start timer button if no activity is selected", () => {
    render(<TimeEntries {...defaultProps} todayActivities={[]} activities={[]} />);
    const startTimerButton = screen.getByTestId("start-timer-button");
    expect(startTimerButton).toBeDisabled();
  });
});
