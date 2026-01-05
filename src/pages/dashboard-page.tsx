import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import iso2LocalDateTime from "@/utils/iso-2-local-date-time";
import TimeEntryLineGraph from "@/components/time-entry-line-graph/time-entry-line-graph";


const collectEntries = (activityId: string, entries: TimeEntry[]): TimeEntry[] => {
  return entries
    .filter(entry => entry.activityId === activityId)
    .toSorted((a, b) => b.created.localeCompare(a.created));
};


export default function DashboardPage() {
  const activities = useAppSelector(selectActivities);
  const timeEntries = useAppSelector((s) => s.timeEntries?.items ?? [])
    .map(te => ({ ...te, created: iso2LocalDateTime(te.created), updated: iso2LocalDateTime(te.created) }));


  const muda: Activity[] = activities.filter(a => a.type === "MUDA").toSorted((a, b) => a.name.localeCompare(b.name));
  const tassei: Activity[] = activities.filter(a => a.type === "TASSEI").toSorted((a, b) => a.name.localeCompare(b.name));


  const tasseiEntries: Record<string, TimeEntry[]> = tassei.reduce(
    (acc, activity) => {
      return { ...acc, [activity.id]: collectEntries(activity.id, timeEntries) };
    },
    {}
  );

  const mudaEntries: Record<string, TimeEntry[]> = muda.reduce(
    (acc, activity) => {
      return { ...acc, [activity.id]: collectEntries(activity.id, timeEntries) };
    },
    {}
  );


  return (
    <Box p={2}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Tassei
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {tassei.map(activity => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={activity.id}>
              <TimeEntryLineGraph
                key={activity.id}
                activity={activity}
                timeEntries={tasseiEntries[activity.id]}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Typography variant="h4" gutterBottom>
          Muda
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {muda.map(activity => (
            <Grid item xs={12} sm={6} md={4} lg={3}  key={activity.id}>
              <TimeEntryLineGraph
                activity={activity}
                timeEntries={mudaEntries[activity.id]}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

