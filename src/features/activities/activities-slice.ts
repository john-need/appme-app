import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/store/root-store";
import { queryClient } from "@/api/query-client";
import fetchActivities from "@/data-layer/fetch-activities";
import { addNotification } from "@/features/notification/notification-slice";
import { sortMostRecentFirst } from "@/utils/sort-by-created";

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
      state.items = sortMostRecentFirst(action.payload ?? []);
    },
    clearActivities(state) {
      state.items = [];
    },
    addActivity(state, action: PayloadAction<Activity>) {
      const activity = action.payload;
      // remove any existing item with same id, then insert new activity
      state.items = [activity, ...state.items.filter((a) => a.id !== activity.id)];
      state.items = sortMostRecentFirst(state.items);
    },
    updateActivity(state, action: PayloadAction<Activity>) {
      const activity = action.payload;
      // replace existing activity with same id (if present)
      state.items = state.items.map((a) => (a.id === activity.id ? activity : a));
      state.items = sortMostRecentFirst(state.items);
    },
    removeActivity(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items = state.items.filter((a) => a.id !== id);
    }
  }
});

export const { setActivities, clearActivities, addActivity, updateActivity, removeActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;

// Selector: return the activities array from the root state
export const selectActivities = (state: RootState): Activity[] => state.activities?.items ?? [];

// Selector: return a single activity by id (or undefined if not found)
export const selectActivityById = (state: RootState, id?: string): Activity | undefined => {
  if (!id) return undefined;
  return state.activities?.items.find((a) => a.id === id);
};

// Thunk that fetches activities using react-query and stores them in the slice
export const fetchActivitiesThunk = () => async (dispatch: AppDispatch, getState: () => RootState) => {
 console.log("fetchActivitiesThunk");
  try {
    const jwt = getState().auth?.jwt ?? "";
    // fetch activities (cache key includes jwt to scope cache per user)
    const activities: Activity[] = await queryClient.fetchQuery({
      queryKey: ["activities", jwt],
      queryFn: () => fetchActivities(jwt),
    });

    // store activities in the redux slice
    dispatch(setActivities(activities));
     // prime the cache explicitly
     try {
      queryClient.setQueryData(["activities", jwt], activities);
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
