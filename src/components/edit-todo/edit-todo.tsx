import React, { useReducer } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  RadioGroup,
  Radio,
  IconButton,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toDoFactory from "@/factories/to-do-factory";
import transmogrifyOccurrences from "@/utils/transmogrify-occurrences";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import repeatsLabels from "@/utils/repeats-labels";

interface EditTodoProps extends Omit<DialogProps, "onSubmit"> {
  testId?: string;
  onClose: () => void;
  open: boolean;
  onSubmit: (todo: Partial<ToDo>) => void;
  todo: ToDo | null;
  activities: Activity[];
}

type FormAction =
  | { type: "SET_TEXT"; payload: string }
  | { type: "SET_COMMENT"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_REMINDER"; payload: number | "" }
  | { type: "SET_ACTIVITY_ID"; payload: string }
  | { type: "SET_STARTS_ON"; payload: string }
  | { type: "SET_ENDS_ON"; payload: string }
  | { type: "SET_OCCURRENCES"; payload: string[] }
  | { type: "ADD_OCCURRENCE"; payload: string }
  | { type: "DELETE_OCCURRENCE"; payload: string };

const formReducer = (state: ToDo, action: FormAction): ToDo => {
  switch (action.type) {
    case "SET_TEXT":
      return { ...state, text: action.payload };
    case "SET_COMMENT":
      return { ...state, comment: action.payload };
    case "SET_TIME":
      return { ...state, time: action.payload };
    case "SET_REMINDER":
      return { ...state, reminder: action.payload === "" ? undefined : action.payload };
    case "SET_ACTIVITY_ID":
      return { ...state, activityId: action.payload };
    case "SET_STARTS_ON":
      return { ...state, startsOn: action.payload };
    case "SET_ENDS_ON":
      return { ...state, endsOn: action.payload };
    case "SET_OCCURRENCES":
      console.log("Setting occurrences to:", action.payload);
      return { ...state, occurrences: transmogrifyOccurrences(action.payload, "vet") };
    case "ADD_OCCURRENCE":
      return { ...state, occurrences: transmogrifyOccurrences(state.occurrences, "add", action.payload) };
    case "DELETE_OCCURRENCE":
      return { ...state, occurrences: transmogrifyOccurrences(state.occurrences, "remove", action.payload) };

    default:
      return state;
  }
};

const getInitialState = toDoFactory;


const nthDayArray = [
  "MONTHLY_1ST_MONDAY", "MONTHLY_1ST_TUESDAY", "MONTHLY_1ST_WEDNESDAY", "MONTHLY_1ST_THURSDAY", "MONTHLY_1ST_FRIDAY", "MONTHLY_1ST_SATURDAY", "MONTHLY_1ST_SUNDAY",
  "MONTHLY_2ND_MONDAY", "MONTHLY_2ND_TUESDAY", "MONTHLY_2ND_WEDNESDAY", "MONTHLY_2ND_THURSDAY", "MONTHLY_2ND_FRIDAY", "MONTHLY_2ND_SATURDAY", "MONTHLY_2ND_SUNDAY",
  "MONTHLY_3RD_MONDAY", "MONTHLY_3RD_TUESDAY", "MONTHLY_3RD_WEDNESDAY", "MONTHLY_3RD_THURSDAY", "MONTHLY_3RD_FRIDAY", "MONTHLY_3RD_SATURDAY", "MONTHLY_3RD_SUNDAY",
  "MONTHLY_4TH_MONDAY", "MONTHLY_4TH_TUESDAY", "MONTHLY_4TH_WEDNESDAY", "MONTHLY_4TH_THURSDAY", "MONTHLY_4TH_FRIDAY", "MONTHLY_4TH_SATURDAY", "MONTHLY_4TH_SUNDAY",
  "MONTHLY_LAST_MONDAY", "MONTHLY_LAST_TUESDAY", "MONTHLY_LAST_WEDNESDAY", "MONTHLY_LAST_THURSDAY", "MONTHLY_LAST_FRIDAY", "MONTHLY_LAST_SATURDAY", "MONTHLY_LAST_SUNDAY"
];

export default function EditTodo({
                                   onClose,
                                   onSubmit,
                                   open,
                                   activities,
                                   todo,
                                   testId = "edit-todo-dialog",
                                   ...rest
                                 }: EditTodoProps) {
  const [state, dispatch] = useReducer(formReducer, toDoFactory(todo), getInitialState);
  const [showOccurrenceTools, setShowOccurrenceTools] = React.useState<boolean>(false);
  const [activeOccurrenceTool, setActiveOccurrenceTool] = React.useState<string | null>(null);
  const [monthlyControlSet, setMonthlyControlSet] = React.useState<"date" | "day">("day");
  const [calendarValue, setCalendarValue] = React.useState<Dayjs | null>(dayjs());
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!state.text || state.text.trim() === "") return;
    if (!state.startsOn) return;

    const payload: ToDo = toDoFactory(state);

    if (todo) {
      payload.id = todo.id;
    }

    onSubmit(payload);
    handleClose();
  };

  const handleClose = () => {
    setShowOccurrenceTools(false);
    setActiveOccurrenceTool(null);
    onClose();
  };

  const addWeekDays = () => {
    setActiveOccurrenceTool(null);
    dispatch({
      type: "SET_OCCURRENCES",
      payload: [
        "WEEKLY_MONDAY",
        "WEEKLY_TUESDAY",
        "WEEKLY_WEDNESDAY",
        "WEEKLY_THURSDAY",
        "WEEKLY_FRIDAY"
      ]
    });
  };

  const handleAddOccurrence = (occurrence: string) => {
    dispatch({ type: "ADD_OCCURRENCE", payload: occurrence });
  };

  const handleDeleteOccurrence = (occurrenceToDelete: string) => {
    dispatch({ type: "DELETE_OCCURRENCE", payload: occurrenceToDelete });
  };


  const handleWeeklyChange = (
    _event: React.MouseEvent<HTMLElement>,
    newWeeklyDays: string[],
  ) => {
    dispatch({ type: "SET_OCCURRENCES", payload: newWeeklyDays.filter(occ => occ.startsWith("WEEKLY")) });
  };
  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     handleAddOccurrence();
  //   }
  // };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth data-testid={testId} {...rest}>
      <DialogTitle>
        {todo ? "Edit Todo" : "Add Todo"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Todo Text"
            type="text"
            fullWidth
            variant="outlined"
            value={state.text}
            onChange={(e) => dispatch({ type: "SET_TEXT", payload: e.target.value })}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            variant="outlined"
            value={state.comment}
            onChange={(e) => dispatch({ type: "SET_COMMENT", payload: e.target.value })}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="activity-select-label">Activity</InputLabel>
            <Select
              labelId="activity-select-label"
              id="activity-select"
              value={state.activityId || ""}
              onChange={(e) => dispatch({ type: "SET_ACTIVITY_ID", payload: e.target.value as string })}
              label="Activity"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {activities.map((activity) => (
                <MenuItem key={activity.id} value={activity.id}>
                  {activity.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            variant="outlined"
            value={state.time}
            onChange={(e) => dispatch({ type: "SET_TIME", payload: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Reminder (minutes before)"
            type="number"
            fullWidth
            variant="outlined"
            value={state.reminder}
            onChange={(e) => dispatch({
              type: "SET_REMINDER",
              payload: e.target.value === "" ? "" : Number(e.target.value)
            })}
            slotProps={{ htmlInput: { min: 0 } }}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            variant="outlined"
            value={state.startsOn}
            onChange={(e) => dispatch({ type: "SET_STARTS_ON", payload: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            variant="outlined"
            value={state.endsOn}
            onChange={(e) => dispatch({ type: "SET_ENDS_ON", payload: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>

            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>

              <Button
                id={"repeats-button"}
                variant="outlined"
                onClick={() => {
                  setShowOccurrenceTools(!showOccurrenceTools);
                }}
                sx={{ mt: 1, textTransform: "none", textAlign: "left" }}
              >
                {`Repeats ${repeatsLabels(state.occurrences).join(", ")}`}
              </Button>


            </Stack>
            <Collapse in={showOccurrenceTools} sx={{ mt: 2 }}>
              <Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
                  {
                    state.occurrences.map((occ: string) => (
                      <Chip
                        key={occ}
                        label={occ}
                        onDelete={() => handleDeleteOccurrence(occ)}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  }
                </Stack>
              </Box>
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button onClick={() => {
                  handleAddOccurrence("NEVER");
                }}>NEVER</Button>
                <Button onClick={() => {
                  handleAddOccurrence("DAILY");
                }}>DAILY</Button>
                <Button onClick={addWeekDays}>WEEKDAYS</Button>
                <Button onClick={() => {
                  setActiveOccurrenceTool("WEEKLY");
                }}>WEEKLY</Button>
                <Button onClick={() => {
                  setActiveOccurrenceTool("MONTHLY");
                }}>MONTHLY</Button>
                <Button onClick={() => {
                  setActiveOccurrenceTool("ON_DATES");
                }}>ON DATES</Button>
              </ButtonGroup>
              <Collapse in={activeOccurrenceTool === "WEEKLY"} sx={{ mt: 2 }}>
                <ToggleButtonGroup
                  value={state.occurrences}
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
              <Collapse in={activeOccurrenceTool === "MONTHLY"} sx={{ mt: 2 }}>

                <FormControl>
                  <FormLabel id="monthly-control-set-label">Set By</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="monthly-control-sets-label"
                    name="monthly-controls-sets"
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
                      const isSelected = state.occurrences.includes(occurrence);
                      const splits = occurrence.split("_");
                      const label = `${splits[1]} ${splits[2].slice(0, 3).toLowerCase()}`;
                      return (
                        <Button
                          key={occurrence}
                          variant={isSelected ? "contained" : "outlined"}
                          onClick={() => {
                            isSelected ? handleDeleteOccurrence(occurrence) : handleAddOccurrence(occurrence);
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
                      const isSelected = state.occurrences.includes(occurrence);
                      return (
                        <Button
                          key={occurrence}
                          variant={isSelected ? "contained" : "outlined"}
                          onClick={() => {
                            isSelected ? handleDeleteOccurrence(occurrence) : handleAddOccurrence(occurrence);
                          }}
                        >
                          {day}
                        </Button>
                      );
                    })}
                  </Box>
                </Collapse>
              </Collapse>
              <Collapse in={activeOccurrenceTool === "ON_DATES"} sx={{ mt: 2 }}>
                <DateCalendar
                  value={calendarValue}
                  onChange={(newValue) => {
                    setCalendarValue(newValue);
                    if (newValue) {
                      const dateStr = (newValue as Dayjs).format("YYYY-MM-DD");
                      if (state.occurrences.includes(dateStr)) {
                        handleDeleteOccurrence(dateStr);
                      } else {
                        handleAddOccurrence(dateStr);
                      }
                    }
                  }}
                  slots={{
                    day: (props: PickersDayProps) => {
                      const dateStr = props.day.format("YYYY-MM-DD");
                      const isSelected = state.occurrences.includes(dateStr);
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
            </Collapse>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!state.text.trim() || !state.startsOn}>
          {todo ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  )
    ;
}
