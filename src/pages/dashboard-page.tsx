import React, { useState, useMemo } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useAppSelector } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import iso2LocalDateTime from "@/utils/iso-2-local-date-time";
import TimeEntryPieCharts from "@/components/time-entry-pie-charts/time-entry-pie-charts";
import TimeEntryLineGraphs from "@/components/time-entry-line-graphs/time-entry-line-graphs";
import toLocalYMD from "@/utils/to-local-ymd";

type Period = "this week" | "last week" | "last 2 weeks" | "this month" | "last 2 months" | "last 6 months" | "this year" | "all";
type DataByPeriod = "day" | "week" | "month";


export default function DashboardPage() {
  const activities = useAppSelector(selectActivities);
  const rawTimeEntries = useAppSelector((s) => s.timeEntries?.items ?? []);
  const timeEntries = useMemo(() => rawTimeEntries.map(te => ({
    ...te,
    created: iso2LocalDateTime(te.created),
    updated: iso2LocalDateTime(te.created)
  })), [rawTimeEntries]);

  const [period, setPeriod] = useState<Period>("last week");
  const [dataByPeriod, setDataByPeriod] = useState<DataByPeriod>("day");

  const filteredTimeEntriesForPie = useMemo(() => {
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


  return (
    <Box p={2}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="data-by-period-select-label">View Data By</InputLabel>
          <Select
            labelId="data-by-period-select-label"
            value={dataByPeriod}
            onChange={(e) => setDataByPeriod(e.target.value as DataByPeriod)}
            label="View Data By"
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </FormControl>

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

      <TimeEntryPieCharts activities={activities} timeEntries={filteredTimeEntriesForPie} dataByPeriod={dataByPeriod} />
      <TimeEntryLineGraphs activities={activities} timeEntries={timeEntries} period={period} />
    </Box>
  );
}

