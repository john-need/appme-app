import getApiBase from "@/utils/get-api-base";

/**
 * Deletes a specific pomodoro entry.
 * @param jwt The JSON Web Token for authentication.
 * @param pomodoroId The ID of the pomodoro.
 * @param pomodoroEntryId The ID of the pomodoro entry.
 * @returns Promise<void>
 * @throws Error if the API request fails.
 */
export const deletePomodoroEntry = async (
  jwt: string,
  pomodoroId: string,
  pomodoroEntryId: string
): Promise<void> => {
  if (!pomodoroId || !pomodoroEntryId || !jwt) {
    throw new Error("deletePomodoroEntry requires pomodoroId, pomodoroEntryId and jwt");
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros/${pomodoroId}/entries/${pomodoroEntryId}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const res = await fetch(url, { method: "DELETE", headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to delete pomodoro entry ${pomodoroEntryId} (${res.status}): ${body}`);
  }
};
