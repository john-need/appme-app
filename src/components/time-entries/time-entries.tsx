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
import { useAppSelector } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import TimeEntryList from "./time-entry-list";
import timeEntryFactory from "@/factories/time-entry-factory";
import AddIcon from "@mui/icons-material/Add";
import TimerIcon from "@mui/icons-material/Timer";

interface Props {
  timeEntries: TimeEntry[];
  onAddTime: (entry: TimeEntry) => void;
  startStopWatch?: (entry: TimeEntry) => void;
  onDeleteTimeEntry?: (id: string) => void;
  onAddTimeEntry?: (entry: TimeEntry) => void;
}

const TimeEntries = ({ timeEntries, onAddTime, startStopWatch, onDeleteTimeEntry, onAddTimeEntry }: Props) => {
  const activities = useAppSelector(selectActivities);
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const [activityId, setActivityId] = useState<string>("");
  const [minutes, setMinutes] = useState<number | string>("");
  const [notes, setNotes] = useState<string>("");
  // optimistically excluded activity ids (hide immediately after submission)
  const [excludedActivityIds, setExcludedActivityIds] = React.useState<Set<string>>(new Set());

  // Compute activities already logged for today (normalize entry dates to YYYY-MM-DD)
  const todayActivityIds = new Set(
    timeEntries
      .map((t) => {
        try {
          return t.created ? new Date(t.created).toISOString().slice(0, 10) : undefined;
        } catch (e) {
          return undefined;
        }
      })
      .map((d, i) => ({ d, id: timeEntries[i].activityId }))
      .filter((x) => x.d === today)
      .map((x) => x.id)
  );

  // Determine today's weekday
  const dayIndex = new Date().getDay(); // 0=Sun .. 6=Sat

  const matchesToday = (a: Activity) => {
    const days = [
      Boolean(a.sunday) || Boolean(a.weekends),
      Boolean(a.monday),
      Boolean(a.tuesday),
      Boolean(a.wednesday),
      Boolean(a.thursday),
      Boolean(a.friday),
      Boolean(a.saturday) || Boolean(a.weekends)
    ];
    return days[dayIndex];
  };

  // Filter out activities that already have a time entry today or were optimistically excluded
  const availableActivities = activities.filter((a) => !todayActivityIds.has(a.id) && !excludedActivityIds.has(a.id));

  const group1 = availableActivities.filter(matchesToday).sort((x, y) => x.name.localeCompare(y.name));
  const group2 = availableActivities.filter((a) => !matchesToday(a)).sort((x, y) => x.name.localeCompare(y.name));

  // TODO: remove this
  // keep selection in sync when available activities change
  React.useEffect(() => {
    const first = group1[0]?.id ?? group2[0]?.id ?? "";
    // if the current selection is missing or no longer available, pick the first
    const currentValid = activityId && availableActivities.some((a) => a.id === activityId);
    if (!currentValid) setActivityId(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableActivities.length, group1.length, group2.length, excludedActivityIds.size, timeEntries.length]);

  const canSubmit = activityId && activityId !== "" && Number(minutes) >= 0 && date !== "";

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!canSubmit || !onAddTimeEntry) {
      return;
    }

    const payload = timeEntryFactory({
      activityId,
      minutes: Number(minutes),
      notes: notes || undefined,
    });

    // update exclusion set
    setExcludedActivityIds((prev) => {
      const next = new Set(prev);
      next.add(activityId);
      return next;
    });

    // immediately pick a new valid activityId so the Select value is always in the available options
    // compute available activities after the optimistic exclusion
    const newAvailable = activities.filter((a) => !todayActivityIds.has(a.id) && !excludedActivityIds.has(a.id) && a.id !== activityId);
    const newGroup1 = newAvailable.filter(matchesToday).sort((x, y) => x.name.localeCompare(y.name));
    const newGroup2 = newAvailable.filter((a) => !matchesToday(a)).sort((x, y) => x.name.localeCompare(y.name));
    const newFirst = newGroup1[0]?.id ?? newGroup2[0]?.id ?? "";
    setActivityId(newFirst);
    onAddTimeEntry(payload);

    // reset form
    setMinutes("");
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
    setExcludedActivityIds((prev) => {
      const next = new Set(prev);
      next.add(activityId);
      return next;
    });

    // immediately pick a new valid activityId so the Select value is always in the available options
    const newAvailable = activities.filter((a) => !todayActivityIds.has(a.id) && !excludedActivityIds.has(a.id) && a.id !== activityId);
    const newGroup1 = newAvailable.filter(matchesToday).sort((x, y) => x.name.localeCompare(y.name));
    const newGroup2 = newAvailable.filter((a) => !matchesToday(a)).sort((x, y) => x.name.localeCompare(y.name));
    const newFirst = newGroup1[0]?.id ?? newGroup2[0]?.id ?? "";
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

    setExcludedActivityIds((prev) => {
      const n = new Set(prev);
      n.delete(timeEntry.activityId);
      return n;
    });
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={7} sm={6}>
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
                  {group1.map((a) => (
                    <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                  ))}
                  {group1.length > 0 && group2.length > 0 && <Divider component="li"/>}
                  {group2.map((a) => (
                    <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                  ))}
                  {group1.length === 0 && group2.length === 0 && (
                    <MenuItem value="" disabled>
                      Huzzah! You&#39;ve done all the things.
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

            </Stack>
          </Grid>
          <Grid item xs={3} sm={1}>
            <TextField label="Minutes"
                       type="number"
                       fullWidth
                       value={minutes}
                       onChange={(e) => {
                         const val = Number(e.target.value);
                         if (isNaN(val) || val < 0) {
                           setMinutes(0);
                         } else {
                           setMinutes(Math.round(val));
                         }
                       }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: { xs: "none", sm: "block" } }}>
            <TextField label="Notes"
                       fullWidth
                       multiline
                       minRows={1}
                       value={notes}
                       onChange={(e) => setNotes(e.target.value)}/>
          </Grid>
          <Grid item xs={2} sm={1}>
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
