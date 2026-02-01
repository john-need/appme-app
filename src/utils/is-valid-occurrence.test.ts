import isValidOccurrence from "./is-valid-occurrence";

describe("isValidOccurrence", () => {
  it("should return false for non-string inputs", () => {
    expect(isValidOccurrence(null)).toBe(false);
    expect(isValidOccurrence(undefined)).toBe(false);
    expect(isValidOccurrence(123)).toBe(false);
    expect(isValidOccurrence({})).toBe(false);
  });

  it("should return true for valid YYYY-MM-DD dates", () => {
    expect(isValidOccurrence("2024-01-01")).toBe(true);
    expect(isValidOccurrence("2023-12-31")).toBe(true);
  });

  it("should return false for invalid dates", () => {
    expect(isValidOccurrence("24-01-01")).toBe(false);
    expect(isValidOccurrence("2024-1-1")).toBe(false);
    expect(isValidOccurrence("not-a-date")).toBe(false);
  });

  it("should return true for 'NEVER', 'DAILY', and 'YEARLY'", () => {
    expect(isValidOccurrence("NEVER")).toBe(true);
    expect(isValidOccurrence("DAILY")).toBe(true);
    expect(isValidOccurrence("YEARLY")).toBe(true);
  });

  it("should return true for valid WEEKLY occurrences", () => {
    expect(isValidOccurrence("WEEKLY_MONDAY")).toBe(true);
    expect(isValidOccurrence("WEEKLY_SUNDAY")).toBe(true);
    expect(isValidOccurrence("WEEKLY_SATURDAY")).toBe(true);
  });

  it("should return false for invalid WEEKLY occurrences", () => {
    expect(isValidOccurrence("WEEKLY")).toBe(false);
    expect(isValidOccurrence("WEEKLY_")).toBe(false);
    expect(isValidOccurrence("WEEKLY_JANUARY")).toBe(false);
  });

  it("should return true for valid MONTHLY occurrences", () => {
    expect(isValidOccurrence("MONTHLY")).toBe(true);
    expect(isValidOccurrence("MONTHLY_MONDAY")).toBe(true);
    expect(isValidOccurrence("MONTHLY_1ST_MONDAY")).toBe(true);
    expect(isValidOccurrence("MONTHLY_4TH_TUESDAY")).toBe(true);
    expect(isValidOccurrence("MONTHLY_LAST_FRIDAY")).toBe(true);
  });

  it("should return false for invalid MONTHLY occurrences", () => {
    expect(isValidOccurrence("MONTHLY_1ST")).toBe(false);
    expect(isValidOccurrence("MONTHLY_5TH_MONDAY")).toBe(false);
  });

  describe("MONTHLY_DAY_{i}", () => {
    it("should return true for valid MONTHLY_DAY_1 to MONTHLY_DAY_31", () => {
      expect(isValidOccurrence("MONTHLY_DAY_1")).toBe(true);
      expect(isValidOccurrence("MONTHLY_DAY_15")).toBe(true);
      expect(isValidOccurrence("MONTHLY_DAY_31")).toBe(true);
    });

    it("should return false for invalid MONTHLY_DAY values", () => {
      expect(isValidOccurrence("MONTHLY_DAY_0")).toBe(false);
      expect(isValidOccurrence("MONTHLY_DAY_32")).toBe(false);
      expect(isValidOccurrence("MONTHLY_DAY_A")).toBe(false);
      expect(isValidOccurrence("MONTHLY_DAY_")).toBe(false);
    });
    
    it("should handle trimming", () => {
       expect(isValidOccurrence("  MONTHLY_DAY_1  ")).toBe(true);
    });
  });
});
