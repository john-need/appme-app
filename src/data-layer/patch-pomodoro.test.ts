import { patchPomodoro } from "./patch-pomodoro";
import pomodoroFactory from "@/factories/pomodoro-factory";

jest.mock("@/utils/get-api-base", () => ({
  __esModule: true,
  default: () => "http://api.test",
}));

describe("patchPomodo", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
    jest.useFakeTimers().setSystemTime(new Date("2023-01-01T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockUser: User = {
    id: "u1",
    email: "test@example.com",
    name: "Test User",
    startOfWeek: "MONDAY",
    timezone: "UTC",
    defaultView: "WEEK",
    created: "2023-01-01",
    updated: "2023-01-01",
  };

  it("successfully patches pomodoro when owned by user", async () => {
    const patchData = { id: "p1", name: "Updated Name", userId: "u1" };
    const returnedData = { ...patchData, created: "2023-01-01", updated: "2023-01-01T12:00:00Z" };
    
    g.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => returnedData,
    });

    const result = await patchPomodoro(patchData, mockUser, "jwt123");

    expect(result).toEqual(pomodoroFactory(returnedData));
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/pomodoros/p1",
      expect.objectContaining({
        method: "PATCH",
        headers: expect.objectContaining({
          Authorization: "Bearer jwt123",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          name: "Updated Name",
          userId: "u1",
          updated: "2023-01-01T12:00:00.000Z"
        })
      })
    );
  });

  it("returns null if pomodoro.userId is present and does not match user.id", async () => {
    const patchData = { id: "p1", name: "Updated Name", userId: "u2" };
    const result = await patchPomodoro(patchData, mockUser, "jwt123");

    expect(result).toBeNull();
    expect(g.fetch).not.toHaveBeenCalled();
  });

  it("proceeds if userId is not in patchData (cannot check ownership from partial)", async () => {
     const patchData = { id: "p1", name: "Updated Name" };
     g.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...patchData, userId: "u1" }),
    });

    const result = await patchPomodoro(patchData, mockUser, "jwt123");
    expect(result).not.toBeNull();
    expect(g.fetch).toHaveBeenCalled();
  });

  it("throws error if missing required parameters", async () => {
    await expect(patchPomodoro(null as any, mockUser, "jwt123")).rejects.toThrow();
    await expect(patchPomodoro({ name: "test" } as any, mockUser, "jwt123")).rejects.toThrow();
    await expect(patchPomodoro({ id: "p1" }, null as any, "jwt123")).rejects.toThrow();
    await expect(patchPomodoro({ id: "p1" }, mockUser, "")).rejects.toThrow();
  });

  it("throws error if API request fails", async () => {
    const patchData = { id: "p1", name: "Updated Name" };
    g.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(patchPomodoro(patchData, mockUser, "jwt123")).rejects.toThrow(
      "Failed to patch pomodoro (400): Bad Request"
    );
  });
});
