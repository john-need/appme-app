import fetchActivities from "./fetch-activities";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

describe("fetch-activities", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("returns activities on success and sets auth header", async () => {
    const body = [{ id: "a1" }];
    g.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => body });
    const res = await fetchActivities("jwt123");
    expect(res).toEqual(body as unknown);
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/activities",
      expect.objectContaining({ method: "GET", headers: expect.objectContaining({ Authorization: "Bearer jwt123" }) })
    );
  });

  it("returns empty array on 404", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 404, json: async () => [], text: async () => "not found" });
    await expect(fetchActivities("jwt123")).resolves.toEqual([]);
  });

  it("throws with status text on error", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 500, text: async () => "boom" });
    await expect(fetchActivities("token" as unknown as string)).rejects.toThrow(
      "Failed to fetch activities (500): boom"
    );
  });
});
