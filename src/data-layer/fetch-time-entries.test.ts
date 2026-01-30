import fetchTimeEntries from "./fetch-time-entries";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

describe("fetch-time-entries", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("returns entries on success and sets auth header when jwt provided", async () => {
    const body = [{ id: "t1" }];
    g.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => body });
    const res = await fetchTimeEntries("jwt-abc");
    expect(res).toEqual(body as unknown);
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/time-entries",
      expect.objectContaining({ method: "GET", headers: expect.objectContaining({ Authorization: "Bearer jwt-abc" }) })
    );
  });

  it("returns [] on 404", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 404, text: async () => "n/a" });
    await expect(fetchTimeEntries("token" as unknown as string)).resolves.toEqual([]);
  });

  it("throws on non-ok status with message", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 500, text: async () => "err" });
    await expect(fetchTimeEntries("t" as unknown as string)).rejects.toThrow(
      "Failed to fetch time entries (500): err"
    );
  });

  it("validates response is an array", async () => {
    g.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    await expect(fetchTimeEntries("t" as unknown as string)).rejects.toThrow(
      "Invalid time entries response: expected an array"
    );
  });
});
