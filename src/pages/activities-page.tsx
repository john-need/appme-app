import React, { useCallback } from "react";
import { Container } from "@mui/material";
import { selectActivities, addActivityThunk, deleteActivityThunk, updateActivityThunk } from "@/features/activities/activities-slice";
import { useSelector } from "react-redux";
import Activities from "@/components/activities/activities";
import { useAppDispatch } from "@/hooks";

export default function ActivitiesPage() {
  const activities = useSelector(selectActivities);
  const dispatch = useAppDispatch();

  const addActivity = useCallback((activity: Partial<Activity>) => {
    dispatch(addActivityThunk(activity));
  }, [dispatch]);

  const updateActivity = useCallback((activity: Activity) => {
    dispatch(updateActivityThunk(activity));
  }, [dispatch]);

  const deleteActivity = useCallback((id: string) => {
    dispatch(deleteActivityThunk(id));
  }, [dispatch]);

  return (
    <Container>
      <Activities activities={activities}
                  updateActivity={updateActivity}
                  deleteActivity={deleteActivity}
                  addActivity={addActivity}/>
    </Container>
  );
}
