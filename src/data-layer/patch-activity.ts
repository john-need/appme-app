import getApiBase from "@/utils/get-api-base";

const patchActivity = async (activity: Partial<Activity> & { id: string }, jwt?: string): Promise<Activity> => {
  if (!activity || !activity.id) throw new Error("patchActivity requires an activity with an id");

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/activities/${encodeURIComponent(activity.id)}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  // Build payload with only defined updatable fields (exclude id and created)
  const payload: Partial<Activity> = {};
  for (const key of Object.keys(activity) as Array<keyof Activity>) {
    if (key === "id" || key === "created") continue;
    const val = activity[key];
    if (val !== undefined) payload[key] = val as any;
  }

  // set an updated timestamp
  payload.updated = new Date().toISOString();

  const res = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(payload) });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to patch activity (${res.status}): ${body}`);
  }

  const json = await res.json();
  return json as Activity;
};

export default patchActivity;