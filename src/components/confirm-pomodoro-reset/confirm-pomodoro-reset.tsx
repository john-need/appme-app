import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ConfirmPomodoroResetProps {
  showModal: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onClose: () => void;
}

const ConfirmPomodoroReset: React.FC<ConfirmPomodoroResetProps> = ({
  showModal,
  onSave,
  onDiscard,
  onClose,
}) => {
  return (
    <Dialog open={showModal} onClose={onClose} maxWidth="xs" fullWidth>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ flexGrow: 1 }}>
          Confirm
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ mr: 1 }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent>
        <Typography>Your are about to stop the current pomodoro.</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onSave} variant="contained" color="primary">
          Save and Reset Pomodoro
        </Button>
        <Button onClick={onDiscard} variant="outlined" color="error">
         Discard and Start New Pomodoro
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPomodoroReset;
