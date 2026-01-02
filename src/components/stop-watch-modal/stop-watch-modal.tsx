import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

interface StopWatchModalProps {
  open: boolean;
  timeEntry: TimeEntry;
  onClose: () => void;
  onSubmit: (timeEntry: TimeEntry) => void;
  activityName: string;
}

export const StopWatchModal: React.FC<StopWatchModalProps> = ({
                                                                open,
                                                                timeEntry,
                                                                onClose,
                                                                onSubmit,
                                                                activityName,
                                                              }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (!open) {
      setSeconds(0);
      setIsActive(false);
      setShowResetConfirm(false);
      setShowCancelConfirm(false);
      setShowSavePrompt(false);
    }
  }, [open]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setSeconds(0);
    setIsActive(false);
    setShowResetConfirm(false);
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    onClose();
  };

  const handleSaveClick = () => {
    setIsActive(false);
    setShowSavePrompt(true);
  };

  const handleSubmit = (timeEntry: TimeEntry) => {
    onSubmit(timeEntry);
    setShowSavePrompt(false);
    onClose();
  };


  const handleResume = () => {
    setShowSavePrompt(false);
    setIsActive(true);
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancelClick} maxWidth="xs" fullWidth>
        <DialogTitle>Stopwatch: {activityName}</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", my: 2 }}>
            <Typography variant="h6">Current: {timeEntry.minutes} min</Typography>
            <Typography variant="h3" sx={{ fontVariantNumeric: "tabular-nums", my: 2 }}>
              {formatTime(seconds)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", flexWrap: "wrap", gap: 1, pb: 2 }}>
          {!isActive ? (
            <Button variant="contained" color="primary" onClick={handleStart}>
              start
            </Button>
          ) : (
            <Button variant="contained" color="warning" onClick={handlePause}>
              pause
            </Button>
          )}
          <Button variant="outlined" color="error" onClick={handleResetClick}>
            reset
          </Button>
          <Button variant="outlined" onClick={handleCancelClick}>
            cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSaveClick}>
            save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Confirmation */}
      <Dialog open={showResetConfirm} onClose={() => setShowResetConfirm(false)}>
        <DialogTitle>Reset Timer</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reset the timer to 0:00?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetConfirm(false)}>No</Button>
          <Button onClick={confirmReset} color="error" variant="contained">
            Yes, Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirmation */}
      <Dialog open={showCancelConfirm} onClose={() => setShowCancelConfirm(false)}>
        <DialogTitle>Cancel</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to close without saving?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelConfirm(false)}>No</Button>
          <Button onClick={confirmCancel} color="error" variant="contained">
            Yes, Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Prompt */}
      <Dialog open={showSavePrompt} onClose={() => setShowSavePrompt(false)}>
        <DialogTitle>Save Time</DialogTitle>
        <DialogContent>
          <Typography>
            You have {timeEntry.minutes} minutes recorded. What would you like to do?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
          <Button fullWidth variant="contained"
                  onClick={() => handleSubmit({ ...timeEntry, minutes: Math.floor(seconds / 60) + timeEntry.minutes })}>
            add to current time
          </Button>
          <Button fullWidth variant="contained"
                  onClick={() => handleSubmit({ ...timeEntry, minutes: Math.floor(seconds / 60) })}>
            save
          </Button>
          <Button fullWidth onClick={handleResume}>
            resume
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
