import getApiBase from "@/utils/get-api-base";

const deleteTodo = async (id: string, jwt?: string): Promise<boolean> => {
  if (!id) throw new Error("deleteTodo requires an id");
  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/todos/${encodeURIComponent(id)}`;
  const headers: Record<string, string> = {};
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, { method: "DELETE", headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to delete todo (${res.status}): ${body}`);
  }
  return true;
};

export default deleteTodo;
