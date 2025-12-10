import deleteTimeEntry from "./delete-time-entry";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

describe("delete-time-entry", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("throws when id is missing", async () => {
    await expect(deleteTimeEntry("" as unknown as string, undefined)).rejects.toThrow(
      "deleteTimeEntry requires an id"
    );
  });

  it("returns true on success (no jwt header by default)", async () => {
    g.fetch.mockResolvedValue({ ok: true, status: 204, text: async () => "" });
    await expect(deleteTimeEntry("t1", undefined)).resolves.toBe(true);
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/time-entries/t1",
      expect.objectContaining({ method: "DELETE", headers: {} })
    );
  });

  it("adds Authorization header when jwt provided", async () => {
    g.fetch.mockResolvedValue({ ok: true, status: 204, text: async () => "" });
    await deleteTimeEntry("t2", "jwt-2");
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/time-entries/t2",
      expect.objectContaining({ method: "DELETE", headers: expect.objectContaining({ Authorization: "Bearer jwt-2" }) })
    );
  });

  it("throws on non-ok with message", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 500, text: async () => "err" });
    await expect(deleteTimeEntry("t1", undefined)).rejects.toThrow(
      "Failed to delete time entry (500): err"
    );
  });
});
