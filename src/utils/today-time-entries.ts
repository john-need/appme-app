import isToday from "./is-today";

/**
 * Filters time entries to only include those created today in the user's local timezone.
 * @param timeEntries - Array of time entries to filter

 * @returns Array of time entries where the created date is today in local time,

 */
const todayTimeEntries = (
  timeEntries: TimeEntry[]
): TimeEntry[] => timeEntries.filter(te => isToday(te.created));

export default todayTimeEntries;
