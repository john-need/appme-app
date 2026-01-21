import React from "react";
import {
  Grid,
  Typography,
  Box,
} from "@mui/material";
import PomodoroEntry from "./pomodoro-entry";

interface PomodoroEntriesProps {
  entries: PomodoroEntry[];
  onEntryActivityChange: (entryId: string, newActivityId: string) => void;
  activities: Activity[];
}

const PomodoroEntries = ({ entries, onEntryActivityChange, activities }: PomodoroEntriesProps) => {



  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Entries
      </Typography>

        <Grid container spacing={2} sx={{ fontWeight: "bold" }}>
          <Grid item xs={2}>
            Start Time
          </Grid>
          <Grid item xs={2}>
            End Time
          </Grid>
          <Grid item xs={2}>
            Total Time
          </Grid>
          <Grid item xs={2}>
            Type
          </Grid>
          <Grid item xs={4}>
            Activity
          </Grid>
        </Grid>

      {
        entries.map(
          (entry) => (
            <PomodoroEntry
              key={entry.id}
              entry={entry}
              activities={activities}
              onEntryActivityChange={onEntryActivityChange}/>
          ))
      }
    </Box>
  );
};

export default PomodoroEntries;
