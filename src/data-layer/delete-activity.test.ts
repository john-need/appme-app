import deleteActivity from "./delete-activity";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

describe("delete-activity", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("returns false when id or jwt missing and does not call fetch", async () => {
    await expect(deleteActivity("", undefined)).resolves.toBe(false);
    await expect(deleteActivity("a1", undefined)).resolves.toBe(false);
    await expect(deleteActivity("", "jwt")).resolves.toBe(false);
    expect(g.fetch).not.toHaveBeenCalled();
  });

  it("returns true on successful delete with auth header", async () => {
    g.fetch.mockResolvedValue({ ok: true, status: 204, text: async () => "" });
    await expect(deleteActivity("a1", "jwt-1")).resolves.toBe(true);
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/activities/a1",
      expect.objectContaining({ method: "DELETE", headers: expect.objectContaining({ Authorization: "Bearer jwt-1" }) })
    );
  });

  it("throws on non-ok with message", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 500, text: async () => "err" });
    await expect(deleteActivity("a1", "jwt")).rejects.toThrow(
      "Failed to delete activity (500): err"
    );
  });
});
