import auth from "./auth";

jest.mock("./fetch-user", () => ({ __esModule: true, default: jest.fn(async () => ({ id: "u1", name: "User" })) }));

describe("auth", () => {
  const g = global as unknown as { fetch: jest.Mock };

  const makeJwt = (payload: Record<string, unknown>) => {
    const base64url = (obj: unknown) =>
      Buffer.from(JSON.stringify(obj)).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    return `${base64url({ alg: "none", typ: "JWT" })}.${base64url(payload)}.`;
  };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("authenticates, extracts user id from token, and fetches user", async () => {
    const token = makeJwt({ id: "u1" });
    g.fetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ token }) });

    const { default: fetchUser } = await import("./fetch-user");

    const res = await auth("a@b.com", "pw");
    expect(res.token).toBe(token);
    expect(res.user).toEqual({ id: "u1", name: "User" });
    // ensure fetch was called to /auth
    expect(g.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth$/),
      expect.objectContaining({ method: "POST" })
    );
    // ensure fetchUser called with token and id
    expect(fetchUser).toHaveBeenCalledWith(token, "u1");
  });

  it("throws when auth endpoint returns non-ok", async () => {
    g.fetch.mockResolvedValueOnce({ ok: false, status: 401, text: async () => "nope" });
    await expect(auth("x@y", "bad")).rejects.toThrow("Authentication failed (401): nope");
  });

  it("throws when token has no id claim", async () => {
    const token = makeJwt({ role: "user" });
    g.fetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ token }) });
    await expect(auth("a", "b")).rejects.toThrow("Token does not contain a user id claim");
  });
});
