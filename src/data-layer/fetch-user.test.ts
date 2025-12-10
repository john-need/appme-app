import fetchUser from "./fetch-user";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));
jest.mock("../factories/user-factory", () => ({ __esModule: true, default: (x: unknown) => ({ ...(x as object), ok: true }) }));

describe("fetch-user", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("returns null on 404", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 404, text: async () => "not found" });
    await expect(fetchUser("jwt", "u1")).resolves.toBeNull();
  });

  it("throws with message on error", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 500, text: async () => "boom" });
    await expect(fetchUser("jwt", "u1")).rejects.toThrow("Failed to fetch user (500): boom");
  });

  it("returns user via factory and sets auth header", async () => {
    const body = { id: "u1", name: "John" };
    g.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => body });
    const res = await fetchUser("tok", "u1");
    expect(res).toEqual({ ...body, ok: true });
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/users/u1",
      expect.objectContaining({ method: "GET", headers: expect.objectContaining({ Authorization: "Bearer tok" }) })
    );
  });
});
