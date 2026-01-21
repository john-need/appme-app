import { sortMostRecentFirst } from "./sort-by-created";



/**
 * Determines the next PomodoroEntryType based on existing entries.
 *
 * 1. Return LONG_BREAK if the first PomodoroEntry (most recent) has entryType "WORK_INTERVAL"
 *    and entries[1], entries[3], and entries[5] are of type SHORT_BREAK.
 * 2. Return SHORT_BREAK if the first entry is of type WORK_INTERVAL.
 * 3. Otherwise, return "WORK_INTERVAL".
 */
export const nextEntryType = (entries: PomodoroEntry[]): PomodoroEntryType => {
  if (!entries || entries.length === 0) {
    return "WORK_INTERVAL";
  }

  const sorted = sortMostRecentFirst([...entries]);
  const isWork = sorted[0].entryType === "WORK_INTERVAL";

  const isLongBreak =
    isWork &&
    sorted.length >= 6 &&
    sorted[1].entryType === "SHORT_BREAK" &&
    sorted[3].entryType === "SHORT_BREAK" &&
    sorted[5].entryType === "SHORT_BREAK";

  if (isLongBreak) return "LONG_BREAK";
  if (isWork) return "SHORT_BREAK";

  return "WORK_INTERVAL";
};
