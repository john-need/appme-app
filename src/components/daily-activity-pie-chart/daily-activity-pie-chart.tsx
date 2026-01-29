import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, Grid, Typography, Box } from "@mui/material";
import toLocalYMD from "@/utils/to-local-ymd";

interface DailyActivityPieChartProps {
  activities: Activity[];
  timeEntries: TimeEntry[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"];

const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const DailyActivityPieChart: React.FC<DailyActivityPieChartProps> = ({ activities, timeEntries }) => {
  // Group entries by date
  const entriesByDate: Record<string, TimeEntry[]> = {};
  timeEntries.forEach((entry) => {
    const date = toLocalYMD(entry.created);
    if (!entriesByDate[date]) {
      entriesByDate[date] = [];
    }
    entriesByDate[date].push(entry);
  });

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => b.localeCompare(a));

  const activityMap = activities.reduce((acc, activity) => {
    acc[activity.id] = activity.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Daily Activity Breakdown
      </Typography>
      {sortedDates.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2, mb: 4, fontStyle: "italic" }}>
          No activity found for this period.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {sortedDates.map((date) => {
          const dayEntries = entriesByDate[date];
          const activityMinutes: Record<string, number> = {};
          let totalSpent = 0;

          dayEntries.forEach((entry) => {
            activityMinutes[entry.activityId] = (activityMinutes[entry.activityId] || 0) + entry.minutes;
            totalSpent += entry.minutes;
          });

          const data = Object.entries(activityMinutes).map(([activityId, minutes]) => ({
            name: activityMap[activityId] || "Unknown",
            value: minutes,
            formattedValue: formatDuration(minutes),
          }));

          // Add "Other" for leftover time
          const leftover = 1440 - totalSpent;
          if (leftover > 0) {
            data.push({
              name: "Other",
              value: leftover,
              formattedValue: formatDuration(leftover),
            });
          }

          return (
            <Grid item xs={12} md={6} lg={4} key={date}>
              <Card sx={{ height: "100%" }}>
                <CardHeader title={date} subheader={`Total Spent: ${formatDuration(totalSpent)}`} />
                <CardContent sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === "Other" ? "#e0e0e0" : COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string, props: any) => [props.payload.formattedValue, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      )}
    </Box>
  );
};

export default DailyActivityPieChart;
