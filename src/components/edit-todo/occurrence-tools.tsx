import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Collapse,
  Stack,
} from "@mui/material";
import WeeklyOccurrenceSelector from "./weekly-occurrence-selector";
import MonthlyOccurrenceSelector from "./monthly-occurrence-selector";
import OnDatesOccurrenceSelector from "./on-dates-occurrence-selector";

interface OccurrenceToolsProps {
  isOpen: boolean;
  occurrences: string[];
  activeOccurrenceTool: string | null;
  onSetActiveOccurrenceTool: (tool: string | null) => void;
  onAddOccurrence: (occurrence: string) => void;
  onDeleteOccurrence: (occurrence: string) => void;
  onSetOccurrences: (occurrences: string[]) => void;
}

export default function OccurrenceTools({
  isOpen,
  occurrences,
  activeOccurrenceTool,
  onSetActiveOccurrenceTool,
  onAddOccurrence,
  onDeleteOccurrence,
  onSetOccurrences,
}: OccurrenceToolsProps) {
  const addWeekDays = () => {
    onSetActiveOccurrenceTool(null);
    onSetOccurrences([
      "WEEKLY_MONDAY",
      "WEEKLY_TUESDAY",
      "WEEKLY_WEDNESDAY",
      "WEEKLY_THURSDAY",
      "WEEKLY_FRIDAY"
    ]);
  };

  return (
    <Collapse in={isOpen} sx={{ mt: 2 }}>
      <Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
          {
            occurrences.map((occ) => (
              <Chip
                key={occ}
                label={occ}
                onDelete={() => onDeleteOccurrence(occ)}
                color="primary"
                variant="outlined"
              />
            ))
          }
        </Stack>
      </Box>
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button onClick={() => {
          onAddOccurrence("NEVER");
        }}>NEVER</Button>
        <Button onClick={() => {
          onAddOccurrence("DAILY");
        }}>DAILY</Button>
        <Button onClick={addWeekDays}>WEEKDAYS</Button>
        <Button onClick={() => {
          onSetActiveOccurrenceTool("WEEKLY");
        }}>WEEKLY</Button>
        <Button onClick={() => {
          onSetActiveOccurrenceTool("MONTHLY");
        }}>MONTHLY</Button>
        <Button onClick={() => {
          onSetActiveOccurrenceTool("ON_DATES");
        }}>ON DATES</Button>
      </ButtonGroup>
      <WeeklyOccurrenceSelector
        isOpen={activeOccurrenceTool === "WEEKLY"}
        occurrences={occurrences}
        onOccurrenceChange={onSetOccurrences}
      />
      <MonthlyOccurrenceSelector
        isOpen={activeOccurrenceTool === "MONTHLY"}
        occurrences={occurrences}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
      <OnDatesOccurrenceSelector
        isOpen={activeOccurrenceTool === "ON_DATES"}
        occurrences={occurrences}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    </Collapse>
  );
}
