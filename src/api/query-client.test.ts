import { queryClient } from "./query-client";

describe("queryClient defaults", () => {
  it("has query default retry set to 1", () => {
    const defaultOptions = (queryClient as unknown as { defaultOptions?: unknown }).defaultOptions;
    const queries = defaultOptions && typeof defaultOptions === "object" ? (defaultOptions as Record<string, unknown>)["queries"] as Record<string, unknown> | undefined : undefined;
    expect(queries).toBeDefined();
    expect(queries?.["retry"]).toBe(1);
  });

  it("has staleTime of 1 minute", () => {
    const defaultOptions = (queryClient as unknown as { defaultOptions?: unknown }).defaultOptions;
    const queries = defaultOptions && typeof defaultOptions === "object" ? (defaultOptions as Record<string, unknown>)["queries"] as Record<string, unknown> | undefined : undefined;
    expect(queries?.["staleTime"]).toBe(1000 * 60);
  });

  it("has refetchOnWindowFocus disabled", () => {
    const defaultOptions = (queryClient as unknown as { defaultOptions?: unknown }).defaultOptions;
    const queries = defaultOptions && typeof defaultOptions === "object" ? (defaultOptions as Record<string, unknown>)["queries"] as Record<string, unknown> | undefined : undefined;
    expect(queries?.["refetchOnWindowFocus"]).toBe(false);
  });
});
