function getApiBase(): string {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const meta = (new Function('return typeof import.meta !== "undefined" ? import.meta : undefined') as any)();
        const env = meta?.env;
        if (env && typeof env.VITE_API_BASE_URL === "string" && env.VITE_API_BASE_URL) {
            return env.VITE_API_BASE_URL;
        }
    } catch (e) {
        // ignore
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const proc = typeof process !== "undefined" ? (process as any).env : undefined;
        if (proc) {
            return (proc.REACT_APP_API_BASE_URL as string) || (proc.API_BASE_URL as string) || "http://localhost:3000";
        }
    } catch (e) {
        // ignore
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const g = globalThis as any;
        if (g?.VITE_API_BASE_URL) return g.VITE_API_BASE_URL;
        if (g?.REACT_APP_API_BASE_URL) return g.REACT_APP_API_BASE_URL;
    } catch (e) {
        // ignore
    }
    return "http://localhost:3000";
}

export default getApiBase;
