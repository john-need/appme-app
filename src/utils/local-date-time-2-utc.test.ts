import localDateTime2UTC from "./local-date-time-2-utc";

describe("localDateTime2UTC utility", () => {
  it("converts a Date object to an ISO UTC string", () => {
    const date = new Date("2023-10-25T14:30:00Z");
    const result = localDateTime2UTC(date);
    expect(result).toBe("2023-10-25T14:30:00.000Z");
  });

  it("converts a date-time string to an ISO UTC string", () => {
    const dateString = "2023-10-25T14:30:00Z";
    const result = localDateTime2UTC(dateString);
    expect(result).toBe("2023-10-25T14:30:00.000Z");
  });

  it("returns an empty string for an invalid Date object", () => {
    const invalidDate = new Date("invalid-date");
    const result = localDateTime2UTC(invalidDate);
    expect(result).toBe("");
  });

  it("returns an empty string for an invalid date-time string", () => {
    const invalidString = "not-a-date";
    const result = localDateTime2UTC(invalidString);
    expect(result).toBe("");
  });

  it("returns an empty string for an empty string input", () => {
    const result = localDateTime2UTC("");
    expect(result).toBe("");
  });

  it("handles different local date-time string formats (e.g., YYYY-MM-DD)", () => {
    const dateString = "2023-10-25";
    const result = localDateTime2UTC(dateString);
    // Note: Behavior of new Date("YYYY-MM-DD") can be TZ-dependent, but toISOString() will always be UTC.
    // Usually "2023-10-25" is parsed as 2023-10-25T00:00:00Z.
    expect(result).toBe(new Date("2023-10-25").toISOString());
  });
});
