import { patchPomodoroEntry } from "./patch-pomodoro-entry";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";

jest.mock("@/utils/get-api-base", () => ({
  __esModule: true,
  default: () => "http://api.test",
}));

describe("patchPomodoroEntry", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("successfully patches a pomodoro entry and sets Authorization header", async () => {
    const jwt = "test-jwt";
    const pomodoroId = "p1";
    const pomodoroEntryId = "e1";
    const entryUpdates: Partial<PomodoroEntry> = {
      minutes: 30,
      notes: "Updated notes",
    };

    const responseData = {
      id: pomodoroEntryId,
      pomodoroId: pomodoroId,
      activityId: "a1",
      minutes: 30,
      notes: "Updated notes",
      entryType: "WORK_INTERVAL",
      created: "2023-01-01T10:00:00Z",
      updated: "2023-01-01T10:30:00Z",
    };

    g.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => responseData,
    });

    const result = await patchPomodoroEntry(jwt, pomodoroId, pomodoroEntryId, entryUpdates);

    expect(result).toEqual(pomodoroEntryFactory(responseData));
    expect(g.fetch).toHaveBeenCalledWith(
      `http://api.test/pomodoros/${pomodoroId}/entries/${pomodoroEntryId}`,
      expect.objectContaining({
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(entryUpdates),
      })
    );
  });

  it("throws an error when the API response is not OK", async () => {
    g.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(
      patchPomodoroEntry("jwt", "p1", "e1", { minutes: 10 })
    ).rejects.toThrow("Failed to patch pomodoro entry e1 (400): Bad Request");
  });

  it("throws an error when missing parameters", async () => {
    await expect(patchPomodoroEntry("", "p1", "e1", {})).rejects.toThrow(
      "patchPomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entryUpdates"
    );
    await expect(patchPomodoroEntry("jwt", "", "e1", {})).rejects.toThrow(
      "patchPomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entryUpdates"
    );
    await expect(patchPomodoroEntry("jwt", "p1", "", {})).rejects.toThrow(
      "patchPomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entryUpdates"
    );
    await expect(patchPomodoroEntry("jwt", "p1", "e1", null as any)).rejects.toThrow(
      "patchPomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entryUpdates"
    );
  });
});
