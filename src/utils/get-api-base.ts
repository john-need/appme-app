function getApiBase(): string {
  // Try VITE_ prefix (Vite standard)
  try {
    interface ImportMetaEnv {
      env?: {
        VITE_API_BASE_URL?: string;
      };
    }
    const meta = (new Function('return typeof import.meta !== "undefined" ? import.meta : undefined')() as ImportMetaEnv | undefined);
    if (meta && meta.env && meta.env.VITE_API_BASE_URL) {
      return meta.env.VITE_API_BASE_URL;
    }
  } catch (e) {
    // ignore
  }

  // Try process.env (Node/Jest standard)
  try {
    if (typeof process !== "undefined" && process.env) {
      return (
        (process.env.REACT_APP_API_BASE_URL as string) ||
        (process.env.API_BASE_URL as string) ||
        "http://localhost:3000"
      );
    }
  } catch (e) {
    // ignore
  }

  // Fallback to globalThis
  try {
    const g = globalThis as unknown as Record<string, unknown>;
    if (typeof g?.VITE_API_BASE_URL === "string") return g.VITE_API_BASE_URL;
    if (typeof g?.REACT_APP_API_BASE_URL === "string") return g.REACT_APP_API_BASE_URL;
  } catch (e) {
    // ignore
  }

  return "http://localhost:3000";
}

export default getApiBase;
