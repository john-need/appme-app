import React, { useState, useMemo } from "react";
import { Box, Grid, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useAppSelector } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import iso2LocalDateTime from "@/utils/iso-2-local-date-time";
import TimeEntryLineGraph from "@/components/time-entry-line-graph/time-entry-line-graph";
import DailyActivityPieChart from "@/components/daily-activity-pie-chart/daily-activity-pie-chart";
import toLocalYMD from "@/utils/to-local-ymd";

type Period = "this week" | "last week" | "last 2 weeks" | "this month" | "last 2 months" | "last 6 months" | "this year" | "all";

const collectEntries = (activityId: string, entries: TimeEntry[]): TimeEntry[] => {
  return entries
    .filter(entry => entry.activityId === activityId)
    .toSorted((a, b) => b.created.localeCompare(a.created));
};


export default function DashboardPage() {
  const activities = useAppSelector(selectActivities);
  const rawTimeEntries = useAppSelector((s) => s.timeEntries?.items ?? []);
  const timeEntries = useMemo(() => rawTimeEntries.map(te => ({
    ...te,
    created: iso2LocalDateTime(te.created),
    updated: iso2LocalDateTime(te.created)
  })), [rawTimeEntries]);

  const [period, setPeriod] = useState<Period>("last week");

  const filteredTimeEntries = useMemo(() => {
    if (period === "all") return timeEntries;

    const now = new Date();
    const today = toLocalYMD(now);
    const startDate = new Date(today);

    if (period === "this week") {
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      startDate.setDate(diff);
    } else if (period === "last week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "last 2 weeks") {
      startDate.setDate(startDate.getDate() - 14);
    } else if (period === "this month") {
      startDate.setDate(1);
    } else if (period === "last 2 months") {
      startDate.setMonth(startDate.getMonth() - 2);
    } else if (period === "last 6 months") {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (period === "this year") {
      startDate.setMonth(0, 1);
    }

    const startYMD = toLocalYMD(startDate);
    return timeEntries.filter(entry => toLocalYMD(entry.created) >= startYMD);
  }, [timeEntries, period]);


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
      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="period-select-label">Time Period</InputLabel>
          <Select
            labelId="period-select-label"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            label="Time Period"
          >
            <MenuItem value="this week">This Week</MenuItem>
            <MenuItem value="last week">Last Week</MenuItem>
            <MenuItem value="last 2 weeks">Last 2 Weeks</MenuItem>
            <MenuItem value="this month">This Month</MenuItem>
            <MenuItem value="last 2 months">Last 2 Months</MenuItem>
            <MenuItem value="last 6 months">Last 6 Months</MenuItem>
            <MenuItem value="this year">This Year</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DailyActivityPieChart activities={activities} timeEntries={filteredTimeEntries} />
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

