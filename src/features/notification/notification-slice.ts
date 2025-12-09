import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NotificationSeverity = "error" | "warning" | "info" | "success"

export interface Notification {
  id: string
  message: string
  severity?: NotificationSeverity
}

interface NotificationState {
  list: Notification[]
}

const initialState: NotificationState = { list: [] };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.list.push(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.list = [];
    }
  }
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

