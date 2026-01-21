import { deletePomodoro } from "./delete-pomodoro";

jest.mock("@/utils/get-api-base", () => ({
  __esModule: true,
  default: () => "http://api.test",
}));

describe("deletePomodoro", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  const mockPomodoro: Pomodoro = {
    id: "p1",
    userId: "u1",
    name: "Test Pomodoro",
    notes: "Notes",
    entries: [],
    created: "2023-01-01",
    updated: "2023-01-01",
    activityId: "a1",
  };

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

  it("successfully deletes pomodoro when owned by user", async () => {
    g.fetch.mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await deletePomodoro(mockPomodoro, mockUser, "jwt123");

    expect(result).toBe(true);
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/pomodoros/p1",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: "Bearer jwt123",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("returns false if pomodoro is not owned by user", async () => {
    const otherUser = { ...mockUser, id: "u2" };
    const result = await deletePomodoro(mockPomodoro, otherUser, "jwt123");

    expect(result).toBe(false);
    expect(g.fetch).not.toHaveBeenCalled();
  });

  it("returns false if missing required parameters", async () => {
    expect(await deletePomodoro(null as any, mockUser, "jwt123")).toBe(false);
    expect(await deletePomodoro(mockPomodoro, null as any, "jwt123")).toBe(false);
    expect(await deletePomodoro(mockPomodoro, mockUser, "")).toBe(false);
  });

  it("throws error if API request fails", async () => {
    g.fetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => "Forbidden",
    });

    await expect(deletePomodoro(mockPomodoro, mockUser, "jwt123")).rejects.toThrow(
      "Failed to delete pomodoro (403): Forbidden"
    );
  });
});
