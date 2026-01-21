import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import PomodoroTimer from "./pomodoro-timer";
import { getStopWatchWorker } from "@/utils/get-worker";

jest.mock("@/utils/get-worker", () => ({
  getStopWatchWorker: jest.fn(),
}));

describe("PomodoroTimer", () => {
  let mockWorker: any;
  let mockAudio: any;
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

    mockAudio = {
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      load: jest.fn(),
      src: "",
      volume: 1,
      loop: false,
      currentTime: 0,
    };
    global.Audio = jest.fn().mockImplementation(() => mockAudio);
  });

  it("renders with initial time", () => {
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onTimerComplete={onStop} />);
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("renders hours if timePeriod >= 60", () => {
    render(<PomodoroTimer timePeriod={90} onStart={onStart} onPause={onPause} onTimerComplete={onStop} />);
    expect(screen.getByText("01:30:00")).toBeInTheDocument();
  });

  it("calls onStart and starts worker when start button is clicked", () => {
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onTimerComplete={onStop} />);
    const startBtn = screen.getByRole("button", { name: /start/i });
    fireEvent.click(startBtn);

    expect(onStart).toHaveBeenCalledWith(25);
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "set", seconds: 0 });
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "start" });
  });

  it("updates display when worker ticks", () => {
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onTimerComplete={onStop} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate worker tick (10 seconds elapsed)
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 10 } });
    });

    expect(screen.getByText("24:50")).toBeInTheDocument();
  });

  it("pauses worker and calls onPause when pause button is clicked", () => {
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onTimerComplete={onStop} />);
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
    render(<PomodoroTimer timePeriod={25} onStart={onStart} onPause={onPause} onTimerComplete={onStop} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate 1 minute elapsed
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 60 } });
    });

    const stopBtn = screen.getByRole("button", { name: /stop/i });
    fireEvent.click(stopBtn);

    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "reset" });
    expect(onStop).toHaveBeenCalledWith(1); // 1 minute elapsed
  });

  it("automatically stops when countdown reaches zero", () => {
    render(<PomodoroTimer timePeriod={1} onStart={onStart} onPause={onPause} onTimerComplete={onStop} />);
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate 60 seconds elapsed
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 60 } });
    });

    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(onStop).toHaveBeenCalledWith(1);
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "pause" });
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "reset" });
  });

  it("starts automatically on the very first render if autoStart is true", async () => {
    render(
      <PomodoroTimer
        autoStart={true}
        timePeriod={25}
        onStart={onStart}
        onPause={onPause}
        onTimerComplete={onStop}
      />
    );
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(onStart).toHaveBeenCalledWith(25);
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "start" });
  });

  it("automatically starts the next period if autoStart is true", async () => {
    const { rerender } = render(
      <PomodoroTimer
        autoStart={true}
        timePeriod={25}
        onStart={onStart}
        onPause={onPause}
        onTimerComplete={onStop}
      />
    );

    // Should have started automatically
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(onStart).toHaveBeenCalledTimes(1);

    // Simulate timer completion
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 25 * 60 } });
    });
    expect(onStop).toHaveBeenCalledTimes(1);

    // In a real app, PomodoroPage would now change the timePeriod prop
    // because nextEntryType would return a different type (e.g. SHORT_BREAK).
    rerender(
      <PomodoroTimer
        autoStart={true}
        timePeriod={5}
        onStart={onStart}
        onPause={onPause}
        onTimerComplete={onStop}
      />
    );

    // Check if it started automatically after timePeriod change
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(onStart).toHaveBeenCalledTimes(2);
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ command: "start" });

    // Simulate tick to verify it's using the NEW timePeriod (5 minutes)
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 10 } });
    });
    // 5:00 - 10s = 4:50
    expect(screen.getByText("04:50")).toBeInTheDocument();
  });

  it("automatically starts the next period if autoStart is true even if timePeriod is the same", async () => {
    const { rerender } = render(
      <PomodoroTimer
        autoStart={true}
        timePeriod={25}
        onStart={onStart}
        onPause={onPause}
        onTimerComplete={onStop}
        entries={[]}
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(onStart).toHaveBeenCalledTimes(1);

    // Simulate timer completion
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 25 * 60 } });
    });
    expect(onStop).toHaveBeenCalledTimes(1);

    // Rerender with SAME timePeriod but NEW entry
    rerender(
      <PomodoroTimer
        autoStart={true}
        timePeriod={25}
        onStart={onStart}
        onPause={onPause}
        onTimerComplete={onStop}
        entries={[{ id: "1", entryType: "WORK_INTERVAL", minutes: 25, created: "2023-01-01T00:00:00Z" } as any]}
      />
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(onStart).toHaveBeenCalledTimes(2);
  });

  it("plays sound with fade-in when timer reaches 30 seconds", async () => {
    jest.useFakeTimers();
    render(
      <PomodoroTimer
        timePeriod={1}
        onStart={onStart}
        onPause={onPause}
        onTimerComplete={onStop}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate tick at 30 seconds remaining
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 30 } });
    });
    expect(global.Audio).toHaveBeenCalledWith("/sound-effects/relaxing-guitar.mp3");
    expect(mockAudio.play).toHaveBeenCalledTimes(1);
    
    // Volume should start at 0
    expect(mockAudio.volume).toBe(0);

    // Advance time by 2.5 seconds (halfway through fade)
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    // volumeStep = 100 / 5000 = 0.02
    // after 2500ms (25 steps), volume should be 25 * 0.02 = 0.5
    expect(mockAudio.volume).toBeCloseTo(0.5);

    // Advance time by another 2.5 seconds (end of fade)
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(mockAudio.volume).toBe(1);
    expect(mockAudio.loop).toBe(true);

    // Verify it stops on completion
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 60 } });
    });
    expect(mockAudio.pause).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("changes color to red when timer reaches 15 seconds", () => {
    render(
      <PomodoroTimer
        timePeriod={1}
        onStart={onStart}
        onPause={onPause}
        onTimerComplete={onStop}
      />
    );

    const timerDisplay = screen.getByText("01:00");
    // Initial color should be inherit
    expect(timerDisplay).toHaveStyle({ color: "inherit" });

    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate tick at 16 seconds remaining (44 seconds elapsed)
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 44 } });
    });
    expect(screen.getByText("00:16")).toHaveStyle({ color: "inherit" });

    // Simulate tick at 15 seconds remaining (45 seconds elapsed)
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 45 } });
    });
    // MUI error.main might not be easily testable with toHaveStyle if it doesn't resolve theme,
    // but we can check if it's NOT inherit anymore if we can't get the exact hex.
    // However, usually JSDOM might not resolve MUI theme colors.
    // Let's see what happens.
    expect(screen.getByText("00:15")).not.toHaveStyle({ color: "inherit" });
  });

  it("stops sound when component is unmounted", async () => {
    const { unmount } = render(
      <PomodoroTimer
        timePeriod={1}
        onStart={onStart}
        onPause={onPause}
        onTimerComplete={onStop}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    // Simulate tick at 30 seconds remaining
    act(() => {
      mockWorker.onmessage({ data: { type: "tick", seconds: 30 } });
    });
    expect(mockAudio.play).toHaveBeenCalled();

    unmount();

    expect(mockAudio.pause).toHaveBeenCalled();
  });
});
