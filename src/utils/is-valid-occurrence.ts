const isValidOccurrence = (o: unknown): boolean => {
  if (typeof o !== "string") {
    return false;
  }

  const trimmed = o.trim();

  // Handle specific dates (YYYY-MM-DD format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return true;
  }

  const parts = trimmed.split("_");
  const type = parts[0];

  const dayOfWeekMap = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  if (type === "NEVER" && parts.length === 1) return true;
  if (type === "DAILY" && parts.length === 1) return true;
  if (type === "YEARLY" && parts.length === 1) return true;

  if (type === "WEEKLY") {
    return parts.length === 2 && dayOfWeekMap.includes(parts[1]);
  }

  if (type === "MONTHLY") {
    if (parts.length === 1) return true;
    if (parts.length === 2) {
      if (parts[1] === "DAY") return false; // "MONTHLY_DAY" is invalid
      return dayOfWeekMap.includes(parts[1]);
    }
    if (parts.length === 3) {
      if (parts[1] === "DAY") {
        const day = parseInt(parts[2], 10);
        return !isNaN(day) && day >= 1 && day <= 31 && String(day) === parts[2];
      }
      const position = parts[1];
      const positions = ["1ST", "2ND", "3RD", "4TH", "LAST"];
      return positions.includes(position) && dayOfWeekMap.includes(parts[2]);
    }
  }

  return false;
};

export default isValidOccurrence;