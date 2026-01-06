import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TimeEntriesPage from "./time-entries-page";

// Mock selector hook and child component
jest.mock("@/hooks", () => ({
  useAppSelector: (fn: any) =>
    fn({
      timeEntries: {
        items: [
          { id: "t1", activityId: "a1", minutes: 10, created: "2023-01-01T10:00:00Z" },
          { id: "t2", activityId: "a2", minutes: 20, created: "2023-01-01T11:00:00Z" },
        ],
      },
      activities: {
        items: [
          { id: "a1", name: "Activity 1" },
        ],
      },
    }),
  useAppDispatch: () => jest.fn(),
}));

const mockMutate = jest.fn();
jest.mock("@/hooks/use-update-time-entry", () => () => ({
  mutate: mockMutate,
}));

const mockAddMutate = jest.fn();
jest.mock("@/hooks/use-add-time-entry", () => () => ({
  mutate: mockAddMutate,
}));

const mockDeleteMutate = jest.fn();
jest.mock("@/hooks/use-delete-time-entry", () => () => ({
  mutate: mockDeleteMutate,
}));

jest.mock("@/components/time-entries/time-entries", () => {
  const TimeEntriesMock = (props: any) => (
    <div>
      <div>TimeEntries Mock count={props.timeEntries?.length ?? 0}</div>
      <button onClick={() => props.startStopWatch(props.timeEntries[0])}>Start StopWatch</button>
      <button onClick={() => props.startStopWatch(props.timeEntries[1])}>Start StopWatch for t2</button>
      <button onClick={() => props.onAddTime(props.timeEntries[0])}>Add Time</button>
      <button onClick={() => props.onDeleteTimeEntry(props.timeEntries[0].id)}>Delete Entry</button>
      <button onClick={() => props.onAddTimeEntry({ activityId: "a1", minutes: 30 })}>Add New Entry</button>
    </div>
  );
  TimeEntriesMock.displayName = "TimeEntriesMock";
  return TimeEntriesMock;
});

jest.mock("@/components/stop-watch-modal/stop-watch-modal", () => {
  const StopWatchModalMock = (props: any) => {
    if (!props.open) return null;
    return (
      <div data-testid="stop-watch-modal">
        <div>StopWatchModal Mock for {props.activityName}</div>
        <button onClick={props.onClose}>Close Modal</button>
        <button onClick={() => props.onSubmit(props.timeEntry)}>Save Modal</button>
      </div>
    );
  };
  StopWatchModalMock.displayName = "StopWatchModalMock";
  return {
    StopWatchModal: StopWatchModalMock,
  };
});

describe("TimeEntriesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes time entries from store to TimeEntries", () => {
    render(<TimeEntriesPage />);
    expect(screen.getByText(/TimeEntries Mock count=2/)).toBeInTheDocument();
  });

  it("opens stop watch modal when startStopWatch is called", () => {
    render(<TimeEntriesPage />);
    fireEvent.click(screen.getByText("Start StopWatch"));
    expect(screen.getByTestId("stop-watch-modal")).toBeInTheDocument();
    expect(screen.getByText("StopWatchModal Mock for Activity 1")).toBeInTheDocument();
  });

  it("handles case where activity name is not found", () => {
    jest.mocked(fireEvent.click); // Not needed, but let's just trigger another click
    render(<TimeEntriesPage />);
    // Click on the second entry which has activityId "a2" but "a2" is not in activities mock
    fireEvent.click(screen.getByText("Start StopWatch for t2"));
    expect(screen.getByText("StopWatchModal Mock for a2")).toBeInTheDocument();
  });

  it("closes stop watch modal when onClose is called", () => {
    render(<TimeEntriesPage />);
    fireEvent.click(screen.getByText("Start StopWatch"));
    expect(screen.getByTestId("stop-watch-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("stop-watch-modal")).not.toBeInTheDocument();
  });

  it("calls mutate and closes modal when onSubmit is called", () => {
    render(<TimeEntriesPage />);
    fireEvent.click(screen.getByText("Start StopWatch"));

    fireEvent.click(screen.getByText("Save Modal"));
    expect(mockMutate).toHaveBeenCalled();
    expect(screen.queryByTestId("stop-watch-modal")).not.toBeInTheDocument();
  });

  describe("onAddTime", () => {
    it("calls mutate with added minutes when valid input is provided", () => {
      window.prompt = jest.fn().mockReturnValue("15");
      render(<TimeEntriesPage />);
      fireEvent.click(screen.getByText("Add Time"));

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "t1",
          minutes: 25, // 10 + 15
        })
      );
    });

    it("shows alert when invalid input is provided", () => {
      window.prompt = jest.fn().mockReturnValue("invalid");
      window.alert = jest.fn();
      render(<TimeEntriesPage />);
      fireEvent.click(screen.getByText("Add Time"));

      expect(window.alert).toHaveBeenCalledWith("Please enter a valid number of minutes.");
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("does nothing when prompt is cancelled", () => {
      window.prompt = jest.fn().mockReturnValue(null);
      render(<TimeEntriesPage />);
      fireEvent.click(screen.getByText("Add Time"));

      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("calls addMutation.mutate when onAddTimeEntry is called", () => {
    render(<TimeEntriesPage />);
    fireEvent.click(screen.getByText("Add New Entry"));

    expect(mockAddMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        timeEntry: expect.objectContaining({
          activityId: "a1",
          minutes: 30,
        }),
      }),
      expect.any(Object)
    );
  });

  it("calls deleteMutation.mutate when onDeleteTimeEntry is called", () => {
    render(<TimeEntriesPage />);
    fireEvent.click(screen.getByText("Delete Entry"));

    expect(mockDeleteMutate).toHaveBeenCalledWith("t1");
  });
});
