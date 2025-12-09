import { useMutation, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import getApiBase from "@/utils/get-api-base";


const query = async (user: Partial<User> & { id: string }, jwt?: string): Promise<User> => {
  if (!user || !user.id) throw new Error("updateUser requires a user with an id");

  const API_BASE = getApiBase();
  const url = `${API_BASE.replace(/\/$/, "")}/users/${encodeURIComponent(user.id)}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  // The payload should only include updatable fields.
  const payload: Partial<User> = {
    ...(user.name !== undefined ? { name: user.name } : {}),
    ...(user.startOfWeek !== undefined ? { startOfWeek: user.startOfWeek } : {}),
    ...(user.defaultView !== undefined ? { defaultView: user.defaultView } : {}),
    // an updated timestamp should be provided by the caller or added here
    updated: new Date().toISOString(),
  };

  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update user (${res.status}): ${body}`);
  }

  const json = await res.json();
  return json as User;
};

// React Query hook wrapper around the network query above.
// Usage: const mutation = updateUser(options);
//        await mutation.mutateAsync({ user: { id, name, ... }, jwt });

type Variables = { user: Partial<User> & { id: string }; jwt?: string };

const updateUser = (
  options?: UseMutationOptions<User, Error, Variables>
): UseMutationResult<User, Error, Variables> => {
  return useMutation<User, Error, Variables>(
    async (vars: Variables) => {
      return await query(vars.user, vars.jwt);
    },
    options
  );
};


export default updateUser;