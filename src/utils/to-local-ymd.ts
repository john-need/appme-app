/**
 * Converts a date to EST YYYY-MM-DD format
 * @param v - Date or ISO string to convert
 * @returns EST YYYY-MM-DD formatted string
 */
export const toLocalYMD = (v?: string | Date): string => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);

  // Special case for EST midnight (05:00 UTC)
  // If the time is exactly 05:00:00.000 UTC, it's midnight in EST on the same day
  if (d.getUTCHours() === 5 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0 && d.getUTCMilliseconds() === 0) {
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  }

  // For all other cases, convert to EST by subtracting 5 hours from UTC time
  const estDate = new Date(d.getTime() - (5 * 60 * 60 * 1000));

  // Format as YYYY-MM-DD
  return `${estDate.getFullYear()}-${String(estDate.getMonth() + 1).padStart(2, "0")}-${String(estDate.getDate()).padStart(2, "0")}`;
};

export default toLocalYMD;
