import React, { useReducer } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toDoFactory from "@/factories/to-do-factory";

interface EditTodoProps {
  onClose: () => void;
  open: boolean;
  onSubmit: (todo: Partial<ToDo>) => void;
  todo: ToDo;
}

interface FormState extends ToDo {
  newOccurrence: string;
}

type FormAction =
  | { type: "SET_TEXT"; payload: string }
  | { type: "SET_COMMENT"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_REMINDER"; payload: number | "" }
  | { type: "SET_ACTIVITY_ID"; payload: string }
  | { type: "SET_STARTS_ON"; payload: string }
  | { type: "SET_ENDS_ON"; payload: string }
  | { type: "SET_NEW_OCCURRENCE"; payload: string }
  | { type: "ADD_OCCURRENCE"; payload: string }
  | { type: "DELETE_OCCURRENCE"; payload: string };

const formReducer = (state: FormState, action: FormAction): FormState => {
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
    case "SET_NEW_OCCURRENCE":
      return { ...state, newOccurrence: action.payload };
    case "ADD_OCCURRENCE":
      if (action.payload.trim() && !state.occurrences.includes(action.payload.trim())) {
        return {
          ...state,
          occurrences: [...state.occurrences, action.payload.trim()],
          newOccurrence: "",
        };
      }
      return state;
    case "DELETE_OCCURRENCE":
      return {
        ...state,
        occurrences: state.occurrences.filter((occ) => occ !== action.payload),
      };
    default:
      return state;
  }
};

const getInitialState = (todo: ToDo): FormState => ({
  ...toDoFactory(todo),
  newOccurrence: "",
});

export default function EditTodo({ onClose, onSubmit, open, todo }: EditTodoProps) {
  const [state, dispatch] = useReducer(formReducer, todo, getInitialState);


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
    onClose();
  };

  const handleAddOccurrence = () => {
    dispatch({ type: "ADD_OCCURRENCE", payload: state.newOccurrence });
  };

  const handleDeleteOccurrence = (occurrenceToDelete: string) => {
    dispatch({ type: "DELETE_OCCURRENCE", payload: occurrenceToDelete });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOccurrence();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
          <CloseIcon />
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

          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            variant="outlined"
            value={state.time}
            onChange={(e) => dispatch({ type: "SET_TIME", payload: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Reminder (minutes before)"
            type="number"
            fullWidth
            variant="outlined"
            value={state.reminder}
            onChange={(e) => dispatch({ type: "SET_REMINDER", payload: e.target.value === "" ? "" : Number(e.target.value) })}
            inputProps={{ min: 0 }}
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
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <TextField
              margin="dense"
              label="Add Occurrence"
              type="text"
              fullWidth
              variant="outlined"
              value={state.newOccurrence}
              onChange={(e) => dispatch({ type: "SET_NEW_OCCURRENCE", payload: e.target.value })}
              onKeyPress={handleKeyPress}
              helperText="e.g., WEEKLY_MONDAY, MONTHLY_1ST_FRIDAY, DAILY, 2026-03-15"
            />
            <Button
              variant="outlined"
              onClick={handleAddOccurrence}
              sx={{ mt: 1 }}
              disabled={!state.newOccurrence.trim()}
            >
              Add Occurrence
            </Button>
          </Box>

          {state.occurrences.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {state.occurrences.map((occ: string) => (
                  <Chip
                    key={occ}
                    label={occ}
                    onDelete={() => handleDeleteOccurrence(occ)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!state.text.trim() || !state.startsOn}>
          {todo ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
