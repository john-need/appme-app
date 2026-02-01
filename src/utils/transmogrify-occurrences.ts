import isValidOccurrence from "@/utils/is-valid-occurrence";

const isDate = (occ: string) => /^\d{4}-\d{2}-\d{2}$/.test(occ);

const vetOccurrencesArray = (occurrences: string[]): string[] => {
  // remove invalid and "NEVER"
  let filtered = occurrences.filter((occ) => isValidOccurrence(occ) && occ !== "NEVER");

  if (filtered.length === 0) {
    return ["NEVER"];
  }

  // 1. A "non-date" string is a string that does not match the date format of "YYYY-MM-DD" format.
  // We'll use this definition in the following rules.

  // 2. If the occurrences-array has a valid string that starts with "MONTHLY_DAY_"
  // then remove all non-date strings that do not start with "MONTHLY_DAY_".
  if (filtered.some(occ => occ.startsWith("MONTHLY_DAY_"))) {
    filtered = filtered.filter(occ => isDate(occ) || occ.startsWith("MONTHLY_DAY_"));
  }

  // 3. if the occurrences-array has a valid string that starts with "MONTHLY_1ST_", "MONTHLY_2ND_", "MONTHLY_3RD_", "MONTHLY_4TH_", or "MONTHLY_LAST_"
  // remove all non-date strings that do not start with "MONTHLY_1ST_", "MONTHLY_2ND_", "MONTHLY_3RD_", "MONTHLY_4TH_", or "MONTHLY_LAST_".
  // (Note: prompt had "MONTHLY_1ST_" twice, I corrected to 1st, 2nd, 3rd, 4th, last based on is-valid-occurrence.ts)
  const positionalPrefixes = ["MONTHLY_1ST_", "MONTHLY_2ND_", "MONTHLY_3RD_", "MONTHLY_4TH_", "MONTHLY_LAST_"];
  if (filtered.some(occ => positionalPrefixes.some(prefix => occ.startsWith(prefix)))) {
    filtered = filtered.filter(occ => isDate(occ) || positionalPrefixes.some(prefix => occ.startsWith(prefix)));
  }

  // 4. if the occurrences-array has a valid string that starts with "WEEKLY_" remove all non-date strings that do not start with "WEEKLY_".
  if (filtered.some(occ => occ.startsWith("WEEKLY"))) {
    filtered = filtered.filter(occ => isDate(occ) || occ.startsWith("WEEKLY"));
  }

  // 5. if the occurrences-array has the string "DAILY", then return ["DAILY"]
  if (filtered.includes("DAILY")) {
    return ["DAILY"];
  }

  // 6. If an array contains no valid date strings return ["NEVER"]
  // If the array is empty after all filters, it certainly contains no valid date strings.
  if (filtered.length === 0) {
    return ["NEVER"];
  }

  // Make Unique and return a sorted array
  const occSet = new Set(filtered);
  return Array.from(occSet).sort();
};

const transmogrifyOccurrences = (occurrences: string[], action: "add" | "remove" | "vet", occurrence: string = "", ): string[] => {
  const trimmed = occurrence.trim();

  switch (action) {
    case "add": {
      if ("NEVER" === trimmed || "DAILY" === trimmed) {
        return [trimmed];
      }
      const splits = trimmed.split("_");

      if (splits[0] === "MONTHLY" && splits[1] === "DAY") {
        // Remove all non-date occurrences that do not start with "MONTHLY_DAY_"
        const cleanedOccurrences = occurrences.filter((occ) => isDate(occ) || occ.startsWith("MONTHLY_DAY_"));
        return vetOccurrencesArray(cleanedOccurrences.concat(trimmed));
      }
      if (splits[0] === "MONTHLY") {
        // Remove all non-date occurrences that do not start with any of the positional monthly prefixes
        const positionalPrefixes = ["MONTHLY_1ST_", "MONTHLY_2ND_", "MONTHLY_3RD_", "MONTHLY_4TH_", "MONTHLY_LAST_"];
        const cleanedOccurrences = occurrences.filter((occ) => isDate(occ) || positionalPrefixes.some(pfx => occ.startsWith(pfx)));
        return vetOccurrencesArray(cleanedOccurrences.concat(trimmed));
      }
      if (splits[0] === "WEEKLY") {
        // According to Rule 4, if WEEKLY_ is present, remove other non-date occurrences (like DAILY)
        // Note: The previous implementation removed everything except dates and MONTHLY_DAY_, which might be wrong based on Rule 4.
        // Rule 4: if the occurrences-array has a valid string that starts with "WEEKLY" remove all non-date strings that do not start with "WEEKLY_".
        const cleanedOccurrences = occurrences.filter((occ) => isDate(occ) || occ.startsWith("WEEKLY"));
        return vetOccurrencesArray(cleanedOccurrences.concat(trimmed));
      }

      return vetOccurrencesArray(occurrences.concat(trimmed));
    }

    case "remove": {
      const removed = occurrences.filter((occ) => occ !== trimmed);
      return vetOccurrencesArray(removed);
    }
    default:
      return vetOccurrencesArray(occurrences);
  }
 
};

export default transmogrifyOccurrences;