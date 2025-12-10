import patchTimeEntry from "./patch-time-entry";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

describe("patch-time-entry", () => {
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
    // @ts-expect-error missing id on purpose
    await expect(patchTimeEntry({ duration: 1 }, "jwt")).rejects.toThrow(
      "patchTimeEntry requires an entry with an id"
    );
  });

  it("sends only updatable fields with updated timestamp", async () => {
    const returned = { id: "t1", duration: 60, updated: fixedNow.toISOString() };
    g.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => returned });
    const input = { id: "t1", duration: 60, created: "old", ignore: undefined } as unknown as Partial<TimeEntry> & { id: string };
    const res = await patchTimeEntry(input, "jwt-1");
    expect(res).toEqual(returned as unknown);
    const [, options] = g.fetch.mock.calls[0];
    const sent = JSON.parse((options as { body: string }).body);
    expect(sent).toMatchObject({ duration: 60, updated: fixedNow.toISOString() });
    expect(sent).not.toHaveProperty("id");
    expect(sent).not.toHaveProperty("created");
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/time-entries/t1",
      expect.objectContaining({ method: "PATCH", headers: expect.objectContaining({ Authorization: "Bearer jwt-1" }) })
    );
  });

  it("throws on non-ok with message", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 400, text: async () => "bad" });
    await expect(patchTimeEntry({ id: "t1", duration: 1 }, undefined)).rejects.toThrow(
      "Failed to patch time entry (400): bad"
    );
  });
});
