import { saveToLocalStorage, loadFromLocalStorage } from "./local-storage";

describe("local-storage utils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("saves and loads a value round-trip", () => {
    saveToLocalStorage("k1", { a: 1, b: "x" });
    const loaded = loadFromLocalStorage<{ a: number; b: string }>("k1");
    expect(loaded).toEqual({ a: 1, b: "x" });
  });

  it("returns undefined when key is missing", () => {
    const loaded = loadFromLocalStorage("missing");
    expect(loaded).toBeUndefined();
  });

  it("returns undefined on malformed JSON", () => {
    localStorage.setItem("bad", "not-json");
    const loaded = loadFromLocalStorage("bad");
    expect(loaded).toBeUndefined();
  });

  it("swallows setItem errors gracefully", () => {
    const spy = jest.spyOn(localStorage.__proto__, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => saveToLocalStorage("k2", { x: 2 })).not.toThrow();
    spy.mockRestore();
  });
});
