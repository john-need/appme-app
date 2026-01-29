import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TimeEntry as TimeEntryControl } from "../time-entry/time-entry";

interface AddTimeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (minutes: number) => void;
}

export const AddTimeModal: React.FC<AddTimeModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [minutes, setMinutes] = useState<number | undefined>(0);

  React.useEffect(() => {
    if (!open) {
      setMinutes(0);
    }
  }, [open]);

  const handleSave = () => {
    if (minutes !== undefined && minutes > 0) {
      onSubmit(minutes);
      onClose();
    }
  };

  const canSubmit = minutes !== undefined && minutes > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ position: "relative" }}>
        Add Time
        <Fab
          size="small"
          color="default"
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 8, boxShadow: 1 }}
        >
          <CloseIcon />
        </Fab>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TimeEntryControl
            label="Additional Minutes"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" disabled={!canSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
