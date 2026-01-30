import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/store/root-store";
import { queryClient } from "@/api/query-client";
import fetchTodos from "@/data-layer/fetch-todos";
import addTodoQuery from "@/data-layer/add-todo";
import patchTodoQuery from "@/data-layer/patch-todo";
import deleteTodoQuery from "@/data-layer/delete-todo";
import { addNotification } from "@/features/notification/notification-slice";
import { sortMostRecentFirst } from "@/utils/sort-by-created";
import todoFactory from "@/factories/todo-factory";

interface TodosState {
  items: ToDo[];
}

const initialState: TodosState = {
  items: [],
};

const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<ToDo[]>) {
      state.items = sortMostRecentFirst(action.payload ?? []);
    },
    clearTodos(state) {
      state.items = [];
    },
    addTodo(state, action: PayloadAction<ToDo>) {
      const todo = action.payload;
      state.items = [todo, ...state.items.filter((t) => t.id !== todo.id)];
      state.items = sortMostRecentFirst(state.items);
    },
    updateTodo(state, action: PayloadAction<ToDo>) {
      const todo = action.payload;
      state.items = state.items.map((t) => (t.id === todo.id ? todo : t));
      state.items = sortMostRecentFirst(state.items);
    },
    // Remove a todo by id
    deleteTodo(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items = state.items.filter((t) => t.id !== id);
    },
  },
});

export const { setTodos, clearTodos, addTodo, updateTodo, deleteTodo } = slice.actions;
export default slice.reducer;

// Selector: return the todos array from the root state
export const selectTodos = (state: RootState): ToDo[] => state.todos?.items ?? [];

// Thunk
export const fetchTodosThunk = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const jwt = getState().auth?.jwt ?? "";
    const todos: ToDo[] = await queryClient.fetchQuery({
      queryKey: ["todos"],
      queryFn: () => fetchTodos(jwt),
    });
    dispatch(setTodos(todos));
    try {
      queryClient.setQueryData(["todos"], todos);
    } catch (e) {
      // ignore
    }
    return todos;
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to load todos";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};

export const addTodoThunk = (todo: Partial<ToDo>) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const jwt = getState().auth?.jwt ?? undefined;
    const normalized = todoFactory(todo);
    const data = await addTodoQuery(normalized, jwt);
    dispatch(addTodo(data));
    return data;
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to add todo";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};

export const updateTodoThunk = (todo: Partial<ToDo> & { id: string }) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const jwt = getState().auth?.jwt ?? undefined;
    const data = await patchTodoQuery(todo, jwt);
    dispatch(updateTodo(data));
    return data;
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to update todo";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};

export const deleteTodoThunk = (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const jwt = getState().auth?.jwt ?? undefined;
    await deleteTodoQuery(id, jwt);
    dispatch(deleteTodo(id));
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to delete todo";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};
