import { sortMostRecentFirst } from "./sort-by-created";

/**
 * Determines the next PomodoroEntryType based on existing entries.
 *
 * 1. Return LONG_BREAK if the first PomodoroEntry (most recent) has entryType "WORK_INTERVAL"
 *    and there are 3 or more SHORT_BREAK PomodoroEntries before the next LONG_BREAK type or the end of the array.
 * 2. Return SHORT_BREAK if the first entry is of type WORK_INTERVAL.
 * 3. Otherwise return "WORK_INTERVAL".
 */
export const nextEntryType = (entries: PomodoroEntry[]): PomodoroEntryType => {
  if (!entries || entries.length === 0) {
    return "WORK_INTERVAL";
  }

  const sorted = sortMostRecentFirst([...entries]);
  const lastEntry = sorted[0];

  if (lastEntry.entryType !== "WORK_INTERVAL") {
    return "WORK_INTERVAL";
  }

  // Count SHORT_BREAKs before the next LONG_BREAK or end of array
  let shortBreakCount = 0;
  for (let i = 1; i < sorted.length; i++) {
    const type = sorted[i].entryType;
    if (type === "LONG_BREAK") {
      break;
    }
    if (type === "SHORT_BREAK") {
      shortBreakCount++;
    }
  }

  if (shortBreakCount >= 3) {
    return "LONG_BREAK";
  }

  return "SHORT_BREAK";
};
