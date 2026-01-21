import getApiBase from "@/utils/get-api-base";

/**
 * Deletes a pomodoro if it is owned by the user.
 * @param pomodoro The pomodoro object to delete.
 * @param user The current user object.
 * @param jwt The JSON Web Token for authentication.
 * @returns Promise<boolean> True if deleted, false if ownership check fails.
 * @throws Error if the API request fails.
 */
export const deletePomodoro = async (
  pomodoro: Pomodoro,
  user: User,
  jwt: string
): Promise<boolean> => {
  if (!pomodoro?.id || !user?.id || !jwt) {
    return false;
  }

  // Ownership check
  if (pomodoro.userId !== user.id) {
    return false;
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/pomodoros/${encodeURIComponent(pomodoro.id)}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const res = await fetch(url, { method: "DELETE", headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to delete pomodoro (${res.status}): ${body}`);
  }

  return true;
};
