import React from "react";
import { Box, IconButton, Stack } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface PomodoroControlsProps {
  startPomodoro: () => void;
  pausePomodoro: () => void;
  stopPomodoro: () => void;
}

const PomodoroControls = ({ startPomodoro, pausePomodoro, stopPomodoro }: PomodoroControlsProps) => {
  return (
    <Box>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ px: 2 }}>
        <IconButton aria-label="start" onClick={startPomodoro}><PlayArrowIcon/></IconButton>
        <IconButton aria-label="pause" onClick={pausePomodoro}><PauseIcon/></IconButton>
        <IconButton aria-label="finish" onClick={stopPomodoro}><StopIcon/></IconButton>
      </Stack>
    </Box>
  );
};


export default PomodoroControls;