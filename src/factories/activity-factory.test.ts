import activityFactory from "@/factories/activity-factory";

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe("activityFactory", () => {
  it("returns defaults when called with no args", () => {
    const a = activityFactory();
    expect(typeof a.id).toBe("string");
    expect(a.name).toBe("");
    expect(a.comment).toBe("");
    expect(a.goal).toBe(0);
    expect(["MUDA", "TASSEI"]).toContain(a.type);
    expect(typeof a.created).toBe("string");
    expect(typeof a.updated).toBe("string");
    expect(isoRegex.test(a.created)).toBe(true);
    expect(isoRegex.test(a.updated)).toBe(true);
  });

  it("preserves provided fields and converts numeric timestamps to ISO", () => {
    const now = Date.now();
    const a = activityFactory({
      id: "my-id",
      name: "Run",
      comment: "morning",
      goal: 5,
      type: "MUDA",
      created: now,
      updated: now,
    });

    expect(a.id).toBe("my-id");
    expect(a.name).toBe("Run");
    expect(a.comment).toBe("morning");
    expect(a.goal).toBe(5);
    expect(a.type).toBe("MUDA");
    expect(typeof a.created).toBe("string");
    expect(typeof a.updated).toBe("string");
    expect(isoRegex.test(a.created)).toBe(true);
    expect(isoRegex.test(a.updated)).toBe(true);
    expect(new Date(a.created).getTime()).toBeGreaterThanOrEqual(now - 1000);
  });

  it("defaults unknown type values to TASSEI", () => {
    const a = activityFactory({ type: "SOMETHING" as unknown as "MUDA" | "TASSEI" });
    expect(a.type).toBe("TASSEI");
  });
});
