import React from "react";
import { Box, IconButton, Stack } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface PomodoroControlsProps {
  startPomodoro: () => void;
  pausePomodoro: () => void;
  isRunning: boolean;
  stopPomodoro?: () => void;
}

const PomodoroControls = ({ startPomodoro, pausePomodoro, isRunning, stopPomodoro }: PomodoroControlsProps) => {
  return (
    <Box>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ px: 2 }}>
        {!isRunning && <Box>
          <IconButton
            aria-label="start"
            onClick={startPomodoro}>
            <PlayArrowIcon/>
          </IconButton>
        </Box>}
        {isRunning &&
          <Box>
            <IconButton
              aria-label="pause"
              onClick={pausePomodoro}>
              <PauseIcon/>
            </IconButton>
          </Box>}
        <Box>
          <IconButton
            aria-label="stop"
            onClick={stopPomodoro || pausePomodoro}>
            <StopIcon/>
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
};


export default PomodoroControls;