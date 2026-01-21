import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { store } from "@/store/root-store";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";
import { addPomodoroEntry as addPomodoroEntryAction } from "@/features/pomodoros/pomodoros-slice";
import { addPomodoroEntry as addPomodoroEntryQuery } from "@/data-layer/add-pomodoro-entry";

type Variables = { pomodoroId: string; entry: Partial<PomodoroEntry> };

/**
 * Hook to add a new pomodoro entry.
 * Usage:
 * const mutation = useAddPomodoroEntry(options)
 * mutation.mutate({ pomodoroId, entry })
 */
export default function useAddPomodoroEntry(
  options?: UseMutationOptions<PomodoroEntry, Error, Variables>
): UseMutationResult<PomodoroEntry, Error, Variables> {
  return useMutation<PomodoroEntry, Error, Variables>(
    async (vars: Variables) => {
      // normalize before sending
      const normalized = pomodoroEntryFactory(vars.entry ?? ({} as Partial<PomodoroEntry>));
      // read jwt from store
      const jwt = store.getState()?.auth?.jwt ?? "";
      return await addPomodoroEntryQuery(vars.pomodoroId, normalized, jwt);
    },
    {
      ...options,
      onSuccess(data, vars, ctx) {
        try {
          // dispatch into redux pomodoros slice
          store.dispatch(addPomodoroEntryAction(data));
        } catch (e) {
          // ignore dispatch errors
        }
        // call user-provided onSuccess if present
        if (options && options.onSuccess) options.onSuccess(data, vars, ctx);
      },
    }
  );
}
