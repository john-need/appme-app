import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import PomodoroControls from "@/components/pomodoro-controls/pomodoro-controls";
import { getStopWatchWorker } from "@/utils/get-worker";

interface PomodoroTimerProps {
  autoStart?: boolean;
  timePeriod: number; // minutes
  onStart: (minutes: number) => void;
  onPause: (minutes: number) => void;
  onTimerComplete: (minutes: number) => void;
  entries?: PomodoroEntry[];
}


const PomodoroTimer = ({autoStart = false, timePeriod, onStart, onPause, onTimerComplete, entries = [] }: PomodoroTimerProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState(timePeriod * 60);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const onTimerCompleteRef = useRef(onTimerComplete);
  const onStartRef = useRef(onStart);
  const onPauseRef = useRef(onPause);
  const timePeriodRef = useRef(timePeriod);
  const hasPlayedSoundRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    onTimerCompleteRef.current = onTimerComplete;
    onStartRef.current = onStart;
    onPauseRef.current = onPause;
    timePeriodRef.current = timePeriod;
  }, [onTimerComplete, onStart, onPause, timePeriod]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      audioRef.current = null;
    }
  };

  useEffect(() => {
    // Reset timer when timePeriod or entries change (indicating a new session/period)
    setRemainingSeconds(timePeriod * 60);
    hasPlayedSoundRef.current = false;
    stopAudio();
    // If it was running, we probably should stop it or at least pause it.
    // For now, let's just reset state.
    if (isRunning) {
      if (workerRef.current) {
        workerRef.current.postMessage({ command: "pause" });
        workerRef.current.postMessage({ command: "reset" });
      }
      setIsRunning(false);
    }

    console.log("timePeriod or entries changed to:", timePeriod, "autoStart:", autoStart);
    if (autoStart) {
      console.log("Attempting to internalStartTimer");
      setTimeout(() => {
        internalStartTimer(timePeriod * 60);
      }, 0);
    }
  }, [timePeriod, entries.length]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);




  const startTimer = () => {
    if (isRunning) return;
    internalStartTimer(remainingSeconds);
  };

  const internalStartTimer = (secondsLeft: number) => {
    if (!workerRef.current) {
      workerRef.current = getStopWatchWorker();
      if (workerRef.current) {
        workerRef.current.onmessage = (e: MessageEvent) => {
          if (e.data.type === "tick") {
            const elapsed = e.data.seconds;
            const next = timePeriodRef.current * 60 - elapsed;
            if (next <= 30 && !hasPlayedSoundRef.current) {
              const audio = new Audio("/sound-effects/relaxing-guitar.mp3");
              audio.loop = true;
              audioRef.current = audio;
              audio.volume = 0;
              audio.play().catch(e => console.error("Failed to play sound", e));

              const fadeDuration = 5000; // 5 seconds
              const intervalTime = 100; // update volume every 100ms
              const volumeStep = intervalTime / fadeDuration;

              const fadeInterval = setInterval(() => {
                if (audioRef.current === audio && audio.volume < 1) {
                  audio.volume = Math.min(1, audio.volume + volumeStep);
                } else {
                  clearInterval(fadeInterval);
                }
              }, intervalTime);

              hasPlayedSoundRef.current = true;
            }

            if (next <= 0) {
              // Countdown finished
              stopAudio();
              if (workerRef.current) {
                workerRef.current.postMessage({ command: "pause" });
                workerRef.current.postMessage({ command: "reset" });
              }
              onTimerCompleteRef.current(timePeriodRef.current);
              setRemainingSeconds(0);
              setIsRunning(autoStart);

            } else {
              setRemainingSeconds(next);
            }
          }
        };
      }
    }

    if (workerRef.current) {
      const elapsedSoFar = timePeriodRef.current * 60 - secondsLeft;
      workerRef.current.postMessage({ command: "set", seconds: elapsedSoFar });
      workerRef.current.postMessage({ command: "start" });
      setIsRunning(true);
      onStartRef.current(timePeriodRef.current);
    }
  };

  const pauseTimer = () => {
    if (!isRunning) return;
    stopAudio();
    if (workerRef.current) {
      workerRef.current.postMessage({ command: "pause" });
    }
    const elapsedMinutes = Math.floor((timePeriodRef.current * 60 - remainingSeconds) / 60);
    onPauseRef.current(elapsedMinutes);
    setIsRunning(false);
  };

  const stopTimer = () => {
    const elapsedMinutes = Math.floor((timePeriodRef.current * 60 - remainingSeconds) / 60);
    onTimerCompleteRef.current(elapsedMinutes);
    stopAudio();
    if (workerRef.current) {
      workerRef.current.postMessage({ command: "reset" });
    }
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
    <Box sx={{ textAlign: "center", py: 0}}>
      <Typography
        variant="h1"
        component="div"
        sx={{
          fontWeight: "bold",
          mb: 0,
          pb: 0,
          fontSize: "3rem",
          color: remainingSeconds <= 15 ? "error.main" : "inherit",
          transition: "color 0.5s ease-in-out",
        }}
      >
        {formatTime(remainingSeconds)}
      </Typography>
      <PomodoroControls
        isRunning={isRunning}
        startPomodoro={startTimer}
        pausePomodoro={pauseTimer}
        stopPomodoro={stopTimer}
      />
    </Box>
  );
};

export default PomodoroTimer;
