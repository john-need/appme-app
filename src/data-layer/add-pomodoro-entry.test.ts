import { addPomodoroEntry } from "./add-pomodoro-entry";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";

jest.mock("@/utils/get-api-base", () => ({
  __esModule: true,
  default: () => "http://api.test",
}));

describe("addPomodoroEntry", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("successfully adds a pomodoro entry and sets Authorization header", async () => {
    const mockEntry: Partial<PomodoroEntry> = {
      pomodoroId: "p1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
    };
    const responseData = {
      id: "e1",
      ...mockEntry,
      created: "2023-01-01T00:00:00Z",
      updated: "2023-01-01T00:00:00Z",
    };

    g.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => responseData,
    });

    const result = await addPomodoroEntry("p1", mockEntry, "jwt-token");

    expect(result).toEqual(pomodoroEntryFactory(responseData));
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/pomodoros/p1/entries",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer jwt-token",
        },
        body: JSON.stringify(mockEntry),
      })
    );
  });

  it("throws an error when the API response is not OK", async () => {
    g.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(addPomodoroEntry("p1", { minutes: 25 }, "jwt")).rejects.toThrow(
      "Failed to add pomodoro entry (400): Bad Request"
    );
  });

  it("throws an error when missing parameters", async () => {
    await expect(addPomodoroEntry(null as any, { minutes: 25 }, "jwt")).rejects.toThrow(
      "addPomodoroEntry requires a pomodoroId, a pomodoro entry object and a jwt"
    );
    await expect(addPomodoroEntry("p1", null as any, "jwt")).rejects.toThrow(
      "addPomodoroEntry requires a pomodoroId, a pomodoro entry object and a jwt"
    );
    await expect(addPomodoroEntry("p1", { minutes: 25 }, null as any)).rejects.toThrow(
      "addPomodoroEntry requires a pomodoroId, a pomodoro entry object and a jwt"
    );
  });
});
