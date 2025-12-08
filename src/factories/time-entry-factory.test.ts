import timeEntryFactory from "@/factories/time-entry-factory";

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

describe("timeEntryFactory", () => {
  it("returns defaults when called with no args", () => {
    const t = timeEntryFactory();
    expect(typeof t.id).toBe("string");
    expect(t.activityId).toBe("");
    expect(typeof t.date).toBe("string");
    expect(dateOnlyRegex.test(t.date)).toBe(true);
    expect(t.minutes).toBe(0);
    expect(t.notes).toBe("");
    expect(typeof t.created).toBe("string");
    expect(typeof t.updated).toBe("string");
    expect(isoRegex.test(t.created)).toBe(true);
    expect(isoRegex.test(t.updated)).toBe(true);
  });

  it("preserves provided fields and converts numeric timestamps to ISO", () => {
    const now = Date.now();
    // cast numeric timestamps through unknown to satisfy Partial<TimeEntry> typing in tests
    const t = timeEntryFactory({
      id: "my-id",
      activityId: "act-1",
      date: "2025-12-05",
      minutes: 45,
      notes: "meeting",
      created: (now as unknown) as string,
      updated: (now as unknown) as string,
    });

    expect(t.id).toBe("my-id");
    expect(t.activityId).toBe("act-1");
    expect(t.date).toBe("2025-12-05");
    expect(t.minutes).toBe(45);
    expect(t.notes).toBe("meeting");
    expect(typeof t.created).toBe("string");
    expect(typeof t.updated).toBe("string");
    expect(isoRegex.test(t.created)).toBe(true);
    expect(isoRegex.test(t.updated as string)).toBe(true);
  });

  it("uses default date when non-string date is provided", () => {
    const nowDate = new Date().toISOString().slice(0, 10);
    const t = timeEntryFactory({ date: (12345 as unknown) as string });
    // should ignore non-string and use today's YYYY-MM-DD
    expect(t.date).toBe(nowDate);
  });
});
