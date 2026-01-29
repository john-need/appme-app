import React from "react";
import { Container } from "@mui/material";
import TimeEntries from "@/components/time-entries/time-entries";
import { useAppSelector } from "@/hooks";
import { StopWatchModal } from "@/components/stop-watch-modal/stop-watch-modal";
import { AddTimeModal } from "@/components/time-entries/add-time-modal";
import { selectActivities } from "@/features/activities/activities-slice";
import {
  addTimeEntryThunk,
  updateTimeEntryThunk,
  deleteTimeEntryThunk
} from "@/features/time-entries/time-entries-slice";
import timeEntryFactory from "@/factories/time-entry-factory";
import { useAppDispatch } from "@/hooks";
import todayTimeEntries from "../utils/today-time-entries";
import isToday from "@/utils/is-today";

export default function TimeEntriesPage() {
  const dispatch = useAppDispatch();
  const [showStopWatch, setShowStopWatch] = React.useState(false);
  const [showAddTime, setShowAddTime] = React.useState(false);
  const [editing, setEditing] = React.useState<TimeEntry | null>(null);
  const [addingTo, setAddingTo] = React.useState<TimeEntry | null>(null);
  const timeEntries = useAppSelector((s) => s.timeEntries?.items ?? []);

  const activities = useAppSelector(selectActivities);

  const todaysTimeEntries = todayTimeEntries(timeEntries);
  const doneActivityIds = new Set(todaysTimeEntries.map(t => t.activityId));
  const availableActivities = activities.filter(a => !doneActivityIds.has(a.id));


  const group1 = availableActivities.filter(a=>(isToday(a.created))).sort((x, y) => x.name.localeCompare(y.name));
  const group2 = availableActivities.filter((a)=>(!isToday(a.created))).sort((x, y) => x.name.localeCompare(y.name));


  const startStopWatch = (entry: TimeEntry) => {
    console.log("starting stop watch");
    setEditing(entry);
    setShowStopWatch(true);
  };


  const onAddTime = (entry: TimeEntry) => {
    setAddingTo(entry);
    setShowAddTime(true);
  };

  const handleAddTimeSubmit = (mins: number) => {
    if (addingTo) {
      const updatedEntry = timeEntryFactory({ ...addingTo, minutes: addingTo.minutes + mins });
      dispatch(updateTimeEntryThunk(updatedEntry));
    }
  };

  const handleClose = () => {
    setShowStopWatch(false);
    setShowAddTime(false);
    setEditing(null);
    setAddingTo(null);
  };

  const handleSave = (entry: TimeEntry) => {
    dispatch(updateTimeEntryThunk(timeEntryFactory(entry)));
    handleClose();
  };

  const activityName = editing ? activities.find(a => a.id === editing.activityId)?.name ?? editing.activityId : "";

  const deleteTimeEntry = (id: string) => {
    dispatch(deleteTimeEntryThunk(id));
  };

  const addTimeEntry = (timeEntry: TimeEntry) => {
    dispatch(addTimeEntryThunk(timeEntry));
  };

  return (
    <Container sx={{ py: 4 }}>
      <TimeEntries
        todayActivities={group1}
        otherActivities={group2}
        activities={activities}
        timeEntries={timeEntries}
        onAddTime={onAddTime}
        startStopWatch={startStopWatch}
        onDeleteTimeEntry={deleteTimeEntry}
        onAddTimeEntry={addTimeEntry}
      />

      <StopWatchModal
        open={showStopWatch}
        timeEntry={editing}
        onClose={handleClose}
        onSubmit={handleSave}
        activityName={activityName}
      />

      <AddTimeModal
        open={showAddTime}
        onClose={handleClose}
        onSubmit={handleAddTimeSubmit}
      />

    </Container>
  );
}
