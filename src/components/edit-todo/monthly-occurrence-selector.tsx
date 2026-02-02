import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const nthDayArray = [
  "MONTHLY_1ST_MONDAY", "MONTHLY_1ST_TUESDAY", "MONTHLY_1ST_WEDNESDAY", "MONTHLY_1ST_THURSDAY", "MONTHLY_1ST_FRIDAY", "MONTHLY_1ST_SATURDAY", "MONTHLY_1ST_SUNDAY",
  "MONTHLY_2ND_MONDAY", "MONTHLY_2ND_TUESDAY", "MONTHLY_2ND_WEDNESDAY", "MONTHLY_2ND_THURSDAY", "MONTHLY_2ND_FRIDAY", "MONTHLY_2ND_SATURDAY", "MONTHLY_2ND_SUNDAY",
  "MONTHLY_3RD_MONDAY", "MONTHLY_3RD_TUESDAY", "MONTHLY_3RD_WEDNESDAY", "MONTHLY_3RD_THURSDAY", "MONTHLY_3RD_FRIDAY", "MONTHLY_3RD_SATURDAY", "MONTHLY_3RD_SUNDAY",
  "MONTHLY_4TH_MONDAY", "MONTHLY_4TH_TUESDAY", "MONTHLY_4TH_WEDNESDAY", "MONTHLY_4TH_THURSDAY", "MONTHLY_4TH_FRIDAY", "MONTHLY_4TH_SATURDAY", "MONTHLY_4TH_SUNDAY",
  "MONTHLY_LAST_MONDAY", "MONTHLY_LAST_TUESDAY", "MONTHLY_LAST_WEDNESDAY", "MONTHLY_LAST_THURSDAY", "MONTHLY_LAST_FRIDAY", "MONTHLY_LAST_SATURDAY", "MONTHLY_LAST_SUNDAY"
];

interface MonthlyOccurrenceSelectorProps {
  isOpen: boolean;
  occurrences: string[];
  onAddOccurrence: (occurrence: string) => void;
  onDeleteOccurrence: (occurrence: string) => void;
}

export default function MonthlyOccurrenceSelector({
  isOpen,
  occurrences,
  onAddOccurrence,
  onDeleteOccurrence,
}: MonthlyOccurrenceSelectorProps) {
  const [monthlyControlSet, setMonthlyControlSet] = useState<"date" | "day">("day");

  return (
    <Collapse in={isOpen} sx={{ mt: 2 }}>
      <FormControl>
        <FormLabel id="monthly-control-set-label">Set By</FormLabel>
        <RadioGroup
          row
          aria-labelledby="monthly-control-set-label"
          name="monthly-control-set"
          value={monthlyControlSet}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMonthlyControlSet((event.target as HTMLInputElement).value === "day" ? "day" : "date");
          }}
        >
          <FormControlLabel value="day" control={<Radio/>} label="Day"/>
          <FormControlLabel value="date" control={<Radio/>} label="Date"/>
        </RadioGroup>
      </FormControl>
      <Collapse in={monthlyControlSet === "day"} sx={{ mt: 2 }}>
        <Box
          id={"day-grid"}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            mt: 2
          }}
        >
          {nthDayArray.map((occurrence) => {
            const isSelected = occurrences.includes(occurrence);
            const splits = occurrence.split("_");
            const label = `${splits[1]} ${splits[2].slice(0, 3).toLowerCase()}`;
            return (
              <Button
                key={occurrence}
                variant={isSelected ? "contained" : "outlined"}
                onClick={() => {
                  isSelected ? onDeleteOccurrence(occurrence) : onAddOccurrence(occurrence);
                }}
                fullWidth
                sx={{ minWidth: 0, px: 0 }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      </Collapse>
      <Collapse in={monthlyControlSet === "date"} sx={{ mt: 2 }}>
        <Box id={"date-grid"} sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {[...Array(31)].map((_, index) => {
            const day = index + 1;
            const occurrence = `MONTHLY_DAY_${day}`;
            const isSelected = occurrences.includes(occurrence);
            return (
              <Button
                key={occurrence}
                variant={isSelected ? "contained" : "outlined"}
                onClick={() => {
                  isSelected ? onDeleteOccurrence(occurrence) : onAddOccurrence(occurrence);
                }}
              >
                {day}
              </Button>
            );
          })}
        </Box>
      </Collapse>
    </Collapse>
  );
}
