import userFactory from "../factories/user-factory";
import getApiBase from  "@/utils/get-api-base";

const API_BASE = getApiBase();

const fetchUser = async (jwt: string, userId: string): Promise<User | null> => {

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const url = `${API_BASE.replace(/\/$/, "")}/users/${encodeURIComponent(userId)}`;
  const res = await fetch(url, { method: "GET", headers });

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch user (${res.status}): ${body}`);
  }

  const json = await res.json();
  // JSON is untyped at run-time; cast from unknown into the factory input shape without using `any`
  return userFactory(json as unknown as Partial<User>);
};

export default fetchUser;
