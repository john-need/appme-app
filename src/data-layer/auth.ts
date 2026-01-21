import fetchUser from "./fetch-user";
import getApiBase from "@/utils/get-api-base";

const API_BASE = getApiBase();

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if necessary
    const pad = base64.length % 4;
    const padded = base64 + (pad === 2 ? "==" : pad === 3 ? "=" : pad === 0 ? "" : "");
    const json = typeof atob === "function"
      ? atob(padded)
      : Buffer.from(padded, "base64").toString("utf8");
    const parsed = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null ? parsed as Record<string, unknown> : null;
  } catch (err) {
    return null;
  }
}

const auth = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const url = `${API_BASE.replace(/\/$/, "")}/auth`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Authentication failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const token = typeof data === "string" ? data : data.token || data.jwt || data.accessToken;
  if (typeof token !== "string") {
    throw new Error("Authentication response did not contain a token");
  }

  const claims = parseJwtPayload(token);
  const userId = claims && (claims.id || claims.sub);
  if (!userId || typeof userId !== "string") {
    throw new Error("Token does not contain a user id claim");
  }

  const user = await fetchUser(token, userId);
  if (!user) {
    throw new Error("User not found");
  }

  return { token, user };
};

export default auth;
