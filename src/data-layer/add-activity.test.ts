import addActivity from "./add-activity";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

describe("add-activity", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("posts activity and returns created entity; adds auth header when jwt provided", async () => {
    const created = { id: "a1", name: "Run" } as Activity;
    g.fetch.mockResolvedValue({ ok: true, status: 201, json: async () => created });
    const body = { name: "Run" } as Partial<Activity>;
    const res = await addActivity(body, "jwt-1");
    expect(res).toEqual(created as unknown);
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/activities",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json", Authorization: "Bearer jwt-1" }),
        body: JSON.stringify(body),
      })
    );
  });

  it("throws on non-ok with message", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 400, text: async () => "bad" });
    await expect(addActivity({ name: "x" }, undefined)).rejects.toThrow(
      "Failed to add activity (400): bad"
    );
  });
});
