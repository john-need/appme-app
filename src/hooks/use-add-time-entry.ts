import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { store } from "@/store/root-store";
import timeEntryFactory from "@/factories/time-entry-factory";
import { addTimeEntry as addTimeEntryAction } from "@/features/time-entries/time-entries-slice";
import query from "@/data-layer/add-time-entry";

type Variables = { timeEntry: Partial<TimeEntry> };

// React Query hook wrapper. Usage:
// const mutation = useAddTimeEntry(options)
// mutation.mutate({ timeEntry, jwt })
export default function useAddTimeEntry(
  options?: UseMutationOptions<TimeEntry, Error, Variables>
): UseMutationResult<TimeEntry, Error, Variables> {
  return useMutation<TimeEntry, Error, Variables>(
    async (vars: Variables) => {
      // normalize before sending
      const normalized = timeEntryFactory(vars.timeEntry ?? ({} as Partial<TimeEntry>));
      // prefer provided jwt, otherwise read from store
      const jwt =  store.getState()?.auth?.jwt ?? undefined;
      return await query(normalized, jwt);
    },
    {
      ...options,
      onSuccess(data, vars, ctx) {
        try {
          // dispatch into redux timeEntries slice (will insert and keep order)
          store.dispatch(addTimeEntryAction(data));
        } catch (e) {
          // ignore dispatch errors
        }
        // call user-provided onSuccess if present
        if (options && options.onSuccess) options.onSuccess(data, vars, ctx);
      },
    }
  );
}
