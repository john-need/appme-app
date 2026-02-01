import React, { useState } from "react";
import { Container, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { selectTodos } from "@/features/todos/todos-slice";
import { addTodoThunk, updateTodoThunk } from "@/features/todos/todos-slice";
import ToDosList from "@/components/todos-list/todos-list";
import EditTodo from "@/components/edit-todo/edit-todo";
import toDoFactory from "@/factories/to-do-factory";

const ToDosPage = () => {
  const todos = useAppSelector(selectTodos);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<ToDo>(toDoFactory());

  const handleOpenAddDialog = () => {
    setSelectedTodo(toDoFactory());
    setIsOpen(true);
  };

  const handleSaveTodo = (todo: Partial<ToDo>) => {
    if (selectedTodo) {
      // Update existing todo
      dispatch(updateTodoThunk({ ...todo, id: selectedTodo.id } as ToDo));
    } else {
      // Add new todo
      dispatch(addTodoThunk(todo as ToDo));
    }
    setIsOpen(false);
  };

  return (
    <>
      <Container sx={{ py: 4 }}>
        <ToDosList todos={todos} />

        <Fab
          color="primary"
          aria-label="add todo"
          sx={{
            position: "fixed",
            bottom: 28,
            right: 16,
          }}
          onClick={handleOpenAddDialog}
        >
          <AddIcon />
        </Fab>
      </Container>
      <EditTodo
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSaveTodo}
        todo={selectedTodo}
      />
    </>
  );
};


export default ToDosPage;