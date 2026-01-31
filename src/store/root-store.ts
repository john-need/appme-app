import { configureStore, combineReducers } from "@reduxjs/toolkit";
import preferencesReducer from "../features/preferences/preferences-slice";
import authReducer from "../features/auth/auth-slice";
import notificationReducer from "../features/notification/notification-slice";
import activitiesReducer from "../features/activities/activities-slice";
import timeEntriesReducer from "../features/time-entries/time-entries-slice";
import pomodorosReducer from "../features/pomodoros/pomodoros-slice";
import todosReducer from "../features/todos/todos-slice";

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const rootReducer = combineReducers({
  preferences: preferencesReducer,
  auth: authReducer,
  notification: notificationReducer,
  activities: activitiesReducer,
  timeEntries: timeEntriesReducer,
  pomodoros: pomodorosReducer,
  todos: todosReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["preferences", "auth", "activities", "timeEntries", "pomodoros", "todos"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
