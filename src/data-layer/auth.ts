import fetchUser from "./fetch-user";

function getApiBase(): string {
  // try to access import.meta.env via a dynamic function to avoid parse-time import.meta token
  try {
    // probe import.meta safely without using `any`
    // @ts-expect-error -- runtime probe; bundlers may transform import.meta at build time
    const meta = (new Function('return typeof import.meta !== "undefined" ? import.meta : undefined') as unknown)();
    let env: Record<string, unknown> | undefined;
    if (meta && typeof meta === "object" && meta !== null && "env" in meta) {
      const metaObj = meta as { env?: unknown };
      if (metaObj.env && typeof metaObj.env === "object" && metaObj.env !== null) {
        env = metaObj.env as Record<string, unknown>;
      }
    }
    if (env && typeof env.VITE_API_BASE_URL === "string" && env.VITE_API_BASE_URL) {
      return env.VITE_API_BASE_URL;
    }
  } catch (e) {
    // ignore
  }
  try {
    const proc = typeof process !== "undefined" ? (process as unknown as { env?: Record<string, unknown> }).env : undefined;
    if (proc) {
      return (proc.REACT_APP_API_BASE_URL as string) || (proc.API_BASE_URL as string) || "http://localhost:3000";
    }
  } catch (e) {
    // ignore
  }
  // fallback to globalThis variables (if an app injected them)
  try {
    const g = globalThis as unknown as Record<string, unknown>;
    if (typeof g?.VITE_API_BASE_URL === "string") return g.VITE_API_BASE_URL as string;
    if (typeof g?.REACT_APP_API_BASE_URL === "string") return g.REACT_APP_API_BASE_URL as string;
  } catch (e) {
    // ignore
  }
  return "http://localhost:3000";
}

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

  const user = await fetchUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return { token, user };
};

export default auth;
