import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import { store } from "@/store/root-store";
import pomodoroFactory from "@/factories/pomodoro-factory";
import { addPomodoro as addPomodoroAction } from "@/features/pomodoros/pomodoros-slice";
import { addPomodoro as addPomodoroQuery } from "@/data-layer/add-pomodoro";

type Variables = { pomodoro: Partial<Pomodoro> };

/**
 * Hook to add a new pomodoro.
 * Usage:
 * const mutation = useAddPomodoro(options)
 * mutation.mutate({ pomodoro })
 */
export default function useAddPomodoro(
  options?: UseMutationOptions<Pomodoro, Error, Variables>
): UseMutationResult<Pomodoro, Error, Variables> {
  return useMutation<Pomodoro, Error, Variables>(
    async (vars: Variables) => {
      // normalize before sending
      const normalized = pomodoroFactory(vars.pomodoro ?? ({} as Partial<Pomodoro>));
      // read jwt from store
      const jwt = store.getState()?.auth?.jwt ?? "";
      return await addPomodoroQuery(normalized, jwt);
    },
    {
      ...options,
      onSuccess(data, vars, ctx) {
        try {
          // dispatch into redux pomodoros slice
          store.dispatch(addPomodoroAction(data));
        } catch (e) {
          // ignore dispatch errors
        }
        // call user-provided onSuccess if present
        if (options && options.onSuccess) options.onSuccess(data, vars, ctx);
      },
    }
  );
}
