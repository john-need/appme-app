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

export interface PieChartData {
  name: string;
  value: number;
  formattedValue: string;
  [key: string]: string | number;
}

export interface DailyPieChartData {
  date: string;
  totalSpentFormatted: string;
  data: PieChartData[];
}

interface DailyActivityPieChartProps {
  dailyData: DailyPieChartData[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"];

const DailyActivityPieChart: React.FC<DailyActivityPieChartProps> = ({ dailyData }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Activity Breakdown
      </Typography>
      {dailyData.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2, mb: 4, fontStyle: "italic" }}>
          No activity found for this period.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {dailyData.map((day) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={day.date}>
              <Card sx={{ height: "100%" }}>
                <CardHeader title={day.date} subheader={`Total Spent: ${day.totalSpentFormatted}`} />
                <CardContent sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={day.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        data-testid="pie-slice"
                      >
                        {day.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === "Other" ? "#e0e0e0" : COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(
                          _value: number | undefined,
                          name: string | undefined,
                          item: { payload?: { formattedValue?: string } }
                        ) => [item.payload?.formattedValue || "", name as string]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DailyActivityPieChart;
