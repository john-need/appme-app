import getApiBase from "@/utils/get-api-base";
import todoFactory from "@/factories/todo-factory";

const fetchTodos = async (jwt: string): Promise<ToDo[]> => {
  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/todos`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, { method: "GET", headers });

  if (res.status === 404) return [];
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch todos (${res.status}): ${body}`);
  }

  const json = await res.json();

  if (!Array.isArray(json)) throw new Error("Invalid todos response: expected an array");
  return json.map((item) => todoFactory(item));
};

export default fetchTodos;
