import getApiBase from "@/utils/get-api-base";
import pomodoroFactory from "@/factories/pomodoro-factory";

/**
 * Adds a new pomodoro.
 * @param pomodoro The partial pomodoro object to be created.
 * @param jwt The JSON Web Token for authentication.
 * @returns Promise<Pomodoro> The created pomodoro.
 * @throws Error if the API request fails.
 */
export const addPomodoro = async (pomodoro: Partial<Pomodoro>, jwt: string): Promise<Pomodoro> => {
  if (!pomodoro || !jwt) {
    throw new Error("addPomodoro requires a pomodoro object and a jwt");
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(pomodoro),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to add pomodoro (${res.status}): ${body}`);
  }

  const json = await res.json();
  return pomodoroFactory(json);
};
