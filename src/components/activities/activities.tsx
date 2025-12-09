import React, { useState } from "react";
import { Grid, Box, Typography, IconButton, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddActivityModal from "@/components/add-activity-modal/add-activity-modal";

interface ActivitiesParams {
  activities: Activity[],
  updateActivity: (activity: Activity) => void
  deleteActivity: (id:string) => void
  addActivity: (activity: Partial<Activity>) => void
}

export default function Activities({ activities, updateActivity, deleteActivity, addActivity }: ActivitiesParams) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (activity: Partial<Activity>) => {
    addActivity(activity);
    handleClose();
  };

  return (
    <Box>
      {/* Header row */}
      <Grid container spacing={2} sx={{ px: 1, py: 1, borderBottom: 1, borderColor: 'divider', alignItems: 'center' }}>
        <Grid item xs={3}>
          <Typography variant="subtitle2">Name</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle2">Type</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle2">Goal</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle2">&nbsp;</Typography>
        </Grid>
      </Grid>

      {/* Rows */}
      {activities.map((a) => (
        <Grid key={a.id} container spacing={2} sx={{ px: 1, py: 1, alignItems: 'center' }}>
          <Grid item xs={3}>
            <Typography>{a.name}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>{a.type}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>{a.goal ?? ""}</Typography>
          </Grid>
          <Grid item xs={3}>
            <IconButton aria-label={`edit-${a.id}`} size="small" onClick={() => updateActivity(a)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label={`delete-${a.id}`} size="small" onClick={() => deleteActivity(a.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {/* Floating Add button */}
      <Fab
        color="primary"
        aria-label="add-activity"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      {open && <AddActivityModal onClose={handleClose} onSubmit={handleSubmit} />}

    </Box>
  );
}
