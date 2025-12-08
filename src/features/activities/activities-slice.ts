import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../../store/root-store";
import { queryClient } from "../../api/query-client";
import fetchActivities from "../../data-layer/fetch-activities";
import { addNotification } from "../notification/notification-slice";

interface ActivitiesState {
  items: Activity[]
}

const initialState: ActivitiesState = {
  items: []
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    setActivities(state, action: PayloadAction<Activity[]>) {
      state.items = action.payload;
    },
    clearActivities(state) {
      state.items = [];
    }
  }
});

export const { setActivities, clearActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;

// Thunk that fetches activities using react-query and stores them in the slice
export const fetchActivitiesThunk = () => async (dispatch: AppDispatch, getState: () => RootState) => {
 console.log("fetchActivitiesThunk");
  try {
    const jwt = getState().auth?.jwt ?? "";
    const activities: Activity[] = await queryClient.fetchQuery({
      queryKey: ["activities"],
      queryFn: () => fetchActivities(jwt),
    });
    dispatch(setActivities(activities));
    // prime the cache explicitly
    try {
      queryClient.setQueryData(["activities"], activities);
    } catch (e) {
      // ignore
    }
    return activities;
  } catch (err) {
    const message = (err as Error)?.message ?? "Failed to load activities";
    dispatch(addNotification({ id: String(Date.now()), message, severity: "error" }));
    throw err;
  }
};
