import React from "react";
import { Box, Button, Collapse, Divider, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector, useCurrentUser, useUpdatePomodoroEntry } from "@/hooks";
import { selectActivities } from "@/features/activities/activities-slice";
import {
  addActivePomodoroEntry,
  clearActivePomodoro,
  patchActivePomodoro,
  patchActivePomodoroEntry,
  saveActivePomodoroThunk,
  selectActivePomodoro,
  selectPomodoros,
  setActivePomodoro
} from "@/features/pomodoros/pomodoros-slice";
import iso2LocalDateTime from "@/utils/iso-2-local-date-time";
import PomodoroTimer from "@/components/pomodoro-timer/pomodoro-timer";
import pomodoroFactory from "@/factories/pomodoro-factory";
import Pomodoro from "@/components/pomodoro/pomodoro";
import PomodoroEntries from "@/components/pomodoro-entries/pomodoro-entries";
import { nextEntryType } from "@/utils/next-entry-type";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";
import NewPomodoro from "@/components/new-pomodoro/new-pomodoro";
import ConfirmPomodoroReset from "@/components/confirm-pomodoro-reset/confirm-pomodoro-reset";

const pomodoroTimerEntryTypeMap: Record<PomodoroEntryType, string> = {
  WORK_INTERVAL: "Work Interval",
  SHORT_BREAK: "Short Break",
  LONG_BREAK: "Long Break",
} as const;


const getInterval = (workInterval: number, shortBreakInterval: number, longBreakInterval: number) => (pomo?: Pomodoro | null): number => {
  if (!pomo) {
    return workInterval;
    console.log("no pomo");
  }
  const intervalType = nextEntryType(pomo.entries);
  console.log("interval type:", intervalType);
  return intervalType === "WORK_INTERVAL" ? workInterval : intervalType === "SHORT_BREAK" ? shortBreakInterval : longBreakInterval;
};


const collectEntries = (activityId: string, entries: TimeEntry[]): TimeEntry[] => {
  return entries
    .filter(entry => entry.activityId === activityId)
    .toSorted((a, b) => b.created.localeCompare(a.created));
};

const PomodoroPage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const activities = useAppSelector(selectActivities);
  const pomodoros = useAppSelector(selectPomodoros);
  const activePomodoro = useAppSelector(selectActivePomodoro);
  console.log("ACTIVE POMODORO", activePomodoro);
  const updatePomoEntry = useUpdatePomodoroEntry();

  const createNewPomodoro = (p: Pomodoro | Partial<Pomodoro>) => {
    if (currentUser?.id) {
      const newPomodoro = pomodoroFactory({ ...p, userId: currentUser?.id ?? "" });
      dispatch(setActivePomodoro(newPomodoro));
    }
  };

  const saveActivePomodoro = () => {
    dispatch(saveActivePomodoroThunk());
  };

  const updateActivePomodoro = (p: Partial<Pomodoro>) => {
    dispatch(patchActivePomodoro(p));
  };

  const resetActivePomodoro = () => {
    dispatch(clearActivePomodoro());
  };


  const updateActivePomodoroEntry = (p: Partial<PomodoroEntry> & { id: string }) => {
    dispatch(patchActivePomodoroEntry(p));
  };
  const timeEntries = useAppSelector((s) => s.timeEntries?.items ?? [])
    .map(te => ({ ...te, created: iso2LocalDateTime(te.created), updated: iso2LocalDateTime(te.created) }));


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

  const [shortBreak, setShortBreak] = React.useState<number>(0.6); // in minutes
  const [longBreak, setLongBreak] = React.useState<number>(1); // in minutes
  const [workInterval, setWorkInterval] = React.useState<number>(0.75); // in minutes
  const [pomoRunning, setPomoRunning] = React.useState<boolean>(false);
  const [showConfirmResetModal, setShowConfirmResetModal] = React.useState<boolean>(false);
  const onPausePomodoro = (minutes: number) => {
    console.log("pausing pomodoro at:", minutes);
    setPomoRunning(false);
  };

  const onStartPomodoro = (minutes: number) => {
    console.log("starting pomodoro from:", minutes);
    setPomoRunning(true);
  };

  const sortedEntries = (activePomodoro?.entries || []).toSorted((a, b) =>
    b.created.localeCompare(a.created)
  );


  const onTimerComplete = (minutes: number) => {
    const entryType = nextEntryType(activePomodoro?.entries ?? []);
    console.log("Sorted Entries", sortedEntries);
    console.log("timer complete, entry type:", entryType);
    const activityId = entryType === "WORK_INTERVAL" ? activePomodoro?.activityId : undefined;
    const pomodoroId = activePomodoro?.id;
    const pomoEntry = pomodoroEntryFactory({ activityId, entryType, pomodoroId, minutes: minutes || 1 });
    // TODO: make this a thunk that saves the entry and updates the active pomodoro
    dispatch(addActivePomodoroEntry(pomoEntry));
    // Promise.resolve().then(() => saveActivePomodoro());
  };


  return (
    <>
      <Box sx={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
        <Collapse in={!!activePomodoro}>
          <Stack direction={"column"} spacing={0} sx={{ padding: 0 }}>
            <Pomodoro
              pomodoro={activePomodoro}
              onChange={(updatedPomo) => {
                updateActivePomodoro(updatedPomo);
                // only save active pomodoro if it has entries
                if (updatedPomo.entries.length > 0) {
                  saveActivePomodoro();
                }
              }}
              activities={tassei}
            />
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                {pomodoroTimerEntryTypeMap[nextEntryType(activePomodoro?.entries || [])]}
              </Typography>
              {!!activePomodoro &&
                <PomodoroTimer
                  autoStart={true}
                  timePeriod={getInterval(workInterval, shortBreak, longBreak)(activePomodoro)}
                  onStart={onStartPomodoro}
                  onPause={onPausePomodoro}
                  onTimerComplete={onTimerComplete}
                  entries={activePomodoro?.entries}
                />
              }
              <Box sx={{ margin: "0 auto", textAlign: "center", mt: 4, mb: 0 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setShowConfirmResetModal(true);
                  }}>
                  Finish
                </Button>
              </Box>

            </Box>
            <Divider/>
            <PomodoroEntries
              entries={sortedEntries}
              onEntryActivityChange={(entryId, activityId) => {
                updateActivePomodoroEntry({ id: entryId, activityId });
                saveActivePomodoro();
              }}
              activities={tassei}/>
          </Stack>
        </Collapse>
        <Collapse in={!activePomodoro}>
          <NewPomodoro
            onSubmit={createNewPomodoro}
            activities={tassei}
          />
        </Collapse>
      </Box>
      <ConfirmPomodoroReset
        onDiscard={() => {
          setShowConfirmResetModal(false);
          resetActivePomodoro();
        }}

        showModal={showConfirmResetModal}

        onSave={() => {
          saveActivePomodoro();
          setShowConfirmResetModal(false);
          resetActivePomodoro();
        }}
        onClose={() => {
          setShowConfirmResetModal(false);
        }}
      />
    </>
  )
    ;
};

export default PomodoroPage;