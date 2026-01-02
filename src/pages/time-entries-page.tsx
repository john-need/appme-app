import React from "react";
import { Container } from "@mui/material";
import TimeEntries from "@/components/time-entries/time-entries";
import { useAppSelector } from "@/hooks";
import iso2LocalDateTime from "@/utils/iso-2-local-date-time";
import useUpdateTimeEntry from "@/hooks/use-update-time-entry";
import { StopWatchModal } from "@/components/stop-watch-modal/stop-watch-modal";
import { selectActivities } from "@/features/activities/activities-slice";

export default function TimeEntriesPage() {
  const [showStopWatch, setShowStopWatch] = React.useState(false);
  const [editing, setEditing] = React.useState<TimeEntry | null>(null);
  const timeEntries = useAppSelector((s) => s.timeEntries?.items ?? [])
    .map(te => ({ ...te, created: iso2LocalDateTime(te.created), updated: iso2LocalDateTime(te.created) }));
  
  const activities = useAppSelector(selectActivities);
  const updateMutation = useUpdateTimeEntry();

  const startStopWatch = (entry: TimeEntry) => {
    console.log("starting stop watch");
    setEditing(entry);
    setShowStopWatch(true);
  };


  const onAddTime = (entry: TimeEntry) => {
    const additionalMinutes = prompt("Enter additional minutes to add:", "15");
    if (additionalMinutes) {
      const mins = parseInt(additionalMinutes, 10);
      if (!isNaN(mins) && mins > 0) {
        const updatedEntry = { ...entry, minutes: entry.minutes + mins };
        updateMutation.mutate(updatedEntry);
      } else {
        alert("Please enter a valid number of minutes.");
      }
    }
  };

  const handleClose = () => {
    setShowStopWatch(false);
    setEditing(null);
  };

  const handleSave = (entry: TimeEntry) => {
    updateMutation.mutate(entry);
    handleClose();
  };

  const activityName = editing ? activities.find(a => a.id === editing.activityId)?.name ?? editing.activityId : "";

  return (
    <Container sx={{ py: 4 }}>
      <TimeEntries timeEntries={timeEntries} onAddTime={onAddTime} startStopWatch={startStopWatch} />
      {editing && (
        <StopWatchModal
          open={showStopWatch}
          timeEntry={editing}
          onClose={handleClose}
          onSubmit={handleSave}
          activityName={activityName}
        />
      )}
    </Container>
  );
}
