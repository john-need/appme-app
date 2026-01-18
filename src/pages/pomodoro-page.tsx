import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import { selectPomodoros, fetchPomodorosThunk } from "@/features/pomodoros/pomodoros-slice";
import iso2LocalDateTime from "@/utils/iso-2-local-date-time";
import { useCurrentUser, useAuth, useJwt, useAddPomodoro } from "@/hooks";
import PomodoroAddButton from "@/components/pomodoro-add-button/pomodoro-add-button";
import NewPomodoroModal from "@/components/new-pomodoro-modal/new-pomodoro-modal";
import PomodoroControls from "@/components/pomodoro-controls/pomodoro-controls";
import PomodoroTimer from "@/components/pomodoro-timer/pomodoro-timer";
import pomodoroFactory from "@/factories/pomodoro-factory";
import Pomodoro from "@/components/pomodoro/pomodoro";

const collectEntries = (activityId: string, entries: TimeEntry[]): TimeEntry[] => {
  return entries
    .filter(entry => entry.activityId === activityId)
    .toSorted((a, b) => b.created.localeCompare(a.created));
};


export default function PomodoroPage() {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const activities = useAppSelector(selectActivities);
  const pomodoros = useAppSelector(selectPomodoros);
  const addMutation = useAddPomodoro();

  const addPomodoro = (p: Partial<Pomodoro>) => {
    addMutation.mutate({ pomodoro: p }, {
      onSuccess: (newPomo) => {
        setActivePomodoro(newPomo);
      }
    });
  };
  const timeEntries = useAppSelector((s) => s.timeEntries?.items ?? [])
    .map(te => ({ ...te, created: iso2LocalDateTime(te.created), updated: iso2LocalDateTime(te.created) }));

  React.useEffect(() => {
    dispatch(fetchPomodorosThunk());
  }, [dispatch]);


  const muda: Activity[] = activities.filter(a => a.type === "MUDA").toSorted((a, b) => a.name.localeCompare(b.name));
  const tassei: Activity[] = activities.filter(a => a.type === "TASSEI").toSorted((a, b) => a.name.localeCompare(b.name));


  const tasseiEntries: Record<string, TimeEntry[]> = tassei.reduce(
    (acc, activity) => {
      return { ...acc, [activity.id]: collectEntries(activity.id, timeEntries) };
    },
    {}
  );

  const mudaEntries: Record<string, TimeEntry[]> = muda.reduce(
    (acc, activity) => {
      return { ...acc, [activity.id]: collectEntries(activity.id, timeEntries) };
    },
    {}
  );

  const [shortBreak, setShortBreak] = React.useState<number>(10); // in minutes
  const [longBreak, setLongBreak] = React.useState<number>(10); // in minutes
  const [workInterval, setWorkInterval] = React.useState<number>(50); // in minutes
  const [activePomodoro, setActivePomodoro] = React.useState<Pomodoro | null>(pomodoroFactory());
  const [showAddPomodoro, setShowAddPomodoro] = React.useState<boolean>(false);
  const [pomoRunning, setPomoRunning] = React.useState<boolean>(false);

  // const pausePomodoro = () => {
  //   setPomoRunning(!pomoRunning);
  // };
  //
  // const startPomodoro = () => {
  //   setPomoRunning(!pomoRunning);
  // };
  //
  // const stopPomodoro = () => {
  //   setPomoRunning(!pomoRunning);
  // };

  return (
    <>
      <PomodoroAddButton addPomodoro={() => {
        setShowAddPomodoro(true);
      }}/>
      <Box>
        <PomodoroTimer
          timePeriod={workInterval}
          onStart={(m) => console.log(`Started ${m} min`)}
          onPause={(m) => console.log(`Paused after ${m} min`)}
          onStop={(m) => console.log(`Stopped after ${m} min`)}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Pomodoro
          pomodoro={activePomodoro}
          onChange={(updatedPomo) => setActivePomodoro(updatedPomo)}
        />
      </Box>
      <NewPomodoroModal
        show={showAddPomodoro}
        onSubmit={(pomo: Pomodoro) => {
          addPomodoro(pomo);
          setShowAddPomodoro(false);
        }}
        onCancel={() => {
          setShowAddPomodoro(false);
        }}/>
    </>
  );
}

