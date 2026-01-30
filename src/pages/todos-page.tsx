import React from "react";
import { Container } from "@mui/material";
import { useAppSelector } from "@/hooks";
import { selectTodos } from "@/features/todos/todos-slice";
import ToDosList from "@/components/todos-list/todos-list";

export default function ToDosPage() {
  const todos = useAppSelector(selectTodos);

  return (
    <Container sx={{ py: 4 }}>
      <ToDosList todos={todos} />
    </Container>
  );
}
