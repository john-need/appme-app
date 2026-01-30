import React, { useMemo, useState } from "react";
import { Grid, Box, Typography, IconButton, Fab, lighten, darken, useTheme } from "@mui/material";
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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [sortBy, setSortBy] = useState<keyof Pick<Activity, "name" | "type" | "goal"> | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const theme = useTheme();
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
  const handleOpen = () => setAddModalOpen(true);
  const handleClose = () => setAddModalOpen(false);
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

  const headerBgColor: string = useMemo(() => {
    return theme.palette.mode === "dark"
      ? lighten(theme.palette.background.default, 0.1)
      : darken(theme.palette.background.default, 0.1);
  }, [theme]);

  const headerHoverBgColor: string = useMemo(() => {
    return theme.palette.mode === "dark"
      ? lighten(theme.palette.background.default, 0.05)
      : darken(theme.palette.background.default, 0.05);
  }, [theme]);

  const rowOddBgColor = useMemo(() => {
    return theme.palette.mode === "dark"
      ? lighten(theme.palette.background.default, 0.05)
      : darken(theme.palette.background.default, 0.05);
  }, [theme]);

  const headerBorderColor = useMemo(() => {
    return theme.palette.mode === "dark"
      ? lighten(theme.palette.background.default, 0.2)
      : darken(theme.palette.background.default, 0.2);
  }, [theme]);

  return (
    <>
      <Box sx={{ paddingTop: "16px" }}>
        {/* Header row (sticky) */}
        <Grid container spacing={2}>
          <Grid
            size={{ xs: 4 }}
            sx={{
              backgroundColor: headerBgColor,
              "&:hover": {
                backgroundColor: headerHoverBgColor
              }
            }}
            className={styles["activities_header"]}
          >
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
          <Grid
            size={{ xs: 4 }}
            sx={{
              backgroundColor: headerBgColor,
              "&:hover": {
                backgroundColor: headerHoverBgColor
              }
            }}
            className={styles["activities_header"]}
          >
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
          <Grid
            size={{ xs: 2 }}
            sx={{
              backgroundColor: headerBgColor,
              "&:hover": {
                backgroundColor: headerHoverBgColor
              }
            }}
            className={styles["activities_header"]}
          >
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
          <Grid
            size={{ xs: 2 }}
            sx={{
              backgroundColor: headerBgColor
            }}
            className={styles["activities_header"]}
          >
            <Typography variant="subtitle2">&nbsp;</Typography>
          </Grid>
        </Grid>

        {/* Rows */}
        {sortedActivities.map((a) => (
          <Grid
            className={styles["activities_row"]}
            key={a.id}
            container
            spacing={2}
            sx={{
              "&:nth-of-type(odd)": {
                backgroundColor: rowOddBgColor
              },
              "&:nth-of-type(2)": { borderTopColor: headerBorderColor }
            }}
          >
            <Grid size={{ xs: 4 }} className={styles["activities_row-cell"]}>
              <Typography>{a.name}</Typography>
            </Grid>
            <Grid size={{ xs: 4 }} className={styles["activities_row-cell"]}>
              <Typography>{a.type}</Typography>
            </Grid>
            <Grid size={{ xs: 2 }} className={styles["activities_row-cell"]}>
              <Typography>{a.goal ?? ""}</Typography>
            </Grid>
            <Grid size={{ xs: 2 }} className={styles["activities_row-cell"]}>
              <IconButton data-testid={`edit-icon-button-${a.id}`} aria-label={`edit-${a.id}`} size="small" onClick={() => handleEditOpen(a)}>
                <EditIcon fontSize="small"/>
              </IconButton>
              <IconButton data-testid={`delete-icon-button-${a.id}`}  aria-label={`delete-${a.id}`} size="small" onClick={handleDeleteAlertOpen(a)}>
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
      </Box>
      <AddActivityModal open={addModalOpen} onClose={handleClose} onSubmit={handleSubmit}/>
      <EditActivityModal
        open={editOpen}
        onClose={handleEditClose}
        onSubmit={(partial) => {
          setEditOpen(false);
          // ensure id exists then call updateActivity with the full activity
          if (!partial || !partial.id) return;
          updateActivity(partial as Activity);
        }}
        activity={activeActivity}
      />
      <ConfirmActivityDeleteDialog
        open={deleteAlertOpen}
        onClose={handleDeleteResponse}
        activity={activeActivity}/>
    </>
  );
}
