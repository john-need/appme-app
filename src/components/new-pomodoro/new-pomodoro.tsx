import React, { useState } from "react";

import {
  Paper,
  TextField,
  Button,
  Typography, Stack, Autocomplete,
} from "@mui/material";

interface NewPomodoroModalProps {
  onSubmit: (pomodoro: Partial<Pomodoro>) => void;
  activities: Activity[];
}

const NewPomodoro = ({
                       onSubmit,
                       activities
                     }: NewPomodoroModalProps) => {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [activity, setActivity] = useState<Activity | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name || name.trim() === "") return;

    // We pass a partial Pomodoro that will be normalized by the factory/data-layer
    const payload = {
      name,
      notes,
      activityId: activity?.id,
    } as Partial<Pomodoro>;

    onSubmit(payload);
    // Reset fields
    setName("");
    setNotes("");
    setActivity(null);
  };

  const handleCancel = () => {
    // Reset fields
    setName("");
    setNotes("");
    setActivity(null);
  };

  const canSubmit = !!name && name.trim() !== "";

  return (
    <Paper>
      <Stack direction="column" justifyContent="space-between" alignItems="center" sx={{ width: "100%", p: 2, gap: 2 }}>
        <Typography sx={{ position: "relative" }}>
          New Pomodoro
        </Typography>

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

        <Autocomplete
          options={activities}
          getOptionLabel={(option) => option.name}
          value={activity}
          onChange={(_, newValue) => {
            if (newValue) {
              setActivity(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Main Activity" fullWidth/>
          )}
          fullWidth
        />
        <Stack direction={"row"} sx={{  p: 2, gap: 2 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!canSubmit}
          >
            Start
          </Button>
          <Button onClick={handleCancel}>Clear</Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default NewPomodoro;
