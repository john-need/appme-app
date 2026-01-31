import getApiBase from "@/utils/get-api-base";
import todoFactory from "@/factories/todo-factory";

/**
 * Updates a specific todo.
 * @param jwt The JSON Web Token for authentication.
 * @param todoId The ID of the todo.
 * @param todo The todo object with updates.
 * @returns Promise<ToDo> The updated todo.
 * @throws Error if the API request fails.
 */
export const updateTodo = async (
  jwt: string,
  todoId: string,
  todo: ToDo
): Promise<ToDo> => {
  if (!jwt || !todoId || !todo) {
    throw new Error("updateTodo requires jwt, todoId, and todo");
  }

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/todos/${encodeURIComponent(todoId)}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(todo),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update todo ${todoId} (${res.status}): ${body}`);
  }

  const json = await res.json();
  return todoFactory(json);
};

export default updateTodo;
