import getApiBase from "@/utils/get-api-base";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";

/**
 * Updates a specific pomodoro entry.
 * @param jwt The JSON Web Token for authentication.
 * @param pomodoroId The ID of the pomodoro.
 * @param pomodoroEntryId The ID of the pomodoro entry.
 * @param entry The pomodoro entry object with updates.
 * @returns Promise<PomodoroEntry> The updated pomodoro entry.
 * @throws Error if the API request fails.
 */
export const updatePomodoroEntry = async (
  jwt: string,
  pomodoroId: string,
  pomodoroEntryId: string,
  entry: PomodoroEntry
): Promise<PomodoroEntry> => {
  if (!jwt || !pomodoroId || !pomodoroEntryId || !entry) {
    throw new Error("updatePomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entry");
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros/${pomodoroId}/entries/${pomodoroEntryId}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(entry),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update pomodoro entry ${pomodoroEntryId} (${res.status}): ${body}`);
  }

  const json = await res.json();
  return pomodoroEntryFactory(json);
};
