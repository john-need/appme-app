import { fetchPomodoros, fetchPomodoroById } from "./fetch-pomodoros";
import pomodoroFactory from "@/factories/pomodoro-factory";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

describe("fetch-pomodoro", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
    jest.useFakeTimers().setSystemTime(new Date("2023-01-01T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("fetchPomodoros", () => {
    it("returns pomodoros on success and sets auth header", async () => {
      const body = [{ id: "p1", name: "Pomodoro 1" }];
      g.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => body,
      });

      const res = await fetchPomodoros("jwt123");
      expect(res).toEqual(body.map(pomodoroFactory));
      expect(g.fetch).toHaveBeenCalledWith(
        "http://api.test/pomodoros",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer jwt123",
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("returns empty array on 404", async () => {
      g.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => [],
        text: async () => "Not Found",
      });

      const res = await fetchPomodoros("jwt123");
      expect(res).toEqual([]);
    });

    it("throws error if response is not ok", async () => {
      g.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "Internal Server Error",
      });

      await expect(fetchPomodoros("jwt123")).rejects.toThrow(
        "Failed to fetch pomodoros (500): Internal Server Error"
      );
    });

    it("throws error if response is not an array", async () => {
      g.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "p1" }),
      });

      await expect(fetchPomodoros("jwt123")).rejects.toThrow(
        "Invalid pomodoros response: expected an array"
      );
    });
  });

  describe("fetchPomodoroById", () => {
    it("returns pomodoro on success and sets auth header", async () => {
      const body = { id: "p1", name: "Pomodoro 1" };
      g.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => body,
      });

      const res = await fetchPomodoroById("jwt123", "p1");
      expect(res).toEqual(pomodoroFactory(body));
      expect(g.fetch).toHaveBeenCalledWith(
        "http://api.test/pomodoros/p1",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer jwt123",
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("returns null on 404", async () => {
      g.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => null,
        text: async () => "Not Found",
      });

      const res = await fetchPomodoroById("jwt123", "p1");
      expect(res).toBeNull();
    });

    it("throws error if response is not ok", async () => {
      g.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "Internal Server Error",
      });

      await expect(fetchPomodoroById("jwt123", "p1")).rejects.toThrow(
        "Failed to fetch pomodoro p1 (500): Internal Server Error"
      );
    });
  });
});
