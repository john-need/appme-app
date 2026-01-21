import { deletePomodoroEntry } from "./delete-pomodoro-entry";

jest.mock("@/utils/get-api-base", () => ({
  __esModule: true,
  default: () => "http://api.test",
}));

describe("deletePomodoroEntry", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("successfully deletes a pomodoro entry", async () => {
    g.fetch.mockResolvedValue({
      ok: true,
      status: 204,
    });

    await deletePomodoroEntry("jwt-token", "p1", "e1");

    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/pomodoros/p1/entries/e1",
      expect.objectContaining({
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer jwt-token",
        },
      })
    );
  });

  it("throws an error when the API response is not OK", async () => {
    g.fetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => "Forbidden",
    });

    await expect(deletePomodoroEntry("jwt", "p1", "e1")).rejects.toThrow(
      "Failed to delete pomodoro entry e1 (403): Forbidden"
    );
  });

  it("throws an error when missing parameters", async () => {
    await expect(deletePomodoroEntry("", "p1", "e1")).rejects.toThrow(
      "deletePomodoroEntry requires pomodoroId, pomodoroEntryId and jwt"
    );
    await expect(deletePomodoroEntry("jwt", "", "e1")).rejects.toThrow(
      "deletePomodoroEntry requires pomodoroId, pomodoroEntryId and jwt"
    );
    await expect(deletePomodoroEntry("jwt", "p1", "")).rejects.toThrow(
      "deletePomodoroEntry requires pomodoroId, pomodoroEntryId and jwt"
    );
  });
});
