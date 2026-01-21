import { nextEntryType } from "./next-entry-type";

const e = (type: PomodoroEntryType, created: string): PomodoroEntry => ({
  id: Math.random().toString(),
  activityId: "a1",
  pomodoroId: "p1",
  minutes: 25,
  created,
  updated: created,
  entryType: type
});

describe("nextEntryType", () => {
  it("returns WORK_INTERVAL when entries array is empty", () => {
    expect(nextEntryType([])).toBe("WORK_INTERVAL");
  });

  it("returns WORK_INTERVAL when the last entry was a SHORT_BREAK", () => {
    const entries = [e("SHORT_BREAK", "2023-01-01T10:00:00Z")];
    expect(nextEntryType(entries)).toBe("WORK_INTERVAL");
  });

  it("returns WORK_INTERVAL when the last entry was a LONG_BREAK", () => {
    const entries = [e("LONG_BREAK", "2023-01-01T10:00:00Z")];
    expect(nextEntryType(entries)).toBe("WORK_INTERVAL");
  });

  it("returns SHORT_BREAK when the last entry was WORK_INTERVAL and 0 short breaks before it", () => {
    const entries = [e("WORK_INTERVAL", "2023-01-01T10:00:00Z")];
    expect(nextEntryType(entries)).toBe("SHORT_BREAK");
  });

  it("returns SHORT_BREAK when the last entry was WORK_INTERVAL and 1 short break before it", () => {
    const entries = [
      e("WORK_INTERVAL", "2023-01-01T10:30:00Z"),
      e("SHORT_BREAK", "2023-01-01T10:00:00Z"),
      e("WORK_INTERVAL", "2023-01-01T09:30:00Z")
    ];
    expect(nextEntryType(entries)).toBe("SHORT_BREAK");
  });

  it("returns SHORT_BREAK when the last entry was WORK_INTERVAL and 2 short breaks before it", () => {
    const entries = [
      e("WORK_INTERVAL", "2023-01-01T11:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T10:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T10:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T09:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T09:00:00Z")
    ];
    expect(nextEntryType(entries)).toBe("SHORT_BREAK");
  });

  it("returns LONG_BREAK when the last entry was WORK_INTERVAL and 3 short breaks since last LONG_BREAK", () => {
    const entries = [
      e("WORK_INTERVAL", "2023-01-01T12:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T11:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T11:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T10:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T10:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T09:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T09:00:00Z"),
      e("LONG_BREAK", "2023-01-01T08:30:00Z")
    ];
    expect(nextEntryType(entries)).toBe("LONG_BREAK");
  });

  it("returns LONG_BREAK when the last entry was WORK_INTERVAL and 3 short breaks since start of array", () => {
    const entries = [
      e("WORK_INTERVAL", "2023-01-01T12:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T11:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T11:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T10:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T10:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T09:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T09:00:00Z")
    ];
    expect(nextEntryType(entries)).toBe("LONG_BREAK");
  });

  it("handles unsorted input correctly", () => {
    const entries = [
      e("SHORT_BREAK", "2023-01-01T11:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T12:00:00Z"), // most recent
      e("WORK_INTERVAL", "2023-01-01T11:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T10:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T10:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T09:30:00Z"),
      e("WORK_INTERVAL", "2023-01-01T09:00:00Z")
    ];
    expect(nextEntryType(entries)).toBe("LONG_BREAK");
  });

  it("returns SHORT_BREAK when indices 1, 3, 5 are not all SHORT_BREAK", () => {
    const entries = [
      e("WORK_INTERVAL", "2023-01-01T12:00:00Z"),
      e("WORK_INTERVAL", "2023-01-01T11:30:00Z"), // entries[1] is NOT SHORT_BREAK
      e("SHORT_BREAK", "2023-01-01T11:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T10:30:00Z"),
      e("SHORT_BREAK", "2023-01-01T10:00:00Z"),
      e("SHORT_BREAK", "2023-01-01T09:30:00Z"),
    ];
    // Previous logic would return LONG_BREAK because it counted 3 SHORT_BREAKs before any LONG_BREAK.
    // New logic requires entries[1], entries[3], entries[5] to be SHORT_BREAK.
    // Here entries[1] is WORK_INTERVAL, so it should return SHORT_BREAK.
    expect(nextEntryType(entries)).toBe("SHORT_BREAK");
  });
});
