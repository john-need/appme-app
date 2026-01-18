import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";


interface PomodoroAddButtonProps {
  addPomodoro: (p: Partial<Pomodoro>) => void;
}

const PomodoroAddButton = ({addPomodoro}: PomodoroAddButtonProps) => {
  return (
    <Fab
      color="primary"
      aria-label="add pomodoro"
      sx={{ position: "fixed", bottom: 16, right: 16 }}
      onClick={() => addPomodoro({ name: "New Pomodoro" })}
    >
      <AddIcon/>
    </Fab>
  );
};

export default PomodoroAddButton;