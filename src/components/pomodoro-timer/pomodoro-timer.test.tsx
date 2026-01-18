import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import PomodoroTimer from "./pomodoro-timer";
import { getStopWatchWorker } from "@/utils/get-worker";

jest.mock("@/utils/get-worker", () => ({
  getStopWatchWorker: jest.fn(),
}));

describe("PomodoroTimer", () => {
  let mockWorker: any;
  const onStart = jest.fn();
  const onPause = jest.fn();
  const onStop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockWorker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
      onmessage: null,
    };
    (getStopWatchWorker as jest.Mock).mockReturnValue(mockWorker);
  });

  it("renders with initial time", () => {
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onStop={onStop} />);
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("renders hours if timePeriod >= 60", () => {
    render(<PomodoroTimer timePeriod={90} onStart={onStart} onPause={onPause} onStop={onStop} />);
    expect(screen.getByText("01:30:00")).toBeInTheDocument();
  });

  it("calls onStart and starts worker when start button is clicked", () => {
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onStop={onStop} />);
    const startBtn = screen.getByRole("button", { name: /start/i });
    fireEvent.click(startBtn);

    expect(onStart).toHaveBeenCalledWith(25);
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "set", seconds: 0 });
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "start" });
  });

  it("updates display when worker ticks", () => {
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onStop={onStop} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate worker tick (10 seconds elapsed)
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 10 } });
    });

    expect(screen.getByText("24:50")).toBeInTheDocument();
  });

  it("pauses worker and calls onPause when pause button is clicked", () => {
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onStop={onStop} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate 10 seconds elapsed
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 10 } });
    });
    
    const pauseBtn = screen.getByRole("button", { name: /pause/i });
    fireEvent.click(pauseBtn);

    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "pause" });
    expect(onPause).toHaveBeenCalledWith(0); // 10 seconds is 0 minutes
  });

  it("stops and resets when stop button is clicked", () => {
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onStop={onStop} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate 1 minute elapsed
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 60 } });
    });

    const stopBtn = screen.getByRole("button", { name: /finish/i });
    fireEvent.click(stopBtn);

    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "pause" });
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "reset" });
    expect(onStop).toHaveBeenCalledWith(1); // 1 minute elapsed
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("automatically stops when countdown reaches zero", () => {
    render(<PomodoroTimer timePeriod={1} onStart={onStart} onPause={onPause} onStop={onStop} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate 60 seconds elapsed
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 60 } });
    });

    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(onStop).toHaveBeenCalledWith(1);
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "pause" });
  });
});
