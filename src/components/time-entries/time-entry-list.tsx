import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useAppSelector } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import EditTimeEntryModal from "./edit-time-entry-modal";
import { updateTimeEntryThunk } from "@/features/time-entries/time-entries-slice";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import TimerIcon from "@mui/icons-material/Timer";
import ConfirmDeleteDialog from "./confirm-delete-dialog";
import toLocalYMD from "@/utils/to-local-ymd";
import { useAppDispatch } from "@/hooks";

interface Props {
  timeEntries: TimeEntry[];
  onDelete?: (timeEntry: TimeEntry) => void;
  onAddTime?: (entry: TimeEntry) => void;
  onStartStopWatch?: (entry: TimeEntry) => void;
}

export default function TimeEntryList({ timeEntries, onDelete, onAddTime, onStartStopWatch }: Props) {
  const activities = useAppSelector(selectActivities);
  const dispatch = useAppDispatch();

  const getActivityName = (id: string) => activities.find((a) => a.id === id)?.name ?? id;

  // Helper function to check if a date is today in UTC
  // This handles the case where a time entry is created late in the day in UTC
  // but might appear as yesterday in local time
  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;

    // Get today's date in UTC (YYYY-MM-DD)
    const todayUTC = new Date().toISOString().slice(0, 10);

    // Get the entry's date in UTC (YYYY-MM-DD)
    const entryUTC = new Date(dateStr).toISOString().slice(0, 10);

    return todayUTC === entryUTC;
  };

  const [showAll, setShowAll] = React.useState(false);
  const displayed = showAll ? timeEntries : timeEntries.filter((t) => t.created && isToday(t.created));

  const [editing, setEditing] = React.useState<TimeEntry | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<TimeEntry | null>(null);

  const handleOpen = (t: TimeEntry) => setEditing(t);
  const handleClose = () => setEditing(null);
  const handleSave = (entry: TimeEntry) => {
    dispatch(updateTimeEntryThunk(entry));
    handleClose();
  };

  const handleStartStopWatch = (entry: TimeEntry) => {
    if (onStartStopWatch) {
      onStartStopWatch(entry);
    }
  };


  const handleDelete = (entry: TimeEntry) => {
    setToDelete(entry);
    setConfirmOpen(true);
  };

  const handleAddTime = (entry: TimeEntry) => {
    if (onAddTime) {
      onAddTime(entry);
    }
  };

  const handleConfirm = (confirmed: boolean) => {
    const deleteMe = { ...toDelete };
    setConfirmOpen(false);
    setToDelete(null);
    if (!confirmed || !deleteMe || !onDelete) {
      return;
    }
    onDelete(deleteMe as TimeEntry);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6">{showAll ? "All Entries" : "Today's Entries"}</Typography>
        <Button size="small" onClick={() => setShowAll((s) => !s)}>
          {showAll ? "show today" : "show all"}
        </Button>
      </Box>
      {displayed.length === 0 && <Typography color="text.secondary">No time entries yet.</Typography>}
      {displayed.map((t) => (
        <Box
          key={t.id}
          sx={{
            mb: 1,
            p: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            cursor: "pointer",
            transition: "background-color 150ms ease, box-shadow 150ms ease",
            "&:hover": {
              backgroundColor: "action.hover",
              boxShadow: (theme) => `0 1px 3px ${theme.palette.mode === "light" ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.24)"}`,
            },
          }}
          onClick={() => handleOpen(t)}
        >
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={5} sm={3}><Typography>{getActivityName(t.activityId)}</Typography></Grid>
            <Grid item xs={3} sm={2}><Typography>{t.minutes} min</Typography></Grid>
            <Grid item xs={12} sm={2}
                  sx={{ display: { xs: "none", sm: "block" } }}><Typography>{toLocalYMD(new Date(t.created))}</Typography></Grid>
            <Grid item xs={12} sm={2}
                  sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography>{t.notes ?? ""}</Typography></Grid>
            <Grid item xs={4} sm={3} sx={{ textAlign: "right" }}>
              <IconButton size="small" aria-label={`timer-${t.id}`} onClick={(e) => {
                e.stopPropagation();
                handleStartStopWatch(t);
              }}>
                <TimerIcon fontSize="small"/>
              </IconButton>
              <IconButton size="small" aria-label={`more-time-${t.id}`} onClick={(e) => {
                e.stopPropagation();
                handleAddTime(t);
              }}>
                <MoreTimeIcon fontSize="small"/>
              </IconButton>
              <IconButton size="small" aria-label={`delete-${t.id}`} onClick={(e) => {
                e.stopPropagation();
                handleDelete(t);
              }}>
                <DeleteIcon fontSize="small"/>
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}
      {editing && (
        <EditTimeEntryModal open={Boolean(editing)} timeEntry={editing} onClose={handleClose} onSubmit={handleSave}/>
      )}
      <ConfirmDeleteDialog open={confirmOpen} entry={toDelete} onClose={handleConfirm}/>
    </Box>
  );
}
