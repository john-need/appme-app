import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import patchTimeEntry from "@/data-layer/patch-time-entry";
import { store } from "@/store/root-store";
import { useAppDispatch } from "./index";
import { updateTimeEntry as updateTimeEntryAction } from "@/features/time-entries/time-entries-slice";

type Variables = Partial<TimeEntry> & { id: string };

const useUpdateTimeEntry = (
  options?: UseMutationOptions<TimeEntry, Error, Variables>
): UseMutationResult<TimeEntry, Error, Variables> => {
  const dispatch = useAppDispatch();

  return useMutation<TimeEntry, Error, Variables>(
    async (vars: Variables) => {
      const jwt = store.getState()?.auth?.jwt ?? undefined;
      return await patchTimeEntry(vars, jwt);
    },
    {
      ...options,
      onSuccess(data, vars, ctx) {
        try {
          dispatch(updateTimeEntryAction(data));
        } catch (e) {
          // ignore
        }
        if (options && options.onSuccess) options.onSuccess(data, vars, ctx);
      },
    }
  );
};

export default useUpdateTimeEntry;

