import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";

interface Props {
  open: boolean;
  entry?: TimeEntry | null;
  onClose: (confirmed: boolean) => void;
}

export default function ConfirmDeleteDialog({ open, entry, onClose }: Props) {
  const activities = useAppSelector(selectActivities);
  const activityName = entry ? activities.find((a) => a.id === entry.activityId)?.name ?? entry.activityId : "";

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Delete time entry</DialogTitle>
      <DialogContent>
        <Typography>
          {`Are you sure you want to delete the time entry for "${activityName}" (${entry?.minutes} min)? This cannot be undone.`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button color="error" onClick={() => onClose(true)} variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

