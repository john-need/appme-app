import patchActivity from "./patch-activity";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

describe("patch-activity", () => {
  const g = global as unknown as { fetch: jest.Mock };
  const fixedNow = new Date("2024-01-02T03:04:05.678Z");

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(fixedNow);
    g.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("throws when id missing", async () => {
    // @ts-expect-error intentionally missing id
    await expect(patchActivity({ name: "x" }, "jwt")).rejects.toThrow(
      "patchActivity requires an activity with an id"
    );
  });

  it("sends only updatable fields and includes updated timestamp; returns JSON", async () => {
    const returned = { id: "a1", name: "New", updated: fixedNow.toISOString() };
    g.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => returned });

    const input = { id: "a1", name: "New", created: "old", ignoreMe: undefined } as unknown as Partial<Activity> & { id: string };
    const res = await patchActivity(input, "jwt-1");
    expect(res).toEqual(returned as unknown);
    const [, options] = g.fetch.mock.calls[0];
    const sent = JSON.parse((options as { body: string }).body);
    expect(sent).toMatchObject({ name: "New", updated: fixedNow.toISOString() });
    expect(sent).not.toHaveProperty("id");
    expect(sent).not.toHaveProperty("created");
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/activities/a1",
      expect.objectContaining({ method: "PATCH", headers: expect.objectContaining({ Authorization: "Bearer jwt-1" }) })
    );
  });

  it("throws on non-ok with message", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 500, text: async () => "err" });
    await expect(patchActivity({ id: "a1", name: "x" }, undefined)).rejects.toThrow(
      "Failed to patch activity (500): err"
    );
  });
});
