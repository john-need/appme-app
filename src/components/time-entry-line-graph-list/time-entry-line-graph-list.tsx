import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import TimeEntryLineGraph from "@/components/time-entry-line-graph/time-entry-line-graph";

interface TimeEntryLineGraphListProps {
  title: string;
  activities: Activity[];
  entriesByActivity: Record<string, TimeEntry[]>;
}

const TimeEntryLineGraphList: React.FC<TimeEntryLineGraphListProps> = ({ title, activities, entriesByActivity }) => {
  if (activities.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {activities.map((activity) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={activity.id}>
            <TimeEntryLineGraph
              activity={activity}
              timeEntries={entriesByActivity[activity.id] || []}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TimeEntryLineGraphList;
