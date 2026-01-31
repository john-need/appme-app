import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface ToDosListProps {
  todos: ToDo[];
}

export default function ToDosList({ todos }: ToDosListProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isCompleted = (todo: ToDo) => {
    return todo.completions && todo.completions.length > 0;
  };

  if (todos.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No todos found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Create your first todo to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My To-Dos
      </Typography>

      <List sx={{ width: "100%" }}>
        {todos.map((todo) => {
          const completed = isCompleted(todo);
          
          return (
            <Paper
              key={todo.id}
              elevation={1}
              sx={{
                mb: 2,
                opacity: completed ? 0.7 : 1,
              }}
            >
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 2,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%", mb: 1 }}>
                  {completed ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <RadioButtonUncheckedIcon color="action" />
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration: completed ? "line-through" : "none",
                      flexGrow: 1,
                    }}
                  >
                    {todo.text}
                  </Typography>
                </Stack>

                {todo.comment && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 4, mb: 1 }}
                  >
                    {todo.comment}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} sx={{ ml: 4, mt: 1 }}>
                  {todo.startsOn && (
                    <Chip
                      label={`Starts: ${formatDate(todo.startsOn)}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {todo.endsOn && (
                    <Chip
                      label={`Ends: ${formatDate(todo.endsOn)}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {todo.time && (
                    <Chip
                      label={`Time: ${todo.time}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {todo.reminder && (
                    <Chip
                      label={`Reminder: ${todo.reminder} min`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  )}
                  {completed && (
                    <Chip
                      label={`Completed: ${formatDate(todo.completions[0])}`}
                      size="small"
                      color="success"
                    />
                  )}
                </Stack>

                {todo.occurrences && todo.occurrences.length > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: 1 }}>
                    Recurs: {todo.occurrences.length} occurrence(s)
                  </Typography>
                )}
              </ListItem>
            </Paper>
          );
        })}
      </List>
    </Box>
  );
}
