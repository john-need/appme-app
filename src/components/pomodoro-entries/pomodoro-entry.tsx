import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { formatTime, calculateDuration } from "@/utils";

interface PomodoroEntryProps {
  entry: PomodoroEntry;
  onEntryActivityChange: (entryId: string, newActivityId: string) => void;
  activities: Activity[];
}

const pomodoroTimerEntryTypeMap: Record<PomodoroEntryType, string> = {
  WORK_INTERVAL: "Work Interval",
  SHORT_BREAK: "Short Break",
  LONG_BREAK: "Long Break",
} as const;



const PomodoroEntry = ({ entry, onEntryActivityChange, activities }: PomodoroEntryProps) => {
  const startDate = new Date(entry.created);
  const endDate = new Date(startDate.getTime() + entry.minutes * 60000);
  const activity = activities.find((a) => a.id === entry.activityId);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 6, sm: 2 }}>
        <Typography variant="caption" sx={{ display: { sm: "none" } }} color="textSecondary">
          Start:{" "}
        </Typography>
        {formatTime(entry.created)}
      </Grid>
      <Grid size={{ xs: 6, sm: 2 }}>
        <Typography variant="caption" sx={{ display: { sm: "none" } }} color="textSecondary">
          End:{" "}
        </Typography>
        {formatTime(endDate.toISOString())}
      </Grid>
      <Grid size={{ xs: 6, sm: 2 }}>
        <Typography variant="caption" sx={{ display: { sm: "none" } }} color="textSecondary">
          Total:{" "}
        </Typography>
        {calculateDuration(entry.minutes)}
      </Grid>
      <Grid size={{ xs: 2 }}>
        {pomodoroTimerEntryTypeMap[entry.entryType]}
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Autocomplete
          options={activities}
          getOptionLabel={(option) => option.name}
          value={activity || null}
          onChange={(_, newValue) => {
            if (newValue) {
              onEntryActivityChange(entry.id, newValue.id);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} variant="standard" size="small"/>
          )}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};


export default PomodoroEntry;
