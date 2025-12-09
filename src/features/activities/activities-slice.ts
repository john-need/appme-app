import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/store/root-store";
import { queryClient } from "@/api/query-client";
import fetchActivities from "@/data-layer/fetch-activities";
import { addNotification } from "@/features/notification/notification-slice";

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
      // ensure items are ordered most-recent-first by created timestamp
      state.items = (action.payload ?? []).slice().sort((a, b) => {
        const ta = new Date(a.created).getTime();
        const tb = new Date(b.created).getTime();
        return tb - ta;
      });
    },
    clearActivities(state) {
      state.items = [];
    },
    addActivity(state, action: PayloadAction<Activity>) {
      const activity = action.payload;
      // remove any existing item with same id, then insert new activity
      state.items = [activity, ...state.items.filter((a) => a.id !== activity.id)];
      // sort by created date descending (most recent first)
      state.items.sort((a, b) => {
        const ta = new Date(a.created).getTime();
        const tb = new Date(b.created).getTime();
        return tb - ta;
      });
    },
    updateActivity(state, action: PayloadAction<Activity>) {
      const activity = action.payload;
      // replace existing activity with same id (if present)
      state.items = state.items.map((a) => (a.id === activity.id ? activity : a));
      // keep items ordered by created (most recent first)
      state.items.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
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
