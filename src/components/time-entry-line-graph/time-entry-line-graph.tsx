import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader } from "@mui/material";

interface TimeEntryLineGraphProps {
  activity: Activity;
  timeEntries: TimeEntry[];
}

const TimeEntryLineGraph: React.FC<TimeEntryLineGraphProps> = ({ activity, timeEntries }) => {
  const data = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Generate all dates from Jan 1 to today
    const dateMap: Record<string, number> = {};
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      dateMap[dateStr] = 0;
    }

    // Populate dateMap with minutes from timeEntries
    timeEntries.forEach((entry) => {
      const entryDate = new Date(entry.created).toISOString().split("T")[0];
      if (dateMap[entryDate] !== undefined) {
        dateMap[entryDate] += entry.minutes;
      }
    });

    return Object.keys(dateMap).sort().map((date) => ({
      date,
      minutes: dateMap[date],
    }));
  }, [timeEntries]);

  return (
    <Card sx={{ width: "100%", height: 400 }}>
      <CardHeader
        title={activity.name}
      />
      <CardContent sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="date"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Bar dataKey="minutes" fill="#8884d8" name="Minutes Spent"/>
            {activity.goal && (
              <ReferenceLine
                y={activity.goal}
                label="Goal"
                stroke="red"
                strokeDasharray="3 3"
              />
            )}
          </BarChart>
        </ResponsiveContainer>

    </CardContent>
</Card>
)
  ;
};

export default TimeEntryLineGraph;
