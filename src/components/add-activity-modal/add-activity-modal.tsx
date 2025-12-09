import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AddActivityModalProps {
  onClose: () => void;
  onSubmit: (activity: Partial<Activity>) => void;
}

export default function AddActivityModal({ onClose, onSubmit }: AddActivityModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ActivityType>("TASSEI");
  const [comment, setComment] = useState("");
  const [goal, setGoal] = useState<number | "">("");

  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);
  const [weekends, setWeekends] = useState(false);

  // Handlers to keep weekends and saturday/sunday mutually exclusive
  const handleWeekendsChange = (checked: boolean) => {
    setWeekends(checked);
    if (checked) {
      setSaturday(false);
      setSunday(false);
    }
  };

  const handleSaturdayChange = (checked: boolean) => {
    setSaturday(checked);
    if (checked) {
      setWeekends(false);
    }
  };

  const handleSundayChange = (checked: boolean) => {
    setSunday(checked);
    if (checked) {
      setWeekends(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    // basic validation: require name and goal >= 1
    const goalNumber = goal === "" ? NaN : Number(goal);
    if (!name || name.trim() === "" || isNaN(goalNumber) || goalNumber < 1) return;
    const payload: Partial<Activity> = {
      name: name || undefined,
      type: type,
      comment: comment || undefined,
      goal: goal === "" ? undefined : (Number(goal) as number),
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      weekends,
    };
    onSubmit(payload);
  };

  // form validation state
  const goalNumber = goal === "" ? NaN : Number(goal);
  const canSubmit = !!name && name.trim() !== "" && !isNaN(goalNumber) && goalNumber >= 1;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ position: "relative" }}>
        Add Activity
        {/* FAB styled as small close button in upper-right */}
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
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

          <FormControl fullWidth>
            <InputLabel id="activity-type-label">Type</InputLabel>
            <Select
              labelId="activity-type-label"
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value as ActivityType)}
            >
              <MenuItem value="TASSEI">TASSEI</MenuItem>
              <MenuItem value="MUDA">MUDA</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Goal"
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value === "" ? "" : Number(e.target.value))}
            fullWidth
          />

          <TextField
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Schedule
            </Typography>

            <FormGroup row>
              <FormControlLabel control={<Checkbox checked={monday} onChange={(e) => setMonday(e.target.checked)} />} label="Mon" />
              <FormControlLabel control={<Checkbox checked={tuesday} onChange={(e) => setTuesday(e.target.checked)} />} label="Tue" />
              <FormControlLabel control={<Checkbox checked={wednesday} onChange={(e) => setWednesday(e.target.checked)} />} label="Wed" />
              <FormControlLabel control={<Checkbox checked={thursday} onChange={(e) => setThursday(e.target.checked)} />} label="Thu" />
              <FormControlLabel control={<Checkbox checked={friday} onChange={(e) => setFriday(e.target.checked)} />} label="Fri" />
              <FormControlLabel control={<Checkbox checked={saturday} onChange={(e) => handleSaturdayChange(e.target.checked)} />} label="Sat" />
              <FormControlLabel control={<Checkbox checked={sunday} onChange={(e) => handleSundayChange(e.target.checked)} />} label="Sun" />
              <FormControlLabel control={<Checkbox checked={weekends} onChange={(e) => handleWeekendsChange(e.target.checked)} />} label="Weekends" />
            </FormGroup>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => handleSubmit()} variant="contained" disabled={!canSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
