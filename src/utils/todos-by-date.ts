import todo2Dates from "./todo-2-dates";

/**
 * Filters todos by a specific date.
 * Returns only todos that have an occurrence on the specified date.
 *
 * @param todos - Array of ToDo items to filter
 * @param date - Date string in YYYY-MM-DD format
 * @returns Array of ToDo items that occur on the specified date
 */
const todosByDate = (todos: ToDo[], date: string): ToDo[] => {
  return todos.filter((todo) => {
    const occurrenceDates = todo2Dates(todo);
    return occurrenceDates.includes(date);
  });
};

export default todosByDate;
