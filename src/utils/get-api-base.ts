function getApiBase(): string {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
    try {
        const g = globalThis as unknown as Record<string, unknown>;
        if (typeof g?.VITE_API_BASE_URL === "string") return g.VITE_API_BASE_URL as string;
        if (typeof g?.REACT_APP_API_BASE_URL === "string") return g.REACT_APP_API_BASE_URL as string;
    } catch (e) {
        // ignore
    }
    return "http://localhost:3000";
}

export default getApiBase;
