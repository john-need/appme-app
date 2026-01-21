import getApiBase from "@/utils/get-api-base";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";

/**
 * Adds a new pomodoro entry.
 * @param pomodoroId The ID of the pomodoro to add the entry to.
 * @param entry The partial pomodoro entry object to be created.
 * @param jwt The JSON Web Token for authentication.
 * @returns Promise<PomodoroEntry> The created pomodoro entry.
 * @throws Error if the API request fails.
 */
export const addPomodoroEntry = async (pomodoroId: string, entry: Partial<PomodoroEntry>, jwt: string): Promise<PomodoroEntry> => {
  if (!pomodoroId || !entry || !jwt) {
    throw new Error("addPomodoroEntry requires a pomodoroId, a pomodoro entry object and a jwt");
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros/${pomodoroId}/entries`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(entry),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to add pomodoro entry (${res.status}): ${body}`);
  }

  const json = await res.json();
  return pomodoroEntryFactory(json);
};
