import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Divider, Fab, Stack
} from "@mui/material";
import TimeEntryList from "./time-entry-list";
import { TimeEntry as TimeEntryControl } from "../time-entry/time-entry";
import timeEntryFactory from "@/factories/time-entry-factory";
import AddIcon from "@mui/icons-material/Add";
import TimerIcon from "@mui/icons-material/Timer";

interface Props {
  todayActivities: Activity[];
  otherActivities: Activity[];
  activities: Activity[];
  timeEntries: TimeEntry[];
  onAddTime: (entry: TimeEntry) => void;
  startStopWatch?: (entry: TimeEntry) => void;
  onDeleteTimeEntry?: (id: string) => void;
  onAddTimeEntry?: (entry: TimeEntry) => void;
}

const TimeEntries = ({todayActivities, otherActivities, timeEntries, onAddTime, startStopWatch, onDeleteTimeEntry, onAddTimeEntry }: Props) => {

  // Get today's date in local time (YYYY-MM-DD format)
  const today = new Date().toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD format
  const [date, setDate] = useState<string>(today);
  const [activityId, setActivityId] = useState<string>("");
  const [minutes, setMinutes] = useState<number | undefined>(0);
  const [notes, setNotes] = useState<string>("");


  const canSubmit = activityId && activityId !== "" && minutes !== undefined && minutes >= 0 && date !== "";

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!canSubmit || !onAddTimeEntry) {
      return;
    }

    const payload = timeEntryFactory({
      activityId,
      minutes: minutes ?? 0,
      notes: notes || undefined,
    });

    // update exclusion set
    // setExcludedActivityIds((prev) => {
    //   const next = new Set(prev);
    //   next.add(activityId);
    //   return next;
    // });

    const newFirst = todayActivities[0]?.id ?? otherActivities[0]?.id ?? "";
    setActivityId(newFirst);
    onAddTimeEntry(payload);

    // reset form
    setMinutes(0);
    setNotes("");
    setDate(today);
  };

  const handleStartTimer = () => {
    if (!onAddTimeEntry || !startStopWatch || !activityId) {
      return;
    }

    const payload = timeEntryFactory({
      activityId,
      minutes: 0,
    });

    // update exclusion set (pattern from handleSubmit)
    // setExcludedActivityIds((prev) => {
    //   const next = new Set(prev);
    //   next.add(activityId);
    //   return next;
    // });

    const newFirst = todayActivities[0]?.id ?? otherActivities[0]?.id ?? "";
     setActivityId(newFirst);

    onAddTimeEntry(payload);
    startStopWatch(payload);
  };

  const handleDeleteTimeEntry = (timeEntry: TimeEntry) => {
    if (!onDeleteTimeEntry || !timeEntry) {
      console.error("Failed to delete time entry ", timeEntry);
      return;
    }

    onDeleteTimeEntry(timeEntry.id);

    // setExcludedActivityIds((prev) => {
    //   const n = new Set(prev);
    //   n.delete(timeEntry.activityId);
    //   return n;
    // });
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12, sm: 5 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ aspectRatio: "1 / 1", width: "40px" }}>
                <Fab
                  color="primary"
                  data-testid="start-timer-button"
                  size="small"
                  aria-label="Add"

                  onClick={handleStartTimer}
                  disabled={!canSubmit}>
                  <TimerIcon/>
                </Fab>
              </Box>
              <FormControl fullWidth>
                <InputLabel id="activity-select-label">Activity</InputLabel>
                <Select labelId="activity-select-label" value={activityId} label="Activity"
                        data-testid="activity-select"

                        onChange={(e) => setActivityId(e.target.value as string)}>
                  {todayActivities.map((a) => (
                    <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                  ))}
                  {todayActivities.length > 0 && otherActivities.length > 0 && <Divider component="li"/>}
                  {otherActivities.map((a) => (
                    <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                  ))}
                  {todayActivities.length === 0 && otherActivities.length === 0 && (
                    <MenuItem value="" disabled>
                      Huzzah! You&#39;ve done all the things.
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

            </Stack>
          </Grid>
          <Grid size={{ xs: 10, sm: 3 }}>
            <TimeEntryControl
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} sx={{ display: { xs: "none", sm: "block" } }}>
            <TextField label="Notes"
                       fullWidth
                       multiline
                       minRows={1}
                       value={notes}
                       onChange={(e) => setNotes(e.target.value)}/>
          </Grid>
          <Grid size={{ xs: 2, sm: 1 }}>
            <Button variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ display: { xs: "none", sm: "block" } }}
                    disabled={!canSubmit}
                    fullWidth>
              {"Add"}
            </Button>
            <Fab
              color="primary"
              size="small"
              aria-label="Add"
              type="submit"
              sx={{ display: { sm: "none" } }}
              disabled={!canSubmit}>
              <AddIcon/>
            </Fab>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ marginBottom: "20px" }}/>
      <TimeEntryList timeEntries={timeEntries}
                     onAddTime={onAddTime}
                     onStartStopWatch={startStopWatch}
                     onDelete={handleDeleteTimeEntry}/>
    </Box>
  );
};

export default TimeEntries;
