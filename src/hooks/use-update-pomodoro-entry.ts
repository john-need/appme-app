import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { store } from "@/store/root-store";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";
import { updatePomodoroEntryThunk } from "@/features/pomodoros/pomodoros-slice";

type Variables = { pomodoroId: string; entry: PomodoroEntry };

/**
 * Hook to update an existing pomodoro entry.
 * Usage:
 * const mutation = useUpdatePomodoroEntry(options)
 * mutation.mutate({ pomodoroId, entry })
 */
export default function useUpdatePomodoroEntry(
  options?: UseMutationOptions<PomodoroEntry, Error, Variables>
): UseMutationResult<PomodoroEntry, Error, Variables> {
  return useMutation<PomodoroEntry, Error, Variables>(
    async (vars: Variables) => {
      const { pomodoroId, entry } = vars;
      
      // Normalize the entry before sending
      const normalizedEntry = pomodoroEntryFactory(entry as any);
      
      // Dispatch the thunk which handles the API call and Redux state update
      return await store.dispatch(updatePomodoroEntryThunk(pomodoroId, normalizedEntry));
    },
    options
  );
}
