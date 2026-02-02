import React, { useEffect, useReducer } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toDoFactory from "@/factories/to-do-factory";
import transmogrifyOccurrences from "@/utils/transmogrify-occurrences";
import repeatsLabels from "@/utils/repeats-labels";
import OccurrenceTools from "./occurrence-tools";

interface EditTodoProps extends Omit<DialogProps, "onSubmit"> {
  testId?: string;
  onClose: () => void;
  open: boolean;
  onSubmit: (todo: Partial<ToDo>) => void;
  todo: ToDo | null;
  activities: Activity[];
  isNew?: boolean;
}

type FormAction =
  | { type: "SET_STATE"; payload: ToDo }
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
    case "SET_STATE":
      return { ...state, ...action.payload };
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

export default function EditTodo({
                                   isNew = true,
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

  const handleAddOccurrence = (occurrence: string) => {
    dispatch({ type: "ADD_OCCURRENCE", payload: occurrence });
  };

  const handleDeleteOccurrence = (occurrenceToDelete: string) => {
    dispatch({ type: "DELETE_OCCURRENCE", payload: occurrenceToDelete });
  };

  const handleSetOccurrences = (occurrences: string[]) => {
    dispatch({ type: "SET_OCCURRENCES", payload: occurrences });
  };

  useEffect(() => {
    dispatch({ type: "SET_STATE", payload: toDoFactory(todo) });
  }, [todo]);


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
            <OccurrenceTools
              isOpen={showOccurrenceTools}
              occurrences={state.occurrences}
              activeOccurrenceTool={activeOccurrenceTool}
              onSetActiveOccurrenceTool={setActiveOccurrenceTool}
              onAddOccurrence={handleAddOccurrence}
              onDeleteOccurrence={handleDeleteOccurrence}
              onSetOccurrences={handleSetOccurrences}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!state.text.trim() || !state.startsOn}>
          {isNew ? "Add" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  )
    ;
}
