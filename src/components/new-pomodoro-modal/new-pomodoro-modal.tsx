import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface NewPomodoroModalProps {
  show: boolean;
  onSubmit: (pomodoro: Pomodoro) => void;
  onCancel: () => void;
}

export default function NewPomodoroModal({
  show,
  onSubmit,
  onCancel,
}: NewPomodoroModalProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name || name.trim() === "") return;

    // We pass a partial Pomodoro that will be normalized by the factory/data-layer
    const payload = {
      name,
      notes,
      activityId: type, // Using the 'type' field as activityId for now or maybe it should be empty
    } as Partial<Pomodoro> as Pomodoro;

    onSubmit(payload);
    // Reset fields
    setName("");
    setNotes("");
    setType("");
  };

  const handleCancel = () => {
    onCancel();
    // Reset fields
    setName("");
    setNotes("");
    setType("");
  };

  const canSubmit = !!name && name.trim() !== "";

  return (
    <Dialog open={show} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ position: "relative" }}>
        New Pomodoro
        <Fab
          size="small"
          color="default"
          aria-label="close"
          onClick={handleCancel}
          sx={{ position: "absolute", right: 16, top: 8, boxShadow: 1 }}
        >
          <CloseIcon />
        </Fab>
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <TextField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={() => handleSubmit()}
          variant="contained"
          disabled={!canSubmit}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
