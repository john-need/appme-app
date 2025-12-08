import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Snackbar, Alert } from "@mui/material";
import { removeNotification } from "../../features/notification/notification-slice";

export default function NotificationCenter() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((s) => s.notification.list);

  return (
    <>
      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={() => dispatch(removeNotification(n.id))}
          autoHideDuration={6000}
        >
          <Alert onClose={() => dispatch(removeNotification(n.id))} severity={n.severity ?? "info"} sx={{ width: "100%" }}>
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}

