import React from "react";
import { Collapse, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

interface WeeklyOccurrenceSelectorProps {
  isOpen: boolean;
  occurrences: string[];
  onOccurrenceChange: (occurrences: string[]) => void;
}

export default function WeeklyOccurrenceSelector({
  isOpen,
  occurrences,
  onOccurrenceChange,
}: WeeklyOccurrenceSelectorProps) {
  const handleWeeklyChange = (
    _event: React.MouseEvent<HTMLElement>,
    newWeeklyDays: string[],
  ) => {
    onOccurrenceChange(newWeeklyDays.filter(occ => occ.startsWith("WEEKLY")));
  };

  return (
    <Collapse in={isOpen} sx={{ mt: 2 }}>
      <ToggleButtonGroup
        value={occurrences}
        onChange={handleWeeklyChange}
        aria-label="Weekly Repetitions"
      >
        <ToggleButton value="WEEKLY_MONDAY" aria-label="Monday">
          <Typography>MON</Typography>
        </ToggleButton>
        <ToggleButton value="WEEKLY_TUESDAY" aria-label="Tuesday">
          <Typography>TUE</Typography>
        </ToggleButton>
        <ToggleButton value="WEEKLY_WEDNESDAY" aria-label="Wednesday">
          <Typography>WED</Typography>
        </ToggleButton>
        <ToggleButton value="WEEKLY_THURSDAY" aria-label="Thursday">
          <Typography>THU</Typography>
        </ToggleButton>
        <ToggleButton value="WEEKLY_FRIDAY" aria-label="Friday">
          <Typography>FRI</Typography>
        </ToggleButton>
        <ToggleButton value="WEEKLY_SATURDAY" aria-label="Saturday">
          <Typography>SAT</Typography>
        </ToggleButton>
        <ToggleButton value="WEEKLY_SUNDAY" aria-label="Sunday">
          <Typography>SUN</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Collapse>
  );
}
