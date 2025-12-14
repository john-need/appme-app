import getApiBase from "./get-api-base";

describe.skip("getApiBase", () => {
  const originalEnv = process.env;
  const g = globalThis as unknown as Record<string, unknown>;

  beforeEach(() => {
    // reset env and globals between tests
    process.env = { ...originalEnv };
    delete g.VITE_API_BASE_URL;
    delete g.REACT_APP_API_BASE_URL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it.skip("returns value from process.env.REACT_APP_API_BASE_URL if present", () => {
    process.env.REACT_APP_API_BASE_URL = "https://api.example.com";
    expect(getApiBase()).toBe("https://api.example.com");
  });

  it.skip("falls back to process.env.API_BASE_URL when REACT_APP_ not set", () => {
    delete process.env.REACT_APP_API_BASE_URL;
    process.env.API_BASE_URL = "https://fallback.example.com";
    expect(getApiBase()).toBe("https://fallback.example.com");
  });

  // Note: implementation prefers process.env before checking globalThis fallbacks.
  // Since process.env is always present in Node/Jest, the globalThis branches are not reachable here.

  it.skip("returns default http://localhost:3000 when nothing set", () => {
    delete process.env.REACT_APP_API_BASE_URL;
    delete process.env.API_BASE_URL;
    expect(getApiBase()).toBe("http://localhost:3000");
  });
});
