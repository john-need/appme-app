import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import query from "@/data-layer/patch-activity";
import { store } from "@/store/root-store";
import { useAppDispatch } from "./index";
import { updateActivity as updateActivityAction } from "@/features/activities/activities-slice";

type Variables = Partial<Activity> & { id: string };

const useUpdateActivity = (
  options?: UseMutationOptions<Activity, Error, Variables>
): UseMutationResult<Activity, Error, Variables> => {
  const dispatch = useAppDispatch();

  return useMutation<Activity, Error, Variables>(
    async (vars: Variables) => {
      const jwt = store.getState()?.auth?.jwt ?? undefined;
      return await query(vars, jwt);
    },
    {
      ...options,
      onSuccess(data, vars, ctx) {
        try {
          // dispatch the updated activity into the store
          dispatch(updateActivityAction(data));
        } catch (e) {
          // ignore dispatch error
        }
        if (options && options.onSuccess) options.onSuccess(data, vars, ctx);
      },
    }
  );
};

export default useUpdateActivity;