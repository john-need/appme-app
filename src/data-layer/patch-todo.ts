import getApiBase from "@/utils/get-api-base";
import todoFactory from "@/factories/todo-factory";

const patchTodo = async (todo: Partial<ToDo> & { id: string }, jwt?: string): Promise<ToDo> => {
  if (!todo || !todo.id) throw new Error("patchTodo requires a todo with an id");

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/todos/${encodeURIComponent(todo.id)}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  // build payload only with updatable fields
  const payload: Partial<ToDo> = {};
  for (const k of Object.keys(todo) as Array<keyof ToDo>) {
    if (k === "id" || k === "created") continue;
    const val = todo[k];
    if (val !== undefined) (payload as Record<string, unknown>)[k as string] = val as unknown;
  }
  payload.updated = new Date().toISOString();

  const res = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to patch todo (${res.status}): ${body}`);
  }
  const json = await res.json();
  return todoFactory(json);
};

export default patchTodo;
