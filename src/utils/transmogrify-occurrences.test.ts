import transmogrifyOccurrences from "./transmogrify-occurrences";

describe("transmogrifyOccurrences", () => {
  describe("add action", () => {
    it("should add a valid occurrence to an empty array", () => {
      const result = transmogrifyOccurrences([], "add", "DAILY");
      expect(result).toEqual(["DAILY"]);
    });

    it("should add a valid occurrence to an existing array", () => {
      const result = transmogrifyOccurrences(["WEEKLY_MONDAY"], "add", "WEEKLY_TUESDAY");
      expect(result).toEqual(["WEEKLY_MONDAY", "WEEKLY_TUESDAY"]);
    });

    it("should return ['NEVER'] when adding 'NEVER' (clearing others)", () => {
      const result = transmogrifyOccurrences(["DAILY", "WEEKLY_MONDAY"], "add", "NEVER");
      expect(result).toEqual(["NEVER"]);
    });

    it("should return ['DAILY'] when adding 'DAILY' (clearing others)", () => {
      const result = transmogrifyOccurrences(["WEEKLY_MONDAY", "2024-01-01"], "add", "DAILY");
      expect(result).toEqual(["DAILY"]);
    });

    it("should return ['NEVER'] when adding '  NEVER  ' (trimming and clearing)", () => {
      const result = transmogrifyOccurrences(["DAILY"], "add", "  NEVER  ");
      expect(result).toEqual(["NEVER"]);
    });

    it("should return ['DAILY'] when adding '  DAILY  ' (trimming and clearing)", () => {
      const result = transmogrifyOccurrences(["WEEKLY_MONDAY"], "add", "  DAILY  ");
      expect(result).toEqual(["DAILY"]);
    });

    it("should filter out invalid occurrences when adding", () => {
      const result = transmogrifyOccurrences(["DAILY"], "add", "INVALID_OCC");
      expect(result).toEqual(["DAILY"]);
    });

    it("should return ['NEVER'] if the resulting array is empty after filtering", () => {
      const result = transmogrifyOccurrences([], "add", "INVALID_OCC");
      expect(result).toEqual(["NEVER"]);
    });

    it("should make the resulting array unique", () => {
      const result = transmogrifyOccurrences(["DAILY"], "add", "DAILY");
      expect(result).toEqual(["DAILY"]);
    });

    it("should sort the resulting array", () => {
      const result = transmogrifyOccurrences(["WEEKLY_MONDAY"], "add", "WEEKLY_FRIDAY");
      expect(result).toEqual(["WEEKLY_FRIDAY", "WEEKLY_MONDAY"]);
    });

    it("should trim the occurrence before adding", () => {
      const result = transmogrifyOccurrences(["WEEKLY_MONDAY"], "add", "  WEEKLY_TUESDAY  ");
      expect(result).toEqual(["WEEKLY_MONDAY", "WEEKLY_TUESDAY"]);
    });
  });

  describe("remove action", () => {
    it("should remove an occurrence from the array", () => {
      const result = transmogrifyOccurrences(["DAILY", "WEEKLY_MONDAY"], "remove", "DAILY");
      expect(result).toEqual(["WEEKLY_MONDAY"]);
    });

    it("should return ['NEVER'] if the last occurrence is removed", () => {
      const result = transmogrifyOccurrences(["DAILY"], "remove", "DAILY");
      expect(result).toEqual(["NEVER"]);
    });

    it("should not change the array if the occurrence to remove does not exist", () => {
      const result = transmogrifyOccurrences(["DAILY"], "remove", "WEEKLY_MONDAY");
      expect(result).toEqual(["DAILY"]);
    });

    it("should trim the occurrence before removing", () => {
      const result = transmogrifyOccurrences(["DAILY", "WEEKLY_MONDAY"], "remove", "  DAILY  ");
      expect(result).toEqual(["WEEKLY_MONDAY"]);
    });
  });

  describe("vet action", () => {
    it("should clean up an array with invalid items", () => {
      const result = transmogrifyOccurrences(["WEEKLY_MONDAY", "INVALID", "WEEKLY_TUESDAY"], "vet");
      expect(result).toEqual(["WEEKLY_MONDAY", "WEEKLY_TUESDAY"]);
    });

    it("should return ['NEVER'] for an empty array", () => {
      const result = transmogrifyOccurrences([], "vet");
      expect(result).toEqual(["NEVER"]);
    });

    it("should return ['NEVER'] if only invalid items are present", () => {
      const result = transmogrifyOccurrences(["INVALID1", "INVALID2"], "vet");
      expect(result).toEqual(["NEVER"]);
    });

    it("should return ['NEVER'] if 'NEVER' is the only item", () => {
      const result = transmogrifyOccurrences(["NEVER"], "vet");
      expect(result).toEqual(["NEVER"]);
    });

    it("should remove 'NEVER' if other valid items are present", () => {
      const result = transmogrifyOccurrences(["DAILY", "NEVER"], "vet");
      expect(result).toEqual(["DAILY"]);
    });

    it("should sort and deduplicate items", () => {
      const result = transmogrifyOccurrences(["WEEKLY_MONDAY", "WEEKLY_FRIDAY", "WEEKLY_MONDAY"], "vet");
      expect(result).toEqual(["WEEKLY_FRIDAY", "WEEKLY_MONDAY"]);
    });
  });

  describe("vet action (with new rules)", () => {
    it("Rule 2: should only allow MONTHLY_DAY_ and dates if MONTHLY_DAY_ is present", () => {
      const result = transmogrifyOccurrences(["MONTHLY_DAY_5", "WEEKLY_MONDAY", "2024-01-01"], "vet");
      expect(result).toEqual(["2024-01-01", "MONTHLY_DAY_5"]);
    });

    it("Rule 3: should only allow positional MONTHLY and dates if positional MONTHLY is present", () => {
      const result = transmogrifyOccurrences(["MONTHLY_1ST_MONDAY", "WEEKLY_TUESDAY", "2024-02-02", "MONTHLY_DAY_10"], "vet");
      // Note: If both MONTHLY_DAY and MONTHLY_1ST are present, Rule 2 comes first.
      // Wait, let's re-read the rules.
      // 2. If occurrences has a valid string that starts with "MONTHLY_DAY_" then remove all non-date strings that do not start with "MONTHLY_DAY_" are allowed in the array.
      // (The phrasing "are allowed" in the prompt might mean "only ... are allowed")
      // 3. if occurrences has a valid string that starts with "MONTHLY_1ST_", ... remove all non-date strings that do not start with ...
      
      const result2 = transmogrifyOccurrences(["MONTHLY_1ST_MONDAY", "WEEKLY_TUESDAY", "2024-02-02"], "vet");
      expect(result2).toEqual(["2024-02-02", "MONTHLY_1ST_MONDAY"]);
    });

    it("Rule 4: should only allow WEEKLY_ and dates if WEEKLY_ is present (and no MONTHLY rules match)", () => {
      const result = transmogrifyOccurrences(["WEEKLY_MONDAY", "DAILY", "2024-03-03"], "vet");
      expect(result).toEqual(["2024-03-03", "WEEKLY_MONDAY"]);
    });

    it("Rule 5: if 'DAILY' is present and no higher rules match, return ['DAILY']", () => {
      // If higher rules (MONTHLY, WEEKLY) are NOT present
      const result = transmogrifyOccurrences(["DAILY", "2024-04-04"], "vet");
      expect(result).toEqual(["DAILY"]);
    });

    it("Rule 5: should return ['DAILY'] if it has DAILY and it's the highest precedence", () => {
       const result = transmogrifyOccurrences(["DAILY", "SOME_INVALID"], "vet");
       expect(result).toEqual(["DAILY"]);
    });

    it("Rule 6: should return ['NEVER'] if no valid dates/occurrences remain", () => {
      const result = transmogrifyOccurrences(["INVALID"], "vet");
      expect(result).toEqual(["NEVER"]);
    });
    
    it("should handle mixed MONTHLY_DAY_ and positional MONTHLY according to Rule 2", () => {
       // Rule 2 says: if has "MONTHLY_DAY_", remove all non-date strings that do not start with "MONTHLY_DAY_"
       const result = transmogrifyOccurrences(["MONTHLY_DAY_5", "MONTHLY_1ST_MONDAY", "2024-01-01"], "vet");
       expect(result).toEqual(["2024-01-01", "MONTHLY_DAY_5"]);
    });

    it("should handle mixed WEEKLY and DAILY according to Rule 4", () => {
       const result = transmogrifyOccurrences(["WEEKLY_MONDAY", "DAILY"], "vet");
       expect(result).toEqual(["WEEKLY_MONDAY"]);
    });
  });

  describe("default behavior", () => {
    it("should default to vet if an unknown action is provided", () => {
      // @ts-expect-error - testing default case
      const result = transmogrifyOccurrences(["DAILY", "INVALID"], "unknown");
      expect(result).toEqual(["DAILY"]);
    });
  });
});
