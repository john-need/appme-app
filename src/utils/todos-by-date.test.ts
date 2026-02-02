import todosByDate from "./todos-by-date";
import toDoFactory from "@/factories/to-do-factory";

describe("todosByDate", () => {
  it("should filter todos by a specific date", () => {
    const sampleTodo = toDoFactory();
    const todos: ToDo[] = [
      { ...sampleTodo, id: "1", occurrences: ["WEEKLY_MONDAY"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-28T05:00:00.000Z" },
      { ...sampleTodo, id: "2", occurrences: ["WEEKLY_TUESDAY"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-28T05:00:00.000Z" },
      { ...sampleTodo, id: "3", occurrences: ["2026-02-15"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-28T05:00:00.000Z" },
    ];

    const result = todosByDate(todos, "2026-02-02");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1"); // Monday is Feb 2, 2026
  });

  it("should return multiple todos that occur on the same date", () => {
    const sampleTodo = toDoFactory();
    const todos: ToDo[] = [
      { ...sampleTodo, id: "1", occurrences: ["WEEKLY_MONDAY"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-28T05:00:00.000Z" },
      { ...sampleTodo, id: "2", occurrences: ["2026-02-02"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-28T05:00:00.000Z" },
      { ...sampleTodo, id: "3", occurrences: ["MONTHLY_MONDAY"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-12-31T05:00:00.000Z" },
    ];

    const result = todosByDate(todos, "2026-02-02");
    expect(result).toHaveLength(3); // All three should occur on Monday, Feb 2
  });

  it("should return empty array when no todos match the date", () => {
    const sampleTodo = toDoFactory();
    const todos: ToDo[] = [
      { ...sampleTodo, id: "1", occurrences: ["WEEKLY_TUESDAY"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-28T05:00:00.000Z" },
      { ...sampleTodo, id: "2", occurrences: ["2026-02-15"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-28T05:00:00.000Z" },
    ];

    const result = todosByDate(todos, "2026-02-02");
    expect(result).toHaveLength(0);
  });

  it("should handle empty todos array", () => {
    const result = todosByDate([], "2026-02-02");
    expect(result).toEqual([]);
  });

  it("should filter todos with DAILY occurrence", () => {
    const sampleTodo = toDoFactory();
    const todos: ToDo[] = [
      { ...sampleTodo, id: "1", occurrences: ["DAILY"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-10T05:00:00.000Z" },
      { ...sampleTodo, id: "2", occurrences: ["WEEKLY_MONDAY"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-28T05:00:00.000Z" },
    ];

    const result = todosByDate(todos, "2026-02-05");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1"); // Only daily todo should match Feb 5 (Thursday)
  });

  it("should handle mixed occurrence types", () => {
    const sampleTodo = toDoFactory();
    const todos: ToDo[] = [
      { ...sampleTodo, id: "1", occurrences: ["WEEKLY_MONDAY", "2026-02-15"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-02-28T05:00:00.000Z" },
      { ...sampleTodo, id: "2", occurrences: ["MONTHLY_1ST_SUNDAY"], startsOn: "2026-02-01T05:00:00.000Z", endsOn: "2026-12-31T05:00:00.000Z" },
    ];

    const result = todosByDate(todos, "2026-02-15");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1"); // Only todo with specific date should match
  });
});
