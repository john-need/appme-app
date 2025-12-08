import { configureStore, type PreloadedState } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counter-slice";
import preferencesReducer from "../features/preferences/preferences-slice";
import authReducer from "../features/auth/auth-slice";
import notificationReducer from "../features/notification/notification-slice";
import activitiesReducer from "../features/activities/activities-slice";
import { loadFromLocalStorage, saveToLocalStorage } from "@/utils/local-storage";
import { PREFERENCES_PERSIST_KEY, AUTH_PERSIST_KEY } from "@/config/persist-keys";

// Create the preloaded object (runtime values) then cast to PreloadedState of the store shape
const rawPreloaded = {
  preferences: loadFromLocalStorage(PREFERENCES_PERSIST_KEY) || undefined,
  auth: loadFromLocalStorage(AUTH_PERSIST_KEY) || undefined,
};

type RootReducerState = {
  counter: ReturnType<typeof counterReducer>;
  preferences: ReturnType<typeof preferencesReducer>;
  auth: ReturnType<typeof authReducer>;
  notification: ReturnType<typeof notificationReducer>;
  activities: ReturnType<typeof activitiesReducer>;
};

const preloaded = rawPreloaded as unknown as PreloadedState<RootReducerState>;

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    preferences: preferencesReducer,
    auth: authReducer,
    notification: notificationReducer,
    activities: activitiesReducer,
  },
  preloadedState: preloaded,
});

// subscribe to save preferences and auth changes
store.subscribe(() => {
  const state = store.getState();
  if (state && state.preferences) {
    saveToLocalStorage(PREFERENCES_PERSIST_KEY, state.preferences);
  }
  if (state && state.auth) {
    // only persist relevant auth fields (avoid persisting transient flags if desired)
    saveToLocalStorage(AUTH_PERSIST_KEY, state.auth);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
