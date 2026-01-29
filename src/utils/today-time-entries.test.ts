import todayTimeEntries from "./today-time-entries";
import isToday from "./is-today";

jest.mock("./is-today");

describe("todayTimeEntries", () => {
  const mockIsToday = isToday as jest.MockedFunction<typeof isToday>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty array when given empty array", () => {
    const result = todayTimeEntries([]);
    expect(result).toEqual([]);
    expect(mockIsToday).not.toHaveBeenCalled();
  });

  it("should return time entries where created date is today", () => {
    const todayEntry1: TimeEntry = {
      id: "te1",
      activityId: "a1",
      created: "2026-01-27T10:00:00Z",
      updated: "2026-01-27T10:00:00Z",
      minutes: 30,
      notes: "Today's work"
    };
    const todayEntry2: TimeEntry = {
      id: "te2",
      activityId: "a2",
      created: "2026-01-27T15:30:00Z",
      updated: "2026-01-27T15:30:00Z",
      minutes: 45
    };

    mockIsToday.mockReturnValue(true);

    const result = todayTimeEntries([todayEntry1, todayEntry2]);

    expect(result).toEqual([todayEntry1, todayEntry2]);
    expect(mockIsToday).toHaveBeenCalledTimes(2);
    expect(mockIsToday).toHaveBeenCalledWith(todayEntry1.created);
    expect(mockIsToday).toHaveBeenCalledWith(todayEntry2.created);
  });

  it("should filter out time entries where created date is not today", () => {
    const todayEntry: TimeEntry = {
      id: "te1",
      activityId: "a1",
      created: "2026-01-27T10:00:00Z",
      updated: "2026-01-27T10:00:00Z",
      minutes: 30
    };
    const yesterdayEntry: TimeEntry = {
      id: "te2",
      activityId: "a2",
      created: "2026-01-26T10:00:00Z",
      updated: "2026-01-26T10:00:00Z",
      minutes: 45
    };

    mockIsToday
      .mockReturnValueOnce(true)   // todayEntry
      .mockReturnValueOnce(false); // yesterdayEntry

    const result = todayTimeEntries([todayEntry, yesterdayEntry]);

    expect(result).toEqual([todayEntry]);
    expect(mockIsToday).toHaveBeenCalledTimes(2);
  });

  it("should return empty array when all entries are not from today", () => {
    const oldEntry1: TimeEntry = {
      id: "te1",
      activityId: "a1",
      created: "2026-01-20T10:00:00Z",
      updated: "2026-01-20T10:00:00Z",
      minutes: 30
    };
    const oldEntry2: TimeEntry = {
      id: "te2",
      activityId: "a2",
      created: "2026-01-25T10:00:00Z",
      updated: "2026-01-25T10:00:00Z",
      minutes: 45
    };

    mockIsToday.mockReturnValue(false);

    const result = todayTimeEntries([oldEntry1, oldEntry2]);

    expect(result).toEqual([]);
    expect(mockIsToday).toHaveBeenCalledTimes(2);
  });

  it("should handle mixed dates correctly", () => {
    const entries: TimeEntry[] = [
      {
        id: "te1",
        activityId: "a1",
        created: "2026-01-27T08:00:00Z",
        updated: "2026-01-27T08:00:00Z",
        minutes: 15
      },
      {
        id: "te2",
        activityId: "a2",
        created: "2026-01-26T12:00:00Z",
        updated: "2026-01-26T12:00:00Z",
        minutes: 30
      },
      {
        id: "te3",
        activityId: "a3",
        created: "2026-01-27T14:00:00Z",
        updated: "2026-01-27T14:00:00Z",
        minutes: 20
      },
      {
        id: "te4",
        activityId: "a4",
        created: "2026-01-25T10:00:00Z",
        updated: "2026-01-25T10:00:00Z",
        minutes: 60
      },
      {
        id: "te5",
        activityId: "a5",
        created: "2026-01-27T18:30:00Z",
        updated: "2026-01-27T18:30:00Z",
        minutes: 40
      }
    ];

    mockIsToday
      .mockReturnValueOnce(true)   // te1 - today
      .mockReturnValueOnce(false)  // te2 - yesterday
      .mockReturnValueOnce(true)   // te3 - today
      .mockReturnValueOnce(false)  // te4 - old
      .mockReturnValueOnce(true);  // te5 - today

    const result = todayTimeEntries(entries);

    expect(result).toEqual([entries[0], entries[2], entries[4]]);
    expect(mockIsToday).toHaveBeenCalledTimes(5);
  });

  it("should pass the created date string to isToday function", () => {
    const entry: TimeEntry = {
      id: "te1",
      activityId: "a1",
      created: "2026-01-27T10:00:00.000Z",
      updated: "2026-01-27T10:00:00.000Z",
      minutes: 30
    };

    mockIsToday.mockReturnValue(true);

    todayTimeEntries([entry]);

    expect(mockIsToday).toHaveBeenCalledWith("2026-01-27T10:00:00.000Z");
  });

  it("should handle entries with different date string formats", () => {
    const entries: TimeEntry[] = [
      {
        id: "te1",
        activityId: "a1",
        created: "2026-01-27T10:00:00Z",
        updated: "2026-01-27T10:00:00Z",
        minutes: 15
      },
      {
        id: "te2",
        activityId: "a2",
        created: "2026-01-27 10:00:00.000000",
        updated: "2026-01-27 10:00:00.000000",
        minutes: 30
      }
    ];

    mockIsToday.mockReturnValue(true);

    const result = todayTimeEntries(entries);

    expect(result).toEqual(entries);
    expect(mockIsToday).toHaveBeenCalledWith("2026-01-27T10:00:00Z");
    expect(mockIsToday).toHaveBeenCalledWith("2026-01-27 10:00:00.000000");
  });

  it("should preserve original order of filtered entries", () => {
    const entry1: TimeEntry = {
      id: "te1",
      activityId: "a1",
      created: "2026-01-27T10:00:00Z",
      updated: "2026-01-27T10:00:00Z",
      minutes: 30
    };
    const entry2: TimeEntry = {
      id: "te2",
      activityId: "a2",
      created: "2026-01-27T11:00:00Z",
      updated: "2026-01-27T11:00:00Z",
      minutes: 45
    };
    const entry3: TimeEntry = {
      id: "te3",
      activityId: "a3",
      created: "2026-01-27T12:00:00Z",
      updated: "2026-01-27T12:00:00Z",
      minutes: 20
    };

    mockIsToday.mockReturnValue(true);

    const result = todayTimeEntries([entry1, entry2, entry3]);

    expect(result[0]).toBe(entry1);
    expect(result[1]).toBe(entry2);
    expect(result[2]).toBe(entry3);
  });

  it("should handle entries with optional notes field", () => {
    const entryWithNotes: TimeEntry = {
      id: "te1",
      activityId: "a1",
      created: "2026-01-27T10:00:00Z",
      updated: "2026-01-27T10:00:00Z",
      minutes: 30,
      notes: "Some notes"
    };
    const entryWithoutNotes: TimeEntry = {
      id: "te2",
      activityId: "a2",
      created: "2026-01-27T11:00:00Z",
      updated: "2026-01-27T11:00:00Z",
      minutes: 45
    };

    mockIsToday.mockReturnValue(true);

    const result = todayTimeEntries([entryWithNotes, entryWithoutNotes]);

    expect(result).toEqual([entryWithNotes, entryWithoutNotes]);
    expect(result[0].notes).toBe("Some notes");
    expect(result[1].notes).toBeUndefined();
  });
});
