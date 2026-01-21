import { updatePomodoroEntry } from "./update-pomodoro-entry";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";

jest.mock("@/utils/get-api-base", () => ({
  __esModule: true,
  default: () => "http://api.test",
}));

describe("updatePomodoroEntry", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("successfully updates a pomodoro entry and sets Authorization header", async () => {
    const jwt = "test-jwt";
    const pomodoroId = "p1";
    const pomodoroEntryId = "e1";
    const entry: PomodoroEntry = {
      id: pomodoroEntryId,
      pomodoroId: pomodoroId,
      activityId: "a1",
      minutes: 25,
      notes: "Some notes",
      entryType: "WORK_INTERVAL",
      created: "2023-01-01T10:00:00Z",
      updated: "2023-01-01T10:00:00Z",
    };

    const responseData = {
      ...entry,
      notes: "Updated notes",
      updated: "2023-01-01T10:30:00Z",
    };

    g.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => responseData,
    });

    const result = await updatePomodoroEntry(jwt, pomodoroId, pomodoroEntryId, { ...entry, notes: "Updated notes" });

    expect(result).toEqual(pomodoroEntryFactory(responseData));
    expect(g.fetch).toHaveBeenCalledWith(
      `http://api.test/pomodoros/${pomodoroId}/entries/${pomodoroEntryId}`,
      expect.objectContaining({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ ...entry, notes: "Updated notes" }),
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
      updatePomodoroEntry("jwt", "p1", "e1", {} as PomodoroEntry)
    ).rejects.toThrow("Failed to update pomodoro entry e1 (400): Bad Request");
  });

  it("throws an error when missing parameters", async () => {
    const validEntry = { id: "e1" } as PomodoroEntry;
    await expect(updatePomodoroEntry("", "p1", "e1", validEntry)).rejects.toThrow(
      "updatePomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entry"
    );
    await expect(updatePomodoroEntry("jwt", "", "e1", validEntry)).rejects.toThrow(
      "updatePomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entry"
    );
    await expect(updatePomodoroEntry("jwt", "p1", "", validEntry)).rejects.toThrow(
      "updatePomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entry"
    );
    await expect(updatePomodoroEntry("jwt", "p1", "e1", null as any)).rejects.toThrow(
      "updatePomodoroEntry requires jwt, pomodoroId, pomodoroEntryId, and entry"
    );
  });
});
