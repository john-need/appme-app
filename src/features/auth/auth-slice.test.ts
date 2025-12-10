import reducer, { setCredentials, clearCredentials, setUser, setJwt, type AuthUser } from "./auth-slice";

describe("auth-slice reducers", () => {
  const baseUser: AuthUser = { id: "u1", name: "Jane", email: "j@e.com" };

  it("returns initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state).toEqual({ jwt: null, user: null, isAuthenticated: false });
  });

  it("setCredentials sets jwt, user and isAuthenticated", () => {
    const state = reducer(undefined, setCredentials({ jwt: "t", user: baseUser }));
    expect(state.jwt).toBe("t");
    expect(state.user).toEqual(baseUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("clearCredentials resets state", () => {
    const start = reducer(undefined, setCredentials({ jwt: "t", user: baseUser }));
    const state = reducer(start, clearCredentials());
    expect(state).toEqual({ jwt: null, user: null, isAuthenticated: false });
  });

  it("setUser toggles isAuthenticated based on jwt presence", () => {
    // no jwt -> false
    let state = reducer(undefined, setUser(baseUser));
    expect(state.isAuthenticated).toBe(false);
    // with jwt -> true
    state = reducer({ jwt: "t", user: null, isAuthenticated: false }, setUser(baseUser));
    expect(state.isAuthenticated).toBe(true);
  });

  it("setJwt toggles isAuthenticated based on user presence", () => {
    // no user -> false
    let state = reducer(undefined, setJwt("t"));
    expect(state.isAuthenticated).toBe(false);
    // with user -> true
    state = reducer({ jwt: null, user: baseUser, isAuthenticated: false }, setJwt("t"));
    expect(state.isAuthenticated).toBe(true);
  });
});
