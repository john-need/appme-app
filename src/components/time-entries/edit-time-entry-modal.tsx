import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Fab, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toLocalYMD from "@/utils/to-local-ymd";
import formatTime from "@/utils/format-time";
import { TimeEntry as TimeEntryControl } from "../time-entry/time-entry";

interface Props {
  open: boolean;
  timeEntry: TimeEntry;
  onClose: () => void;
  onSubmit: (entry: TimeEntry) => void;
}

export default function EditTimeEntryModal({ open, timeEntry, onClose, onSubmit }: Props) {
  const [minutes, setMinutes] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (timeEntry) {
      setMinutes(typeof timeEntry.minutes === "number" ? timeEntry.minutes : undefined);
      setNotes(timeEntry.notes ?? "");
    }
  }, [timeEntry]);

  const canSubmit = minutes !== undefined && minutes >= 1;

  const handleSave = () => {
    if (!timeEntry) return;
    if (!canSubmit) return;
    const updated: TimeEntry = {
      ...timeEntry,
      minutes: minutes,
      notes: notes || undefined,
      updated: new Date().toISOString(),
    };
    onSubmit(updated);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ position: "relative" }}>
        Edit Time Entry
        <Fab size="small" color="default" aria-label="close" onClick={onClose}
             sx={{ position: "absolute", right: 16, top: 8 }}>
          <CloseIcon/>
        </Fab>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TimeEntryControl
            label="Minutes"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
          <TextField label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth
                     multiline minRows={3}/>
          <Typography>{toLocalYMD(timeEntry.created)} {formatTime(timeEntry.created)}</Typography>
          <Typography>{timeEntry.created}</Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSave} variant="contained" disabled={!canSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

