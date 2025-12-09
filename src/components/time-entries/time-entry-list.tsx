import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useAppSelector } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import EditTimeEntryModal from "./edit-time-entry-modal";
import useUpdateTimeEntry from "@/hooks/use-update-time-entry";
import useDeleteTimeEntry from "@/hooks/use-delete-time-entry";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ConfirmDeleteDialog from "./confirm-delete-dialog";

interface Props {
  timeEntries: TimeEntry[];
  onEntryDeleted?: (activityId: string) => void;
}

export default function TimeEntryList({ timeEntries, onEntryDeleted: propsOnEntryDeleted }: Props) {
  const activities = useAppSelector(selectActivities);
  const updateMutation = useUpdateTimeEntry();
  const deleteMutation = useDeleteTimeEntry();
  const getActivityName = (id: string) => activities.find((a) => a.id === id)?.name ?? id;

  // helper: local YYYY-MM-DD for a Date/ISO string
  const toLocalYMD = (v?: string) => {
    if (!v) return "";
    const d = new Date(v);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayLocal = toLocalYMD(new Date().toISOString());

  const [showAll, setShowAll] = React.useState(false);
  const displayed = showAll ? timeEntries : timeEntries.filter((t) => toLocalYMD(t.created) === todayLocal);

  const [editing, setEditing] = React.useState<TimeEntry | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<TimeEntry | null>(null);

  const handleOpen = (t: TimeEntry) => setEditing(t);
  const handleClose = () => setEditing(null);
  const handleSave = (entry: TimeEntry) => {
    updateMutation.mutate(entry);
    handleClose();
  };

  const handleDelete = (entry: TimeEntry) => {
    setToDelete(entry);
    setConfirmOpen(true);
  };

  const handleConfirm = (confirmed: boolean) => {
    setConfirmOpen(false);
    if (confirmed && toDelete) {
      const id = toDelete.id;
      const aid = toDelete.activityId;
      setToDelete(null);
      // pass onSuccess to notify parent so it can remove any optimistic exclusion
      deleteMutation.mutate(id, {
        onSuccess() {
          if (propsOnEntryDeleted) propsOnEntryDeleted(aid);
        },
      });
    } else {
      setToDelete(null);
    }
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
            <Grid item xs={5}><Typography>{getActivityName(t.activityId)}</Typography></Grid>
            <Grid item xs={4}><Typography>{t.minutes} min</Typography></Grid>
            <Grid item xs={2}><Typography>{t.notes ?? ""}</Typography></Grid>
            <Grid item xs={1}>
              <IconButton size="small" aria-label={`delete-${t.id}`} onClick={(e) => { e.stopPropagation(); handleDelete(t); }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}
      {editing && (
        <EditTimeEntryModal open={Boolean(editing)} timeEntry={editing} onClose={handleClose} onSubmit={handleSave} />
      )}
      <ConfirmDeleteDialog open={confirmOpen} entry={toDelete} onClose={handleConfirm} />
    </Box>
  );
}
