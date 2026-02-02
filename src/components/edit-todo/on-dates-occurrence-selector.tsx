import React, { useState } from "react";
import { Collapse } from "@mui/material";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

interface OnDatesOccurrenceSelectorProps {
  isOpen: boolean;
  occurrences: string[];
  onAddOccurrence: (occurrence: string) => void;
  onDeleteOccurrence: (occurrence: string) => void;
}

export default function OnDatesOccurrenceSelector({
  isOpen,
  occurrences,
  onAddOccurrence,
  onDeleteOccurrence,
}: OnDatesOccurrenceSelectorProps) {
  const [calendarValue, setCalendarValue] = useState<Dayjs | null>(dayjs());

  return (
    <Collapse in={isOpen} sx={{ mt: 2 }}>
      <DateCalendar
        value={calendarValue}
        onChange={(newValue) => {
          setCalendarValue(newValue);
          if (newValue) {
            const dateStr = (newValue as Dayjs).format("YYYY-MM-DD");
            if (occurrences.includes(dateStr)) {
              onDeleteOccurrence(dateStr);
            } else {
              onAddOccurrence(dateStr);
            }
          }
        }}
        slots={{
          day: (props: PickersDayProps) => {
            const dateStr = props.day.format("YYYY-MM-DD");
            const isSelected = occurrences.includes(dateStr);
            return (
              <PickersDay
                {...props}
                selected={isSelected}
              />
            );
          }
        }}
      />
    </Collapse>
  );
}
