import isValidDate from "@/utils/is-valid-date";

/**
 * Converts a local date-time (Date object or string) to UTC date-time string (ISO format).
 * @param localDateTime - Date object or a string representing a local date-time.
 * @returns ISO string representation of the date-time in UTC, or an empty string if invalid.
 */
const localDateTime2UTC = (localDateTime: Date | string): string => {
  const date = typeof localDateTime === "string" ? new Date(localDateTime) : localDateTime;

  if (!isValidDate(date)) {
    return "";
  }

  return date.toISOString();
};

export default localDateTime2UTC;
