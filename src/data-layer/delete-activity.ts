import getApiBase from "@/utils/get-api-base";
import { store } from "@/store/root-store";


const deleteActivity = async (id: string, jwt?: string): Promise<boolean> => {
  if (!id || !jwt) return false;


  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/activities/${encodeURIComponent(id)}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
   headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, { method: "DELETE", headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to delete activity (${res.status}): ${body}`);
  }

  return true;
};

export default deleteActivity;