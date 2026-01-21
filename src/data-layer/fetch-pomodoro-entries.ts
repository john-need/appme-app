import getApiBase from "@/utils/get-api-base";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";

/**
 * Fetches all entries for a specific pomodoro.
 * @param jwt The JSON Web Token for authentication.
 * @param pomodoroId The ID of the pomodoro.
 * @returns Promise<PomodoroEntry[]> The list of pomodoro entries.
 */
export const fetchPomodoroEntries = async (jwt: string, pomodoroId: string): Promise<PomodoroEntry[]> => {
  if (!pomodoroId) {
    throw new Error("fetchPomodoroEntries requires a pomodoroId");
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros/${pomodoroId}/entries`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, { method: "GET", headers });

  if (res.status === 404) return [];
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch pomodoro entries (${res.status}): ${body}`);
  }

  const json = await res.json();
  if (!Array.isArray(json)) {
    throw new Error("Invalid pomodoro entries response: expected an array");
  }
  return json.map(pomodoroEntryFactory);
};

/**
 * Fetches a specific pomodoro entry by ID.
 * @param jwt The JSON Web Token for authentication.
 * @param pomodoroId The ID of the pomodoro.
 * @param pomodoroEntryId The ID of the pomodoro entry.
 * @returns Promise<PomodoroEntry | null> The pomodoro entry or null if not found.
 */
export const fetchPomodoroEntryById = async (
  jwt: string,
  pomodoroId: string,
  pomodoroEntryId: string
): Promise<PomodoroEntry | null> => {
  if (!pomodoroId || !pomodoroEntryId) {
    throw new Error("fetchPomodoroEntryById requires pomodoroId and pomodoroEntryId");
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros/${pomodoroId}/entries/${pomodoroEntryId}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, { method: "GET", headers });

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch pomodoro entry ${pomodoroEntryId} (${res.status}): ${body}`);
  }

  const json = await res.json();
  return pomodoroEntryFactory(json);
};
