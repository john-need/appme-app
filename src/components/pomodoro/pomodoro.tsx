import React from "react";
import {
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
} from "@mui/material";
import { useAppSelector } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import iso2LocalDateTime from "@/utils/iso-2-local-date-time";

interface PomodoroProps {
  pomodoro: Pomodoro | null;
  onChange: (pomodoro: Pomodoro) => void;
}

const PomodoroComponent = ({ pomodoro, onChange }: PomodoroProps) => {
  const activities = useAppSelector(selectActivities);

  if (!pomodoro) {
    return <Typography>No active Pomodoro</Typography>;
  }

  const handleFieldChange = (field: keyof Pomodoro, value: string) => {
    onChange({ ...pomodoro, [field]: value });
  };

  const handleActivityChange = (newActivityId: string) => {
    onChange({ ...pomodoro, activityId: newActivityId });
  };

  const handleEntryActivityChange = (entryId: string, newActivityId: string) => {
    const updatedEntries = pomodoro.entries.map((entry) =>
      entry.id === entryId ? { ...entry, activityId: newActivityId } : entry
    );
    onChange({ ...pomodoro, entries: updatedEntries });
  };

  const sortedEntries = [...pomodoro.entries].sort((a, b) =>
    b.created.localeCompare(a.created)
  );

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const activeActivity = activities.find((a) => a.id === pomodoro.activityId);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
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
            <TextField {...params} label="Activity" fullWidth />
          )}
          fullWidth
        />
        <Typography variant="body2" color="textSecondary">
          Created: {iso2LocalDateTime(pomodoro.created)}
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        Entries
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Total Time</TableCell>
              <TableCell>Activity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEntries.map((entry) => {
              const startDate = new Date(entry.created);
              const endDate = new Date(startDate.getTime() + entry.minutes * 60000);
              const activity = activities.find((a) => a.id === entry.activityId);

              return (
                <TableRow key={entry.id}>
                  <TableCell>{formatTime(entry.created)}</TableCell>
                  <TableCell>{formatTime(endDate.toISOString())}</TableCell>
                  <TableCell>{calculateDuration(entry.minutes)}</TableCell>
                  <TableCell>
                    <Autocomplete
                      options={activities}
                      getOptionLabel={(option) => option.name}
                      value={activity || null}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          handleEntryActivityChange(entry.id, newValue.id);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" size="small" />
                      )}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PomodoroComponent;