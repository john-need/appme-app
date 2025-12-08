import React, { useEffect } from "react";
import { fetchActivitiesThunk } from "@/features/activities/activities-slice";
import { useAppDispatch, useAppSelector } from "@/hooks";

export default function Activities() {
  const dispatch = useAppDispatch();
  const activities = useAppSelector((s) => s.activities?.items ?? []);

  useEffect(() => {
    // dispatch the thunk to load activities into the store
    dispatch(fetchActivitiesThunk());
  }, [dispatch]);

  return (
    <div>
      <h2>User Activities</h2>
      <ul>
        {activities.map((a) => (
          <li key={a.id}>{a.name}</li>
        ))}
      </ul>
    </div>
  );
}
