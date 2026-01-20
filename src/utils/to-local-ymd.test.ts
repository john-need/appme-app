import toLocalYMD from "./to-local-ymd";

describe("toLocalYMD", () => {
  it("should return an empty string for undefined input", () => {
    expect(toLocalYMD(undefined)).toBe("");
  });

  it("should convert a Date object to EST YYYY-MM-DD format", () => {
    // Create a date object for a specific UTC time
    const date = new Date("2026-01-20T08:38:16.728Z");

    // Expected result: 2026-01-19 (because 08:38 UTC is 03:38 EST, which is the previous day)
    expect(toLocalYMD(date)).toBe("2026-01-19");
  });

  it("should convert an ISO string to EST YYYY-MM-DD format", () => {
    // Expected result: 2026-01-19 (because 08:38 UTC is 03:38 EST, which is the previous day)
    expect(toLocalYMD("2026-01-20T08:38:16.728Z")).toBe("2026-01-19");
  });

  it("should handle date at UTC midnight correctly", () => {
    // UTC midnight is 19:00 EST the previous day
    expect(toLocalYMD("2026-01-20T00:00:00.000Z")).toBe("2026-01-19");
  });

  it("should handle date at EST midnight correctly", () => {
    // EST midnight is 05:00 UTC
    expect(toLocalYMD("2026-01-20T05:00:00.000Z")).toBe("2026-01-20");
  });
});
