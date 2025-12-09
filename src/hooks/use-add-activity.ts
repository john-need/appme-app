import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { store } from "@/store/root-store";
import activityFactory from "@/factories/activity-factory";
import { addActivity as addActivityAction } from "@/features/activities/activities-slice";
import query from "@/data-layer/add-activity";

type Variables = { activity: Partial<Activity> };

// React Query hook wrapper. Usage:
// const mutation = useAddActivity(options)
// mutation.mutate({ activity, jwt })
export default function useAddActivity(
  options?: UseMutationOptions<Activity, Error, Variables>
): UseMutationResult<Activity, Error, Variables> {
  return useMutation<Activity, Error, Variables>(
    async (vars: Variables) => {
      // normalize before sending
      const normalized = activityFactory(vars.activity ?? ({} as Partial<Activity>));
      // prefer provided jwt, otherwise read from store
      const jwt =  store.getState()?.auth?.jwt ?? undefined;
      return await query(normalized, jwt);
    },
    {
      ...options,
      onSuccess(data, vars, ctx) {
        try {
          // dispatch into redux activities slice (will insert and keep order)
          store.dispatch(addActivityAction(data));
        } catch (e) {
          // ignore dispatch errors
        }
        // call user-provided onSuccess if present
        if (options && options.onSuccess) options.onSuccess(data, vars, ctx);
      },
    }
  );
}
