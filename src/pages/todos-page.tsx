import React, { useMemo, useState } from "react";
import { Container, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { selectTodos } from "@/features/todos/todos-slice";
import { addTodoThunk, updateTodoThunk } from "@/features/todos/todos-slice";
import ToDosList from "@/components/todos-list/todos-list";
import EditTodo from "@/components/edit-todo/edit-todo";
import { selectActivities } from "@/features/activities/activities-slice";
import { todosByDate, toIso } from "@/utils";
import toLocalYMD from "@/utils/to-local-ymd";
import toDoFactory from "@/factories/to-do-factory";

const ToDosPage = () => {
  const todos = useAppSelector(selectTodos);
  const activities = useAppSelector(selectActivities);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<ToDo>(toDoFactory({}));

  const handleOpenAddDialog = () => {
    setSelectedTodo(toDoFactory({}));
    setIsOpen(true);
  };

  const handleSaveTodo = (todo: Partial<ToDo>) => {
    if (todos.map(td => td.id).includes(selectedTodo.id)) {
      // Update existing todo
      dispatch(updateTodoThunk({ ...todo, id: selectedTodo.id } as ToDo));
    } else {
      // Add new todo
      dispatch(addTodoThunk(todo as ToDo));
    }
    setIsOpen(false);
  };

  const handleEdit = (todo: ToDo) => (event: React.MouseEvent) => {
    console.log("edit todo", todo);
    event.stopPropagation();
    setSelectedTodo(todo);
    setIsOpen(true);
  };


  const setToDoDone = (todo: ToDo) => (event: React.MouseEvent) => {
    console.log("set todo done", todo);
    event.stopPropagation();
    const today = toIso(new Date());
    const updatedCompletions = todo.completions ? [...todo.completions, today] : [today];
    dispatch(updateTodoThunk({ ...todo, completions: updatedCompletions }));
  };


  const setToDoUndone = (todo: ToDo) => (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!todo.completions || todo.completions.length === 0) {
      return;
    }
    const today = toIso(new Date());
    const todayDateOnly = toLocalYMD(today);
    const updatedCompletions = todo.completions.filter((date) => toLocalYMD(date) !== todayDateOnly);
    dispatch(updateTodoThunk({ ...todo, completions: updatedCompletions }));
  };

  const todayString = toLocalYMD(new Date());
  const todaysTodos = useMemo(()=>{
    return todosByDate(todos, todayString);
  },[todos, todayString]);

  return (
    <>
      <Container sx={{ py: 4 }}>
        <ToDosList
          todos={todaysTodos}
          onEdit={handleEdit}
          setToDoUndone={setToDoUndone}
          setToDoDone={setToDoDone}
        />

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
        activities={activities}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSaveTodo}
        todo={selectedTodo}
        isNew={ !todos.map(td => td.id).includes(selectedTodo.id) }
      />
    </>
  );
};


export default ToDosPage;