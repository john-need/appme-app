import getApiBase from "@/utils/get-api-base";

const patchTimeEntry = async (entry: Partial<TimeEntry> & { id: string }, jwt?: string): Promise<TimeEntry> => {
  if (!entry || !entry.id) throw new Error("patchTimeEntry requires an entry with an id");

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/time-entries/${encodeURIComponent(entry.id)}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  // build payload only with updatable fields
  const payload: Partial<TimeEntry> = {};
  for (const k of Object.keys(entry) as Array<keyof TimeEntry>) {
    if (k === "id" || k === "created") continue;
    const val = entry[k];
    if (val !== undefined) (payload as Record<string, unknown>)[k as string] = val as unknown;
  }
  payload.updated = new Date().toISOString();

  const res = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to patch time entry (${res.status}): ${body}`);
  }
  const json = await res.json();
  return json as TimeEntry;
};

export default patchTimeEntry;
