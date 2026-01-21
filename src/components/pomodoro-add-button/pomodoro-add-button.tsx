import { Fab, FabProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";

const PomodoroAddButton = (props: FabProps) => {
  return (
    <Fab
      {...props}
      color="primary"
      aria-label="add pomodoro"
      sx={{ position: "fixed", bottom: 16, right: 16 }}
    >
      <AddIcon/>
    </Fab>
  );
};

export default PomodoroAddButton;