import React from "react";
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import iso2LocalDateTime from "@/utils/iso-2-local-date-time";

interface PomodoroProps {
  pomodoro: Pomodoro | null;
  onChange: (pomodoro: Pomodoro) => void;
  activities: Activity[];
}

const PomodoroComponent = ({ pomodoro, onChange, activities }: PomodoroProps) => {

  if (!pomodoro) {
    return <Typography>No active Pomodoro</Typography>;
  }

  const handleFieldChange = (field: keyof Pomodoro, value: string) => {
    onChange({ ...pomodoro, [field]: value });
  };

  const handleActivityChange = (newActivityId: string) => {
    onChange({ ...pomodoro, activityId: newActivityId });
  };

  const activeActivity = activities.find((a) => a.id === pomodoro.activityId);

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Name"
          value={pomodoro.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          fullWidth
        />
        <Autocomplete
          options={activities}
          getOptionLabel={(option) => option.name}
          value={activeActivity || null}
          onChange={(_, newValue) => {
            if (newValue) {
              handleActivityChange(newValue.id);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Activity" fullWidth/>
          )}
          fullWidth
        />
        <Typography variant="body2" color="textSecondary">
          {iso2LocalDateTime(pomodoro.created)}
        </Typography>
      </Box>
    </Box>
  );
};

export default PomodoroComponent;