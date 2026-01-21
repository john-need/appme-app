import getApiBase from "@/utils/get-api-base";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";

/**
 * Patches a specific pomodoro entry.
 * @param jwt The JSON Web Token for authentication.
 * @param pomodoroId The ID of the pomodoro.
 * @param pomodoroEntryId The ID of the pomodoro entry.
 * @param entryUpdates The partial pomodoro entry object with updates.
 * @returns Promise<PomodoroEntry> The updated pomodoro entry.
 * @throws Error if the API request fails.
 */
export const patchPomodoroEntry = async (
  jwt: string,
  pomodoroId: string,
  pomodoroEntryId: string,
  entryUpdates: Partial<PomodoroEntry>
): Promise<PomodoroEntry> => {
  if (!jwt || !pomodoroId || !pomodoroEntryId || !entryUpdates) {
    throw new Error("patchPomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entryUpdates");
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros/${pomodoroId}/entries/${pomodoroEntryId}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(entryUpdates),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to patch pomodoro entry ${pomodoroEntryId} (${res.status}): ${body}`);
  }

  const json = await res.json();
  return pomodoroEntryFactory(json);
};
