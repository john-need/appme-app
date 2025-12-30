import React, { useMemo, useState } from "react";
import { Grid, Box, Typography, IconButton, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddActivityModal from "@/components/add-activity-modal/add-activity-modal";
import EditActivityModal from "@/components/edit-activity-modal/edit-activity-modal";
import ConfirmActivityDeleteDialog from "@/components/confirm-activity-delete-dialog/confirm-activity-delete-dialog";
import styles from "./styles.module.css";

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
  const [sortBy, setSortBy] = useState<keyof Pick<Activity, "name" | "type" | "goal"> | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Pick<Activity, "name" | "type" | "goal">) => () => {
    if (sortBy !== field) {
      setSortBy(field);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  const sortedActivities = useMemo(() => {
    if (!sortBy) return activities;
    const arr = [...activities];
    const factor = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const va = a[sortBy];
      const vb = b[sortBy];
      if (va == null && vb == null) return 0;
      if (va == null) return 1 * factor; // nulls/undefined last in asc, first in desc
      if (vb == null) return -1 * factor;
      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * factor;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      return sa.localeCompare(sb) * factor;
    });
    return arr;
  }, [activities, sortBy, sortDir]);
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
      <Box sx={{ paddingTop: "16px" }}>
        {/* Header row (sticky) */}
        <Grid container spacing={2}>
          <Grid item xs={5} className={styles["activities_header"]}>
            <Typography
              variant="subtitle2"
              role="button"
              tabIndex={0}
              onClick={handleSort("name")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSort("name")();
              }}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }}
              title="Sort by Name"
            >
              Name
              {sortBy === "name" && (
                sortDir === "asc" ? (
                  <ArrowUpwardIcon fontSize="inherit" sx={{ ml: 0.5 }}/>
                ) : (
                  <ArrowDownwardIcon fontSize="inherit" sx={{ ml: 0.5 }}/>
                )
              )}
            </Typography>
          </Grid>
          <Grid item xs={4} className={styles["activities_header"]}>
            <Typography
              variant="subtitle2"
              role="button"
              tabIndex={0}
              onClick={handleSort("type")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSort("type")();
              }}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }}
              title="Sort by Type"
            >
              Type
              {sortBy === "type" && (
                sortDir === "asc" ? (
                  <ArrowUpwardIcon fontSize="inherit" sx={{ ml: 0.5 }}/>
                ) : (
                  <ArrowDownwardIcon fontSize="inherit" sx={{ ml: 0.5 }}/>
                )
              )}
            </Typography>
          </Grid>
          <Grid item xs={2} className={styles["activities_header"]}>
            <Typography
              variant="subtitle2"
              role="button"
              tabIndex={0}
              onClick={handleSort("goal")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSort("goal")();
              }}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }}
              title="Sort by Goal"
            >
              Goal
              {sortBy === "goal" && (
                sortDir === "asc" ? (
                  <ArrowUpwardIcon fontSize="inherit" sx={{ ml: 0.5 }}/>
                ) : (
                  <ArrowDownwardIcon fontSize="inherit" sx={{ ml: 0.5 }}/>
                )
              )}
            </Typography>
          </Grid>
          <Grid item xs={1} className={styles["activities_header"]}>
            <Typography variant="subtitle2">&nbsp;</Typography>
          </Grid>
        </Grid>

        {/* Rows */}
        {sortedActivities.map((a) => (
          <Grid className={styles["activities_row"]} key={a.id} container spacing={2}>
            <Grid item xs={5} className={styles["activities_row-cell"]}>
              <Typography>{a.name}</Typography>
            </Grid>
            <Grid item xs={4} className={styles["activities_row-cell"]}>
              <Typography>{a.type}</Typography>
            </Grid>
            <Grid item xs={2} className={styles["activities_row-cell"]}>
              <Typography>{a.goal ?? ""}</Typography>
            </Grid>
            <Grid item xs={1} className={styles["activities_row-cell"]}>
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
