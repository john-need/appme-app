import React, { useState } from "react";
import { Grid, Box, Typography, IconButton, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddActivityModal from "@/components/add-activity-modal/add-activity-modal";
import EditActivityModal from "@/components/edit-activity-modal/edit-activity-modal";
import ConfirmActivityDeleteDialog from "@/components/confirm-activity-delete-dialog/confirm-activity-delete-dialog";

interface ActivitiesParams {
  activities: Activity[],
  updateActivity: (activity: Activity) => void
  deleteActivity: (id: string) => void
  addActivity: (activity: Partial<Activity>) => void
}

export default function Activities({ activities, updateActivity, deleteActivity, addActivity }: ActivitiesParams) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (activity: Partial<Activity>) => {
    addActivity(activity);
    handleClose();
  };

  const handleEditOpen = (activity: Activity) => {
    setActiveActivity(activity);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setActiveActivity(null);
    setEditOpen(false);
  };


  const handleDeleteAlertOpen = (activity: Activity) => () => {
    if (activity?.id) {
      setActiveActivity(activity);
    }
    setDeleteAlertOpen(true);
  };

  const handleDeleteResponse = (response: boolean) => {
    if (response && activeActivity?.id) {
      deleteActivity(activeActivity?.id);
    }
    setDeleteAlertOpen(false);
  };

  return (
    <>
      <Box>
        {/* Header row (sticky) */}
        <Grid container spacing={2}>
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
          <Grid key={a.id} container spacing={2} sx={{ px: 1, py: 1, alignItems: "center" }}>
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
              <IconButton aria-label={`edit-${a.id}`} size="small" onClick={() => handleEditOpen(a)}>
                <EditIcon fontSize="small"/>
              </IconButton>
              <IconButton aria-label={`delete-${a.id}`} size="small" onClick={handleDeleteAlertOpen(a)}>
                <DeleteIcon fontSize="small"/>
              </IconButton>
            </Grid>
          </Grid>
        ))}

        {/* Floating Add button */}
        <Fab
          color="primary"
          aria-label="add-activity"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleOpen}
        >
          <AddIcon/>
        </Fab>

        {open && <AddActivityModal onClose={handleClose} onSubmit={handleSubmit}/>}
        {editOpen && activeActivity && (
          <EditActivityModal
            onClose={handleEditClose}
            onSubmit={(partial) => {
              setEditOpen(false);
              // ensure id exists then call updateActivity with the full activity
              if (!partial || !partial.id) return;
              updateActivity(partial as Activity);
            }}
            activity={activeActivity}
          />
        )}
      </Box>
      <ConfirmActivityDeleteDialog
        open={deleteAlertOpen}
        onClose={handleDeleteResponse}
        activity={activeActivity}/>
    </>
  );
}
