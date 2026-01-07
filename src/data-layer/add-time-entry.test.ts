import addTimeEntry from "./add-time-entry";

jest.mock("@/utils/get-api-base", () => ({ __esModule: true, default: () => "http://api.test" }));

import timeEntryFactory from "@/factories/time-entry-factory";

describe("add-time-entry", () => {
  const g = global as unknown as { fetch: jest.Mock };

  beforeEach(() => {
    g.fetch = jest.fn();
  });

  it("posts time entry and returns created entity; adds auth header when jwt provided", async () => {
    const created = timeEntryFactory({ id: "t1", minutes: 60 });
    g.fetch.mockResolvedValue({ ok: true, status: 201, json: async () => created });
    const body = { minutes: 60 } as Partial<TimeEntry>;
    const res = await addTimeEntry(body, "jwt-1");
    expect(res).toEqual(created as unknown);
    expect(g.fetch).toHaveBeenCalledWith(
      "http://api.test/time-entries",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json", Authorization: "Bearer jwt-1" }),
        body: JSON.stringify(body),
      })
    );
  });

  it("throws on non-ok with message", async () => {
    g.fetch.mockResolvedValue({ ok: false, status: 422, text: async () => "bad" });
    await expect(addTimeEntry({ minutes: 1 }, undefined)).rejects.toThrow(
      "Failed to add time entry (422): bad"
    );
  });
});
