import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { StopWatchModal } from "./stop-watch-modal";

const mockTimeEntry: TimeEntry = {
  id: "1",
  activityId: "activity-1",
  minutes: 10,
  created: "2026-01-01T10:00:00Z",
  updated: "2026-01-01T10:00:00Z",
};

const defaultProps = {
  open: true,
  timeEntry: mockTimeEntry,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  activityName: "Test Activity",
};

describe("StopWatchModal", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders correctly when open", () => {
    render(<StopWatchModal {...defaultProps} />);
    expect(screen.getByText("Stopwatch: Test Activity")).toBeInTheDocument();
    expect(screen.getByText("Current: 10 min")).toBeInTheDocument();
    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<StopWatchModal {...defaultProps} open={false} />);
    expect(screen.queryByText("Stopwatch: Test Activity")).not.toBeInTheDocument();
  });

  it("starts the timer when start button is clicked", () => {
    render(<StopWatchModal {...defaultProps} />);
    const startButton = screen.getByText("start");
    fireEvent.click(startButton);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("0:01")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(59000);
    });
    expect(screen.getByText("1:00")).toBeInTheDocument();
  });

  it("pauses the timer when pause button is clicked", () => {
    render(<StopWatchModal {...defaultProps} />);
    fireEvent.click(screen.getByText("start"));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText("0:02")).toBeInTheDocument();

    fireEvent.click(screen.getByText("pause"));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText("0:02")).toBeInTheDocument();
  });

  it("resets the timer after confirmation", async () => {
    render(<StopWatchModal {...defaultProps} />);
    fireEvent.click(screen.getByText("start"));
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText("0:05")).toBeInTheDocument();

    fireEvent.click(screen.getByText("reset"));
    expect(screen.getByText("Are you sure you want to reset the timer to 0:00?")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Yes, Reset"));
    expect(screen.getByText("0:00")).toBeInTheDocument();
    
    // Wait for the dialog to close
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.queryByText("Yes, Reset")).not.toBeInTheDocument();
  });

  it("closes the modal when cancel is confirmed", async () => {
    render(<StopWatchModal {...defaultProps} />);
    fireEvent.click(screen.getByText("cancel"));
    expect(screen.getByText("Are you sure you want to close without saving?")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Yes, Close"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("shows save prompt when save is clicked", () => {
    render(<StopWatchModal {...defaultProps} />);
    fireEvent.click(screen.getByText("start"));
    act(() => {
      jest.advanceTimersByTime(120000); // 2 minutes
    });
    fireEvent.click(screen.getByText("save"));

    expect(screen.getByText("Save Time")).toBeInTheDocument();
    expect(screen.getByText(/You have 10 minutes recorded/)).toBeInTheDocument();
  });

  it("handles 'add to current time' option", () => {
    render(<StopWatchModal {...defaultProps} />);
    fireEvent.click(screen.getByText("start"));
    act(() => {
      jest.advanceTimersByTime(120000); // 2 minutes
    });
    fireEvent.click(screen.getByText("save"));

    fireEvent.click(screen.getByText("add to current time"));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      ...mockTimeEntry,
      minutes: 12, // 10 + 2
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("handles 'save' (overwrite) option", () => {
    render(<StopWatchModal {...defaultProps} />);
    fireEvent.click(screen.getByText("start"));
    act(() => {
      jest.advanceTimersByTime(180000); // 3 minutes
    });
    fireEvent.click(screen.getByText("save"));

    fireEvent.click(screen.getByRole("button", { name: "save" }));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      ...mockTimeEntry,
      minutes: 3, // Overwritten to 3
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("handles 'resume' option", () => {
    render(<StopWatchModal {...defaultProps} />);
    fireEvent.click(screen.getByText("start"));
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    fireEvent.click(screen.getByText("save"));
    fireEvent.click(screen.getByText("resume"));

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("0:06")).toBeInTheDocument();
  });
});
