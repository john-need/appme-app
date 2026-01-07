import toIso from "@/utils/to-iso";

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe("toIso utility", () => {
  it("returns an ISO string if input is a string", () => {
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
    expect(new Date(out).getTime()).toBeCloseTo(now, -1);
  });

  it("returns an ISO string for undefined (current time)", () => {
    const out = toIso(undefined);
    expect(typeof out).toBe("string");
    expect(isoRegex.test(out)).toBe(true);
  });

  it("returns an ISO string for null and Date objects", () => {
    const outNull = toIso(null as unknown as string | number | Date | undefined);
    expect(typeof outNull).toBe("string");
    expect(isoRegex.test(outNull)).toBe(true);

    const d = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 123));
    const outDate = toIso(d);
    expect(outDate).toBe(d.toISOString());
    expect(isoRegex.test(outDate)).toBe(true);
  });

  it("converts local Date objects to UTC ISO strings", () => {
    // This date is Jan 1st 2000, 00:00:00 in LOCAL time
    const localDate = new Date(2000, 0, 1, 0, 0, 0);
    const out = toIso(localDate);
    
    expect(out).toBe(localDate.toISOString());
    expect(out.endsWith("Z")).toBe(true);
    
    // If we are in UTC+1, local 00:00 is 23:00 previous day UTC
    // istoISOString() handles this conversion.
  });

  it("converts local date strings without timezone to UTC", () => {
    // "2023-01-01 10:00:00" is usually parsed as local time by new Date()
    const localStr = "2023-01-01 10:00:00";
    const out = toIso(localStr);
    
    const expected = new Date(localStr).toISOString();
    expect(out).toBe(expected);
    expect(out.endsWith("Z")).toBe(true);
  });

  it("handles zero epoch correctly", () => {
    const out = toIso(0);
    expect(out).toBe(new Date(0).toISOString());
    expect(isoRegex.test(out)).toBe(true);
  });
});
