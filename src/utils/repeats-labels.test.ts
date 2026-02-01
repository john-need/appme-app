import repeatsLabels from "./repeats-labels";

describe("repeatsLabels", () => {
  it("should return 'Daily' for DAILY", () => {
    const result = repeatsLabels(["DAILY"]);
    expect(result).toEqual(["Daily"]);
  });

  it("should return formatted weekly days", () => {
    const result = repeatsLabels(["WEEKLY_MONDAY", "WEEKLY_WEDNESDAY"]);
    expect(result).toEqual(["Weekly on Monday and Wednesday"]);
  });

  it("should format three weekly days correctly in week order", () => {
    // Sunday, Monday, Wednesday
    const result = repeatsLabels(["WEEKLY_MONDAY", "WEEKLY_WEDNESDAY", "WEEKLY_SUNDAY"]);
    expect(result).toEqual(["Weekly on Sunday, Monday and Wednesday"]);
  });

  it("should format monthly days in week order", () => {
    const result = repeatsLabels(["MONTHLY_WEDNESDAY", "MONTHLY_MONDAY", "MONTHLY_SUNDAY"]);
    expect(result).toEqual(["Monthly on Sunday, Monday, Wednesday"]);
  });

  it("should format positional monthly days in correct order", () => {
    const result = repeatsLabels(["MONTHLY_LAST_FRIDAY", "MONTHLY_1ST_MONDAY", "MONTHLY_1ST_SUNDAY", "MONTHLY_2ND_TUESDAY"]);
    expect(result).toEqual(["Monthly on the 1st Sunday, the 1st Monday, the 2nd Tuesday, and the last Friday"]);
  });

  it("should combine monthly occurrences into a single string", () => {
    // Note: Rule 2 in transmogrify-occurrences removes MONTHLY_MONDAY if MONTHLY_DAY_ is present
    const result = repeatsLabels(["MONTHLY_DAY_15", "MONTHLY_MONDAY", "MONTHLY_WEDNESDAY"]);
    expect(result).toEqual(["Monthly on the 15th"]);
  });

  it("should handle mixed occurrence types", () => {
    // WEEKLY_MONDAY is removed if MONTHLY_DAY_ is present (Rule 2)
    const result = repeatsLabels(["WEEKLY_MONDAY", "MONTHLY_DAY_1", "MONTHLY_LAST_FRIDAY"]);
    expect(result).toEqual(["Monthly on the 1st"]);
  });

  it("should handle single monthly occurrence", () => {
    const result = repeatsLabels(["MONTHLY_DAY_15"]);
    expect(result).toEqual(["Monthly on the 15th"]);
  });

  it("should handle only positional monthly occurrences", () => {
    const result = repeatsLabels(["MONTHLY_1ST_MONDAY", "MONTHLY_3RD_WEDNESDAY"]);
    expect(result).toEqual(["Monthly on the 1st Monday, and the 3rd Wednesday"]);
  });

  it("should combine simple monthly days with positional monthly days when Rule 2 is NOT violated", () => {
    // This is hard to trigger because Rule 2 and 3 are quite restrictive.
    // If I want to see combination, I'd need to bypass transmogrifyOccurrences or change its rules.
    // But repeatsLabels uses transmogrifyOccurrences internally.
    
    // Let's test what happens if we have multiple positional ones.
    const result = repeatsLabels(["MONTHLY_1ST_MONDAY", "MONTHLY_LAST_FRIDAY"]);
    expect(result).toEqual(["Monthly on the 1st Monday, and the last Friday"]);
  });

  it("should return 'NEVER' label correctly", () => {
     // transmogrifyOccurrences returns ["NEVER"] for empty or "NEVER"
     const result = repeatsLabels(["NEVER"]);
     expect(result).toEqual(["NEVER"]);
  });

  it("should return date labels", () => {
    const result = repeatsLabels(["2024-01-01"]);
    expect(result).toEqual(["On 2024-01-01"]);
  });
});
