import { fetchPomodoroEntries, fetchPomodoroEntryById } from "./fetch-pomodoro-entries";

jest.mock("@/utils/get-api-base", () => ({
  __esModule: true,
  default: () => "http://api.test",
}));

describe("fetchPomodoroEntries", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("successfully fetches pomodoro entries and sets Authorization header", async () => {
    const responseData = [
      { id: "e1", pomodoroId: "p1", minutes: 25, entryType: "WORK_INTERVAL", created: "2023-01-01T10:00:00Z" },
      { id: "e2", pomodoroId: "p1", minutes: 5, entryType: "SHORT_BREAK", created: "2023-01-01T10:30:00Z" },
    ];

    g.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => responseData,
    });

    const result = await fetchPomodoroEntries("jwt-token", "p1");

    expect(result).toEqual(responseData.map(entry => expect.objectContaining({
      ...entry,
      created: expect.any(String),
      updated: expect.any(String),
    })));
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/pomodoros/p1/entries",
      expect.objectContaining({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer jwt-token",
        },
      })
    );
  });

  it("returns an empty array on 404", async () => {
    g.fetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await fetchPomodoroEntries("jwt", "p1");
    expect(result).toEqual([]);
  });

  it("throws an error when the API response is not OK", async () => {
    g.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(fetchPomodoroEntries("jwt", "p1")).rejects.toThrow(
      "Failed to fetch pomodoro entries (500): Internal Server Error"
    );
  });

  it("throws an error if pomodoroId is missing", async () => {
    await expect(fetchPomodoroEntries("jwt", "")).rejects.toThrow(
      "fetchPomodoroEntries requires a pomodoroId"
    );
  });
});

describe("fetchPomodoroEntryById", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("successfully fetches a pomodoro entry by id", async () => {
    const responseData = {
      id: "e1",
      pomodoroId: "p1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2023-01-01T10:00:00Z",
    };

    g.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => responseData,
    });

    const result = await fetchPomodoroEntryById("jwt-token", "p1", "e1");

    expect(result).toEqual(expect.objectContaining({
      ...responseData,
      created: expect.any(String),
      updated: expect.any(String),
    }));
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/pomodoros/p1/entries/e1",
      expect.objectContaining({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer jwt-token",
        },
      })
    );
  });

  it("returns null on 404", async () => {
    g.fetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await fetchPomodoroEntryById("jwt", "p1", "e1");
    expect(result).toBeNull();
  });

  it("throws an error when the API response is not OK", async () => {
    g.fetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => "Forbidden",
    });

    await expect(fetchPomodoroEntryById("jwt", "p1", "e1")).rejects.toThrow(
      "Failed to fetch pomodoro entry e1 (403): Forbidden"
    );
  });

  it("throws an error if parameters are missing", async () => {
    await expect(fetchPomodoroEntryById("jwt", "", "e1")).rejects.toThrow(
      "fetchPomodoroEntryById requires pomodoroId and pomodoroEntryId"
    );
    await expect(fetchPomodoroEntryById("jwt", "p1", "")).rejects.toThrow(
      "fetchPomodoroEntryById requires pomodoroId and pomodoroEntryId"
    );
  });
});
