/**
 * Converts a date to EST YYYY-MM-DD format
 * @param v - Date or ISO string to convert
 * @returns EST YYYY-MM-DD formatted string
 */
export const toLocalYMD = (v?: string | Date): string => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);

  // Convert to EST by subtracting 5 hours from UTC time
  const estDate = new Date(d.getTime() - (5 * 60 * 60 * 1000));

  // Format as YYYY-MM-DD
  return `${estDate.getFullYear()}-${String(estDate.getMonth() + 1).padStart(2, "0")}-${String(estDate.getDate()).padStart(2, "0")}`;
};

export default toLocalYMD;
