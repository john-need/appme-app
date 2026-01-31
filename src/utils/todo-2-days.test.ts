import todo2Days from "./todo-2-days";
import todoFactory from "@/factories/todo-factory";

describe("todo2Days", () => {
  it("should return an array of date strings for every Sunday and Thursday from Feb 1 2026 to Dec 31 2026", () => {
    const sampleTodo = todoFactory({
      id: "test-id",
      text: "Test todo",
      userId: "test-user",
      created: "2026-01-01T00:00:00.000Z",
      updated: "2026-01-01T00:00:00.000Z",
      startsOn: "2026-02-01T05:00:00.000Z",
      endsOn: "2026-12-31T05:00:00.000Z",
      occurrences: ["MONTHLY_SUNDAY", "MONTHLY_THURSDAY"]
    });

    const answer = todo2Days(sampleTodo);

    // The array should start with "2026-02-01" (Sunday) and end with "2026-12-31" (Thursday)
    expect(answer[0]).toBe("2026-02-01");
    expect(answer[answer.length - 1]).toBe("2026-12-31");

    // Generate expected dates: all Sundays and Thursdays from Feb 1 to Dec 31, 2026
    const expectedDates: string[] = [];
    const start = new Date("2026-02-01T05:00:00.000Z");
    const end = new Date("2026-12-31T05:00:00.000Z");
    const current = new Date(start);

    while (current <= end) {
      const day = current.getUTCDay();
      if (day === 0 || day === 4) { // Sunday (0) or Thursday (4)
        const year = current.getUTCFullYear();
        const month = String(current.getUTCMonth() + 1).padStart(2, "0");
        const date = String(current.getUTCDate()).padStart(2, "0");
        expectedDates.push(`${year}-${month}-${date}`);
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }

    // Verify the result matches expected dates
    expect(answer).toEqual(expectedDates);
    
    // Verify total count (96 dates: 52 Sundays + 44 Thursdays from Feb 1 to Dec 31, 2026)
    expect(answer.length).toBe(96);
  });
});
