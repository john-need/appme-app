import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks";
import { fetchPomodoroEntriesThunk } from "@/features/pomodoros/pomodoros-slice";

/**
 * Hook to fetch all pomodoro entries for a given pomodoroId.
 * @param pomodoroId The ID of the pomodoro.
 * @returns UseQueryResult<PomodoroEntry[], Error>
 */
export const useFetchPomodoroEntries = (pomodoroId: string): UseQueryResult<PomodoroEntry[], Error> => {
  const dispatch = useAppDispatch();

  return useQuery<PomodoroEntry[], Error>({
    queryKey: ["pomodoros", pomodoroId, "entries"],
    queryFn: async () => {
      if (!pomodoroId) {
        return [];
      }
      return await dispatch(fetchPomodoroEntriesThunk(pomodoroId));
    },
    enabled: !!pomodoroId,
  });
};
