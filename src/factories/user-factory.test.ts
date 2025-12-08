import userFactory from "@/factories/user-factory";

describe("userFactory", () => {
  it("returns defaults when called with no args", () => {
    const u = userFactory();
    expect(typeof u.id).toBe("string");
    expect(u.email).toBe("");
    expect(u.name).toBe("");
    expect(["MONDAY", "SUNDAY"]).toContain(u.weekStart);
    expect(typeof u.timezone).toBe("string");
    expect(["WEEK", "DAY"]).toContain(u.defaultView);
    // created/updated should be ISO strings
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(typeof u.created).toBe("string");
    expect(typeof u.updated).toBe("string");
    expect(isoRegex.test(u.created)).toBe(true);
    expect(isoRegex.test(u.updated)).toBe(true);
  });

  it("preserves provided fields", () => {
    const u = userFactory({
      id: "my-id",
      email: "alice@example.com",
      name: "Alice",
      weekStart: "SUNDAY",
      timezone: "America/New_York",
      defaultView: "DAY",
    });

    expect(u.id).toBe("my-id");
    expect(u.email).toBe("alice@example.com");
    expect(u.name).toBe("Alice");
    expect(u.weekStart).toBe("SUNDAY");
    expect(u.timezone).toBe("America/New_York");
    expect(u.defaultView).toBe("DAY");
  });

  it("converts numeric created/updated to ISO", () => {
    const now = Date.now();
    const u = userFactory({ created: (now as unknown) as string, updated: (now as unknown) as string });
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(typeof u.created).toBe("string");
    expect(typeof u.updated).toBe("string");
    expect(isoRegex.test(u.created)).toBe(true);
    expect(isoRegex.test(u.updated)).toBe(true);
  });

  it("defaults unknown enum-like values to safe defaults", () => {
    const u = userFactory({ weekStart: "INVALID" as unknown as "MONDAY" | "SUNDAY", defaultView: "UNKNOWN" as unknown as "WEEK" | "DAY" });
    expect(u.weekStart).toBe("MONDAY");
    expect(u.defaultView).toBe("WEEK");
  });
});
