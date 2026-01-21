import { addPomodoro } from "./add-pomodoro";
import pomodoroFactory from "@/factories/pomodoro-factory";

jest.mock("@/utils/get-api-base", () => ({
  __esModule: true,
  default: () => "http://api.test",
}));

describe("addPomodoro", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("successfully adds a pomodoro and sets Authorization header", async () => {
    const mockPomodoro: Partial<Pomodoro> = {
      name: "New Pomodoro",
      userId: "u123",
      activityId: "a1",
    };
    const responseData = {
      id: "p1",
      ...mockPomodoro,
      entries: [],
      created: "2023-01-01T00:00:00Z",
      updated: "2023-01-01T00:00:00Z",
    };

    g.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => responseData,
    });

    const result = await addPomodoro(mockPomodoro, "jwt-token");

    expect(result).toEqual(pomodoroFactory(responseData));
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/pomodoros",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer jwt-token",
        },
        body: JSON.stringify(mockPomodoro),
      })
    );
  });

  it("throws an error when the API response is not OK", async () => {
    g.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(addPomodoro({ name: "Fail" }, "jwt")).rejects.toThrow(
      "Failed to add pomodoro (400): Bad Request"
    );
  });

  it("throws an error when missing parameters", async () => {
    await expect(addPomodoro(null as any, "jwt")).rejects.toThrow(
      "addPomodoro requires a pomodoro object and a jwt"
    );
    await expect(addPomodoro({ name: "Test" }, null as any)).rejects.toThrow(
      "addPomodoro requires a pomodoro object and a jwt"
    );
  });
});
