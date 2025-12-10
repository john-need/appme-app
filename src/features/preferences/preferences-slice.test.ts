import reducer, { setMode, toggleMode } from "./preferences-slice";

describe("preferences-slice", () => {
  it("returns initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state).toEqual({ mode: "light" });
  });

  it("setMode sets provided mode", () => {
    const state = reducer(undefined, setMode("dark"));
    expect(state.mode).toBe("dark");
  });

  it("toggleMode switches between light and dark", () => {
    let state = reducer({ mode: "light" }, toggleMode());
    expect(state.mode).toBe("dark");
    state = reducer({ mode: "dark" }, toggleMode());
    expect(state.mode).toBe("light");
  });
});
