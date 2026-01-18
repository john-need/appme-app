import getApiBase from "@/utils/get-api-base";
import pomodoroFactory from "@/factories/pomodoro-factory";

/**
 * Patches a pomodoro if it is owned by the user.
 * @param pomodoro The pomodoro object with updates (must include id).
 * @param user The current user object.
 * @param jwt The JSON Web Token for authentication.
 * @returns Promise<Pomodoro | null> The updated pomodoro, or null if ownership check fails.
 * @throws Error if the API request fails.
 */
export const patchPomodoro = async (
  pomodoro: Partial<Pomodoro> & { id: string },
  user: User,
  jwt: string
): Promise<Pomodoro | null> => {
  if (!pomodoro || !pomodoro.id || !user || !user.id || !jwt) {
    throw new Error("patchPomodoro requires a pomodoro with an id, a user with an id, and a jwt");
  }

  // Ownership check
  // Note: pomodoro is Partial<Pomodoro>, so userId might not be present if not provided in the patch data.
  // However, the issue description says "if its owned by the user, pomodoro.userId === user.userId".
  // Usually, for a PATCH, we might need the original pomodoro or trust the caller provides the userId if we want to check here.
  // If pomodoro.userId is present in the partial object, we check it.
  if (pomodoro.userId && pomodoro.userId !== user.id) {
    return null;
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros/${encodeURIComponent(pomodoro.id)}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  // Build payload with only defined updatable fields (exclude id and created)
  const payload: Partial<Pomodoro> & { updated?: string } = {};
  for (const key of Object.keys(pomodoro) as Array<keyof Pomodoro>) {
    if (key === "id" || key === "created") continue;
    const val = pomodoro[key];
    if (val !== undefined) (payload as Record<string, unknown>)[key] = val;
  }

  // set an updated timestamp
  payload.updated = new Date().toISOString();

  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to patch pomodoro (${res.status}): ${body}`);
  }

  const json = await res.json();
  return pomodoroFactory(json);
};
