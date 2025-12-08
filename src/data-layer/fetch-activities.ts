import getApiBase from  "@/utils/get-api-base";

const fetchActivities = async (jwt: string): Promise<Activity[]> => {


  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/activities`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, { method: "GET", headers });

  if (res.status === 404) return [];
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch activities (${res.status}): ${body}`);
  }

  const json = await res.json();
  if (!Array.isArray(json)) {
    throw new Error("Invalid activities response: expected an array");
  }

  return json as Activity[];
};

export default fetchActivities;
