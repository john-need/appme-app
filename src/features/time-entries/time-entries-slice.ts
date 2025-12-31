import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/store/root-store";
import { queryClient } from "@/api/query-client";
import fetchTimeEntries from "@/data-layer/fetch-time-entries";
import { addNotification } from "@/features/notification/notification-slice";
import { sortMostRecentFirst } from "@/utils/sort-by-created";
import timeEntryFactory from "@/factories/time-entry-factory";

interface TimeEntriesState {
  items: TimeEntry[];
}

const initialState: TimeEntriesState = {
  items: [],
};

const slice = createSlice({
  name: "timeEntries",
  initialState,
  reducers: {
    setTimeEntries(state, action: PayloadAction<TimeEntry[]>) {
      state.items = sortMostRecentFirst(action.payload ?? []);
    },
    clearTimeEntries(state) {
      state.items = [];
    },
    addTimeEntry(state, action: PayloadAction<TimeEntry>) {
      const entry = action.payload;
      state.items = [entry, ...state.items.filter((t) => t.id !== entry.id)];
      state.items = sortMostRecentFirst(state.items);
    },
    updateTimeEntry(state, action: PayloadAction<TimeEntry>) {
      const entry = action.payload;
      state.items = state.items.map((t) => (t.id === entry.id ? entry : t));
      state.items = sortMostRecentFirst(state.items);
    },
    // Remove a time entry by id
    deleteTimeEntry(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items = state.items.filter((t) => t.id !== id);
    },
  },
});

export const { setTimeEntries, clearTimeEntries, addTimeEntry, updateTimeEntry, deleteTimeEntry } = slice.actions;
export default slice.reducer;

// Selector: return the time entries array from the root state
export const selectTimeEntries = (state: RootState): TimeEntry[] => state.timeEntries?.items ?? [];

// Thunk
export const fetchTimeEntriesThunk = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const jwt = getState().auth?.jwt ?? "";
    const timeEntries: TimeEntry[] = await queryClient.fetchQuery({
      queryKey: ["timeEntries"],
      queryFn: () => fetchTimeEntries(jwt),
    });
    const normalizedTimeEntries = timeEntries.map(timeEntryFactory);
    dispatch(setTimeEntries(timeEntries));
    try {
      queryClient.setQueryData(["timeEntries"], normalizedTimeEntries );
    } catch (e) {
      // ignore
    }
    return timeEntries;
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to load time entries";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};
