import getApiBase from "@/utils/get-api-base";

// network query that POSTs a TimeEntry and returns the created TimeEntry
const addTimeEntry = async (timeEntry: Partial<TimeEntry>, jwt?: string): Promise<TimeEntry> => {
  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/time-entries`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(timeEntry),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to add time entry (${res.status}): ${body}`);
  }

  const json = await res.json();
  return json as TimeEntry;
};
export default addTimeEntry;