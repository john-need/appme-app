import getApiBase from "@/utils/get-api-base";
import toDoFactory from "@/factories/to-do-factory";

// network query that POSTs a ToDo and returns the created ToDo
const addTodo = async (todo: Partial<ToDo>, jwt?: string): Promise<ToDo> => {
  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/todos`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(todo),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to add todo (${res.status}): ${body}`);
  }

  const json = await res.json();
  return toDoFactory(json);
};
export default addTodo;
