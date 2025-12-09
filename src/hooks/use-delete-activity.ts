import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import deleteActivity from "@/data-layer/delete-activity";
import { useAppDispatch } from "./index";
import { removeActivity } from "@/features/activities/activities-slice";
import { store } from "@/store/root-store";

type Variables = string;

const useDeleteActivity = (
  options?: UseMutationOptions<boolean, Error, Variables>
): UseMutationResult<boolean, Error, Variables> => {
  const dispatch = useAppDispatch();

  return useMutation<boolean, Error, Variables>(
    async (id: Variables) => {
      const jwt = store.getState()?.auth?.jwt ?? undefined;
      return await deleteActivity(id, jwt);
    },
    {
      ...options,
      onSuccess(data, id, ctx) {
        try {
          // Remove from redux store by id
          dispatch(removeActivity(id));
        } catch (e) {
          // ignore
        }
        if (options && options.onSuccess) options.onSuccess(data, id, ctx);
      },
    }
  );
};

export default useDeleteActivity;