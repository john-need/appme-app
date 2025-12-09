import getApiBase from "@/utils/get-api-base";

// network query that POSTs an activity and returns the created Activity
const query = async (activity: Partial<Activity>, jwt?: string): Promise<Activity> => {
  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/activities`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(activity),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to add activity (${res.status}): ${body}`);
  }

  const json = await res.json();
  return json as Activity;
};
 export default query;