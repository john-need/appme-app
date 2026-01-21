import getApiBase from "@/utils/get-api-base";
import pomodoroFactory from "@/factories/pomodoro-factory";

export const fetchPomodoros = async (jwt: string): Promise<Pomodoro[]> => {
  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, { method: "GET", headers });

  if (res.status === 404) return [];
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch pomodoros (${res.status}): ${body}`);
  }

  const json = await res.json();
  if (!Array.isArray(json)) {
    throw new Error("Invalid pomodoros response: expected an array");
  }
  return json.map(pomodoroFactory);
};

export const fetchPomodoroById = async (jwt: string, id: string): Promise<Pomodoro | null> => {
  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros/${id}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, { method: "GET", headers });

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch pomodoro ${id} (${res.status}): ${body}`);
  }

  const json = await res.json();
  return pomodoroFactory(json);
};