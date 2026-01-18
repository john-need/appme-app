import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import PomodoroControls from "@/components/pomodoro-controls/pomodoro-controls";
import { getStopWatchWorker } from "@/utils/get-worker";

interface PomodoroTimerProps {
  timePeriod: number; // minutes
  onStart: (minutes: number) => void;
  onPause: (minutes: number) => void;
  onStop: (minutes: number) => void;
}

const PomodoroTimer = ({ timePeriod, onStart, onPause, onStop }: PomodoroTimerProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState(timePeriod * 60);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Reset timer when timePeriod changes
    setRemainingSeconds(timePeriod * 60);
    // If it was running, we probably should stop it or at least pause it.
    // For now, let's just reset state.
    if (isRunning) {
      if (workerRef.current) {
        workerRef.current.postMessage({ command: "pause" });
        workerRef.current.postMessage({ command: "reset" });
      }
      setIsRunning(false);
    }
  }, [timePeriod]);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const startTimer = () => {
    if (isRunning) return;

    if (!workerRef.current) {
      workerRef.current = getStopWatchWorker();
      if (workerRef.current) {
        workerRef.current.onmessage = (e: MessageEvent) => {
          if (e.data.type === "tick") {
            const elapsed = e.data.seconds;
            setRemainingSeconds((prev) => {
              const next = timePeriod * 60 - elapsed;
              if (next <= 0) {
                // Countdown finished
                if (workerRef.current) {
                  workerRef.current.postMessage({ command: "pause" });
                }
                setIsRunning(false);
                onStop(timePeriod);
                return 0;
              }
              return next;
            });
          }
        };
      }
    }

    if (workerRef.current) {
      const elapsedSoFar = timePeriod * 60 - remainingSeconds;
      workerRef.current.postMessage({ command: "set", seconds: elapsedSoFar });
      workerRef.current.postMessage({ command: "start" });
      setIsRunning(true);
      onStart(timePeriod);
    }
  };

  const pauseTimer = () => {
    if (!isRunning) return;
    if (workerRef.current) {
      workerRef.current.postMessage({ command: "pause" });
    }
    const elapsedMinutes = Math.floor((timePeriod * 60 - remainingSeconds) / 60);
    onPause(elapsedMinutes);
    setIsRunning(false);
  };

  const stopTimer = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ command: "pause" });
      workerRef.current.postMessage({ command: "reset" });
    }
    const elapsedMinutes = Math.floor((timePeriod * 60 - remainingSeconds) / 60);
    onStop(elapsedMinutes);
    setIsRunning(false);
    setRemainingSeconds(timePeriod * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    const hStr = h > 0 ? h.toString().padStart(2, "0") + ":" : "";
    const mStr = m.toString().padStart(2, "0");
    const sStr = s.toString().padStart(2, "0");
    
    return `${hStr}${mStr}:${sStr}`;
  };

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h1" component="div" sx={{ fontWeight: "bold", mb: 2 }}>
        {formatTime(remainingSeconds)}
      </Typography>
      <PomodoroControls
        startPomodoro={startTimer}
        pausePomodoro={pauseTimer}
        stopPomodoro={stopTimer}
      />
    </Box>
  );
};

export default PomodoroTimer;
