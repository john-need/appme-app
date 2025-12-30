import getApiBase from "@/utils/get-api-base";

const query = async (jwt: string): Promise<TimeEntry[]> => {
  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/time-entries`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, { method: "GET", headers });

  if (res.status === 404) return [];
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch time entries (${res.status}): ${body}`);
  }

  const json = await res.json();

  if (!Array.isArray(json)) throw new Error("Invalid time entries response: expected an array");
  return json as TimeEntry[];
};

export default query;

