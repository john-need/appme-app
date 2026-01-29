import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/store/root-store";
import { queryClient } from "@/api/query-client";
import { fetchPomodoros } from "@/data-layer/fetch-pomodoros";
import { addPomodoro as addPomodoroApi } from "@/data-layer/add-pomodoro";
import { fetchPomodoroEntries } from "@/data-layer/fetch-pomodoro-entries";
import { addPomodoroEntry as addPomodoroEntryQuery } from "@/data-layer/add-pomodoro-entry";
import { updatePomodoroEntry as updatePomodoroEntryApi } from "@/data-layer/update-pomodoro-entry";
import { patchPomodoro as patchPomodoroApi } from "@/data-layer/patch-pomodoro";
import { addNotification } from "@/features/notification/notification-slice";
import { sortMostRecentFirst } from "@/utils/sort-by-created";
import pomodoroFactory from "@/factories/pomodoro-factory";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";
import userFactory from "@/factories/user-factory";

interface PomodorosState {
  activePomodoro: Pomodoro | null;
  items: Pomodoro[];
}

const initialState: PomodorosState = {
  activePomodoro: null,
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
    addPomodoroEntry(state, action: PayloadAction<PomodoroEntry>) {
      const entry = action.payload;
      const pomodoro = state.items.find((p) => p.id === entry.pomodoroId);
      if (pomodoro) {
        pomodoro.entries = [entry, ...(pomodoro.entries || [])];
      }
    },
    addActivePomodoroEntry(state, action: PayloadAction<PomodoroEntry>) {
      const entry = action.payload;
      console.log("addActivePomodoroEntry", entry);
      if (state.activePomodoro && state.activePomodoro.id === entry.pomodoroId) {
        state.activePomodoro.entries = [entry, ...(state.activePomodoro.entries || [])];
      }
    },
    patchActivePomodoroEntry(state, action: PayloadAction<Partial<PomodoroEntry> & { id: string }>) {
      const patch = action.payload;
      if (state.activePomodoro) {
        state.activePomodoro.entries = (state.activePomodoro.entries || []).map((e) =>
          e.id === patch.id ? { ...e, ...patch } : e
        );
      }
    },
    deleteActivePomodoroEntry(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.activePomodoro) {
        state.activePomodoro.entries = (state.activePomodoro.entries || []).filter((e) => e.id !== id);
      }
    },
    updatePomodoroEntry(state, action: PayloadAction<PomodoroEntry>) {
      const entry = action.payload;
      const pomodoro = state.items.find((p) => p.id === entry.pomodoroId);
      if (pomodoro) {
        pomodoro.entries = (pomodoro.entries || []).map((e) => (e.id === entry.id ? entry : e));
      }
    },
    setPomodoroEntries(state, action: PayloadAction<{ pomodoroId: string; entries: PomodoroEntry[] }>) {
      const { pomodoroId, entries } = action.payload;
      const pomodoro = state.items.find((p) => p.id === pomodoroId);
      if (pomodoro) {
        pomodoro.entries = entries;
      }
    },
    setActivePomodoro(state, action: PayloadAction<Pomodoro | null>) {
      state.activePomodoro = action.payload;
    },
    updateActivePomodoro(state, action: PayloadAction<Pomodoro>) {
      state.activePomodoro = action.payload;
    },
    patchActivePomodoro(state, action: PayloadAction<Partial<Pomodoro>>) {
      if (state.activePomodoro) {
        state.activePomodoro = { ...state.activePomodoro, ...action.payload };
      }
    },
    editPomodoro(state, action: PayloadAction<string>) {
      const id = action.payload;
      const pomodoro = state.items.find((p) => p.id === id);
      if (pomodoro) {
        state.activePomodoro = { ...pomodoro };
      }
    },
    clearActivePomodoro(state) {
      state.activePomodoro = null;
    },
  },
});

export const {
  setPomodoros,
  clearPomodoros,
  addPomodoro,
  updatePomodoro,
  deletePomodoro,
  addPomodoroEntry,
  addActivePomodoroEntry,
  patchActivePomodoroEntry,
  deleteActivePomodoroEntry,
  updatePomodoroEntry,
  setPomodoroEntries,
  setActivePomodoro,
  updateActivePomodoro,
  patchActivePomodoro,
  editPomodoro,
  clearActivePomodoro,
} = slice.actions;
export default slice.reducer;

// Selector: return the pomodoros array from the root state
export const selectPomodoros = (state: RootState): Pomodoro[] => state.pomodoros?.items ?? [];
export const selectActivePomodoro = (state: RootState): Pomodoro | null => state.pomodoros?.activePomodoro;

// Thunks
export const fetchPomodoroEntriesThunk =
  (pomodoroId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const jwt = getState().auth?.jwt ?? "";
      const entries: PomodoroEntry[] = await queryClient.fetchQuery({
        queryKey: ["pomodoros", pomodoroId, "entries"],
        queryFn: () => fetchPomodoroEntries(jwt, pomodoroId),
      });
      // fetchPomodoroEntries already normalizes using pomodoroEntryFactory
      dispatch(setPomodoroEntries({ pomodoroId, entries }));
      return entries;
    } catch (err) {
      const message = (err as Error)?.message ?? "Failed to load pomodoro entries";
      dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
      throw err;
    }
  };

export const updatePomodoroEntryThunk =
  (pomodoroId: string, entry: PomodoroEntry) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const jwt = getState().auth?.jwt ?? "";
      const updatedEntry = await updatePomodoroEntryApi(jwt, pomodoroId, entry.id, entry);
      dispatch(updatePomodoroEntry(updatedEntry));
      return updatedEntry;
    } catch (err) {
      const message = (err as Error)?.message ?? "Failed to update pomodoro entry";
      dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
      throw err;
    }
  };

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

export const saveActivePomodoroThunk = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const { activePomodoro, items = [] } = getState().pomodoros;
    if (!activePomodoro) {
      throw new Error("No active pomodoro to save");
    }
    const jwt = getState().auth?.jwt ?? "";
    const user = getState().auth?.user;

    const isExisting = items.some((p) => p.id === activePomodoro.id);

    if (isExisting && user) {
      console.log("updating existing pomodoro");
      const normalizedUser = userFactory(user);
      const updatedPomodoro = await patchPomodoroApi(activePomodoro, normalizedUser, jwt);
      if (updatedPomodoro) {
        dispatch(updatePomodoro(updatedPomodoro));
        return updatedPomodoro;
      }
    }
console.log("adding new pomodoro");
    const newPomodoro = await addPomodoroApi(activePomodoro, jwt);
    dispatch(addPomodoro(newPomodoro));
    return newPomodoro;
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to save pomodoro";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};

export const addPomodoroThunk = (pomodoro: Partial<Pomodoro>) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const jwt = getState().auth?.jwt ?? "";
    const normalized = pomodoroFactory(pomodoro);
    const data = await addPomodoroApi(normalized, jwt);
    dispatch(addPomodoro(data));
    return data;
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to add pomodoro";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};

export const addPomodoroEntryThunk = (pomodoroId: string, entry: Partial<PomodoroEntry>) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const jwt = getState().auth?.jwt ?? "";
    const normalized = pomodoroEntryFactory(entry);
    const data = await addPomodoroEntryQuery(pomodoroId, normalized, jwt);
    dispatch(addPomodoroEntry(data));
    return data;
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to add pomodoro entry";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};
