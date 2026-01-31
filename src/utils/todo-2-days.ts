/**
 * Converts a ToDo with occurrences to an array of date strings
 * @param todo - ToDo object with startsOn, endsOn, and occurrences
 * @returns Array of date strings in YYYY-MM-DD format
 */
export const todo2Days = (todo: ToDo): string[] => {
  const result: string[] = [];
  
  if (!todo.occurrences || todo.occurrences.length === 0) {
    return result;
  }
  
  // Parse start and end dates
  const startDate = new Date(todo.startsOn);
  const endDate = todo.endsOn ? new Date(todo.endsOn) : startDate;
  
  // Map occurrence strings to day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMap: Record<string, number> = {
    "SUNDAY": 0,
    "MONDAY": 1,
    "TUESDAY": 2,
    "WEDNESDAY": 3,
    "THURSDAY": 4,
    "FRIDAY": 5,
    "SATURDAY": 6,
    "MONTHLY_SUNDAY": 0,
    "MONTHLY_MONDAY": 1,
    "MONTHLY_TUESDAY": 2,
    "MONTHLY_WEDNESDAY": 3,
    "MONTHLY_THURSDAY": 4,
    "MONTHLY_FRIDAY": 5,
    "MONTHLY_SATURDAY": 6
  };
  
  const targetDays = todo.occurrences
    .map(occ => dayMap[occ])
    .filter(day => day !== undefined);
  
  if (targetDays.length === 0) {
    return result;
  }
  
  // Iterate through each day from start to end
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getUTCDay();
    
    if (targetDays.includes(dayOfWeek)) {
      const year = currentDate.getUTCFullYear();
      const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getUTCDate()).padStart(2, "0");
      result.push(`${year}-${month}-${day}`);
    }
    
    // Move to next day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  
  return result;
};

export default todo2Days;
