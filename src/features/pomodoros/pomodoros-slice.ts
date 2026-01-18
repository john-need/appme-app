import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/store/root-store";
import { queryClient } from "@/api/query-client";
import { fetchPomodoros } from "@/data-layer/fetch-pomodoros";
import { addNotification } from "@/features/notification/notification-slice";
import { sortMostRecentFirst } from "@/utils/sort-by-created";
import pomodoroFactory from "@/factories/pomodoro-factory";

interface PomodorosState {
  items: Pomodoro[];
}

const initialState: PomodorosState = {
  items: [],
};

const slice = createSlice({
  name: "pomodoros",
  initialState,
  reducers: {
    setPomodoros(state, action: PayloadAction<Pomodoro[]>) {
      state.items = sortMostRecentFirst(action.payload ?? []);
    },
    clearPomodoros(state) {
      state.items = [];
    },
    addPomodoro(state, action: PayloadAction<Pomodoro>) {
      const entry = action.payload;
      state.items = [entry, ...state.items.filter((p) => p.id !== entry.id)];
      state.items = sortMostRecentFirst(state.items);
    },
    updatePomodoro(state, action: PayloadAction<Pomodoro>) {
      const entry = action.payload;
      state.items = state.items.map((p) => (p.id === entry.id ? entry : p));
      state.items = sortMostRecentFirst(state.items);
    },
    deletePomodoro(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items = state.items.filter((p) => p.id !== id);
    },
  },
});

export const { setPomodoros, clearPomodoros, addPomodoro, updatePomodoro, deletePomodoro } = slice.actions;
export default slice.reducer;

// Selector: return the pomodoros array from the root state
export const selectPomodoros = (state: RootState): Pomodoro[] => state.pomodoros?.items ?? [];

// Thunk
export const fetchPomodorosThunk = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const jwt = getState().auth?.jwt ?? "";
    const pomodoros: Pomodoro[] = await queryClient.fetchQuery({
      queryKey: ["pomodoros"],
      queryFn: () => fetchPomodoros(jwt),
    });
    const normalizedPomodoros = pomodoros.map((p) => pomodoroFactory(p));
    dispatch(setPomodoros(pomodoros));
    try {
      queryClient.setQueryData(["pomodoros"], normalizedPomodoros);
    } catch (e) {
      // ignore
    }
    return pomodoros;
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to load pomodoros";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};
