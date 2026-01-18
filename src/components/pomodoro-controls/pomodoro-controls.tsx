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
    <Box sx={{ position: "fixed", bottom: 0, left: 0, width: "100%", padding: "10px" }} bgcolor="rgba(255,255,255,0.4)">
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ px: 2 }}>
        <IconButton aria-label="start" onClick={startPomodoro}><PlayArrowIcon/></IconButton>
        <IconButton aria-label="pause" onClick={pausePomodoro}><PauseIcon/></IconButton>
        <IconButton aria-label="finish" onClick={stopPomodoro}><StopIcon/></IconButton>
      </Stack>
    </Box>
  );
};


export default PomodoroControls;