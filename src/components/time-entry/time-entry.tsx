import React, { useState, ChangeEvent } from "react";
import { TextField, Box, BoxProps, Typography } from "@mui/material";

interface TimeEntryProps extends Omit<BoxProps, "onChange"> {
  onChange: (e: { target: { value: number | undefined; name?: string } }) => void;
  value?: number;
  defaultValue?: number;
  label?: string;
  id?: string;
  testId?: string;
}

export const TimeEntry: React.FC<TimeEntryProps> = ({
  onChange,
  value,
  defaultValue,
  label,
  id,
  testId = "time-entry",
  ...boxProps
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<number>(defaultValue || 0);

  const effectiveValue = isControlled ? value : internalValue;

  // Derive hours and minutes from effectiveValue, handling undefined/isNaN
  const safeValue = effectiveValue === undefined || isNaN(effectiveValue) ? 0 : effectiveValue;
  const hours = Math.floor(Math.max(0, safeValue) / 60);
  const minutes = Math.max(0, safeValue) % 60;

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const val = parseInt(rawVal, 10);
    const h = isNaN(val) ? 0 : val;
    // Use the latest minutes from props/internalValue for calculation
    const currentMinutes = isControlled ? (value !== undefined ? value % 60 : 0) : internalValue % 60;
    const newValue = h * 60 + currentMinutes;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange({
      target: {
        value: rawVal === "-" || rawVal === "" ? undefined : newValue,
      },
    });
  };

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const val = parseInt(rawVal, 10);
    const m = isNaN(val) ? 0 : val;
    // Use the latest hours from props/internalValue for calculation
    const currentHours = isControlled ? (value !== undefined ? Math.floor(value / 60) : 0) : Math.floor(internalValue / 60);
    const newValue = currentHours * 60 + m;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange({
      target: {
        value: rawVal === "-" || rawVal === "" ? undefined : newValue,
      },
    });
  };

  return (
    <Box id={id} data-testid={testId} {...boxProps}>
      {label && (
        <Typography variant="caption" sx={{ color: "text.secondary", mb: 0.5, display: "block" }}>
          {label}
        </Typography>
      )}
      <Box display="flex" gap={1}>
        <TextField
          label="hours"
          type="number"
          value={hours}
          onChange={handleHoursChange}
          slotProps={{ htmlInput: { min: 0, "data-testid": `${testId}-hours` } }}
        />
        <TextField
          label="minutes"
          type="number"
          value={minutes}
          onChange={handleMinutesChange}
          slotProps={{ htmlInput: { min: 0, "data-testid": `${testId}-minutes` } }}
        />
      </Box>
    </Box>
  );
};
