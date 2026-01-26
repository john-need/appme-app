import React, { useState, ChangeEvent } from "react";
import { TextField, Box, BoxProps } from "@mui/material";

interface TimeEntryProps extends Omit<BoxProps, "onChange"> {
  onChange: (e: { target: { value: number; name?: string } }) => void;
}

export const TimeEntry: React.FC<TimeEntryProps> = ({ onChange, ...boxProps }) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 0;
    setHours(val);
    onChange({
      target: {
        value: val * 60 + minutes,
      },
    });
  };

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 0;
    setMinutes(val);
    onChange({
      target: {
        value: hours * 60 + val,
      },
    });
  };

  return (
    <Box display="flex" gap={2} {...boxProps}>
      <TextField
        label="hours"
        type="number"
        value={hours}
        onChange={handleHoursChange}
        inputProps={{ min: 0 }}
      />
      <TextField
        label="minutes"
        type="number"
        value={minutes}
        onChange={handleMinutesChange}
        inputProps={{ min: 0 }}
      />
    </Box>
  );
};
