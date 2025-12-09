import React, { useCallback } from 'react'
import { Container } from '@mui/material'
import { selectActivities } from "@/features/activities/activities-slice";
import { useSelector } from "react-redux";
import Activities from "@/components/activities/activities";
import useAddActivity from "@/hooks/use-add-activity";
import useDeleteActivity from "@/hooks/use-delete-activity";
import useUpdateActivity from "@/hooks/use-update-activity";

export default function ActivitiesPage() {
  const activities = useSelector(selectActivities);

  const addMutation = useAddActivity();
  const updateMutation = useUpdateActivity();
  const deleteMutation = useDeleteActivity();

  const addActivity = useCallback((activity: Partial<Activity>) => {
    addMutation.mutate({ activity: activity as Activity });
  }, [addMutation]);

  const updateActivity = useCallback((activity: Activity) => {
    updateMutation.mutate(activity);
  }, [updateMutation]);

  const deleteActivity = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  return (
    <Container>
      <Activities activities={activities}
                  updateActivity={updateActivity}
                  deleteActivity={deleteActivity}
                  addActivity={addActivity}/>
    </Container>
  )
}
