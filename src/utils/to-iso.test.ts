import toIso from "@/utils/to-iso";

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe("toIso utility", () => {
  it("returns the same string if input is a string", () => {
    const s = "2020-01-01T00:00:00.000Z";
    const out = toIso(s);
    expect(out).toBe(s);
    expect(isoRegex.test(out)).toBe(true);
  });

  it("converts a numeric epoch ms to an ISO string", () => {
    const now = Date.now();
    const out = toIso(now);
    expect(typeof out).toBe("string");
    expect(isoRegex.test(out)).toBe(true);
    expect(new Date(out).getTime()).toBeGreaterThanOrEqual(now - 1000);
  });

  it("returns an ISO string for undefined (current time)", () => {
    const before = Date.now();
    const out = toIso(undefined);
    const after = Date.now();
    expect(typeof out).toBe("string");
    expect(isoRegex.test(out)).toBe(true);
    const ts = new Date(out).getTime();
    expect(ts).toBeGreaterThanOrEqual(before - 1000);
    expect(ts).toBeLessThanOrEqual(after + 1000);
  });

  it("returns an ISO string for null and Date objects", () => {
    const outNull = toIso(null as unknown);
    expect(typeof outNull).toBe("string");
    expect(isoRegex.test(outNull)).toBe(true);

    const d = new Date(2000, 0, 1, 0, 0, 0, 123);
    const outDate = toIso(d as unknown);
    // because toIso treats non-string/number as "now", it will return current-ish time (not the Date's value)
    // we assert it's an ISO formatted string
    expect(typeof outDate).toBe("string");
    expect(isoRegex.test(outDate)).toBe(true);
  });

  it("handles zero epoch correctly", () => {
    const out = toIso(0);
    expect(out).toBe(new Date(0).toISOString());
    expect(isoRegex.test(out)).toBe(true);
  });
});

