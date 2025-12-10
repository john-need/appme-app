import { sortMostRecentFirst } from "./sort-by-created";

type Item = { id: string; created?: string };

describe("sortMostRecentFirst", () => {
  it("returns empty array for undefined or empty input", () => {
    expect(sortMostRecentFirst<Item>(undefined)).toEqual([]);
    expect(sortMostRecentFirst<Item>([])).toEqual([]);
  });

  it("sorts by created descending (most recent first)", () => {
    const items: Item[] = [
      { id: "a", created: "2023-01-01T00:00:00.000Z" },
      { id: "b", created: "2025-06-15T12:00:00.000Z" },
      { id: "c", created: "2024-03-10T08:00:00.000Z" },
    ];
    const sorted = sortMostRecentFirst(items);
    expect(sorted.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });

  it("treats missing created as epoch (sorts last)", () => {
    const items: Item[] = [
      { id: "with", created: "2020-01-01T00:00:00.000Z" },
      { id: "missing" },
    ];
    const sorted = sortMostRecentFirst(items);
    expect(sorted[0].id).toBe("with");
    expect(sorted[1].id).toBe("missing");
  });
});
