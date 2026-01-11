import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import iso2LocalDateTime from "@/utils/iso-2-local-date-time";
import { useCurrentUser, useAuth, useJwt } from "@/hooks";

const collectEntries = (activityId: string, entries: TimeEntry[]): TimeEntry[] => {
  return entries
    .filter(entry => entry.activityId === activityId)
    .toSorted((a, b) => b.created.localeCompare(a.created));
};


export default function PomodoroPage() {
  const currentUser = useCurrentUser();
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

  const [shortBreak, setShortBreak] = React.useState<number>(5); // in minutes
  const [longBreak, setLongBreak] = React.useState<number>(25); // in minutes


  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Pomodoro Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome, {currentUser?.name}! This is your Pomodoro productivity page.
      </Typography>
      {/* Additional Pomodoro-specific components and logic would go here */}
    </Box>
  );
}

