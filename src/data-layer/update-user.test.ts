import updateUser from "./update-user";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

// mock useMutation to expose the mutationFn and allow calling mutateAsync
const mutateAsyncMock = jest.fn();
jest.mock("@tanstack/react-query", () => ({
  __esModule: true,
  useMutation: (mutationFn: (vars: any) => Promise<any>) => {
    mutateAsyncMock.mockImplementation(mutationFn);
    return { mutateAsync: mutateAsyncMock } as unknown;
  },
}));

describe("update-user (hook)", () => {
  const g = global as unknown as { fetch: jest.Mock };
  const fixedNow = new Date("2024-01-02T03:04:05.678Z");

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(fixedNow);
    g.fetch = jest.fn();
    mutateAsyncMock.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("patches user with only updatable fields and updated timestamp; includes auth header", async () => {
    const returned = { id: "u1", name: "Jane", updated: fixedNow.toISOString() };
    g.fetch.mockResolvedValue({ ok: true, status: 200, json: async () => returned });

    const hook = updateUser();
    const result = await (hook as unknown as { mutateAsync: (v: any) => Promise<any> }).mutateAsync({
      user: { id: "u1", name: "Jane", defaultView: undefined, created: "old" },
      jwt: "jwt-1",
    });

    expect(result).toEqual(returned as unknown);
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/users/u1",
      expect.objectContaining({ method: "PATCH", headers: expect.objectContaining({ Authorization: "Bearer jwt-1" }) })
    );
    const [, options] = g.fetch.mock.calls[0];
    const sent = JSON.parse((options as { body: string }).body);
    expect(sent).toMatchObject({ name: "Jane", updated: fixedNow.toISOString() });
    expect(sent).not.toHaveProperty("id");
    expect(sent).not.toHaveProperty("created");
  });

  it("throws on non-ok with message", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 400, text: async () => "bad" });
    const hook = updateUser();
    await expect(
      (hook as unknown as { mutateAsync: (v: any) => Promise<any> }).mutateAsync({ user: { id: "u1", name: "x" } })
    ).rejects.toThrow("Failed to update user (400): bad");
  });
});
