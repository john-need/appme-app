import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/store/root-store";
import { queryClient } from "@/api/query-client";
import fetchTimeEntries from "@/data-layer/fetch-time-entries";
import { addNotification } from "@/features/notification/notification-slice";

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
      state.items = action.payload;
    },
    clearTimeEntries(state) {
      state.items = [];
    },
  },
});

export const { setTimeEntries, clearTimeEntries } = slice.actions;
export default slice.reducer;

// Thunk
export const fetchTimeEntriesThunk = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const jwt = getState().auth?.jwt ?? "";
    const timeEntries: TimeEntry[] = await queryClient.fetchQuery({
      queryKey: ["timeEntries"],
      queryFn: () => fetchTimeEntries(jwt),
    });
    dispatch(setTimeEntries(timeEntries));
    try {
      queryClient.setQueryData(["timeEntries"], timeEntries);
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

