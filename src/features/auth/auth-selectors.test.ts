import { selectAuthState, selectIsAuthenticated, selectCurrentUser, selectJwt } from "./auth-selectors";

describe("auth-selectors", () => {
  const baseUser = { id: "u1", name: "Jane", email: "j@e.com" };

  it("selectAuthState returns slice", () => {
    const state: any = { auth: { jwt: null, user: null, isAuthenticated: false } };
    expect(selectAuthState(state)).toEqual(state.auth);
  });

  it("selectIsAuthenticated returns boolean", () => {
    expect(selectIsAuthenticated({ auth: { isAuthenticated: false } } as any)).toBe(false);
    expect(selectIsAuthenticated({ auth: { isAuthenticated: true } } as any)).toBe(true);
  });

  it("selectCurrentUser returns user or null", () => {
    expect(selectCurrentUser({ auth: { user: null } } as any)).toBeNull();
    expect(selectCurrentUser({ auth: { user: baseUser } } as any)).toEqual(baseUser);
  });

  it("selectJwt returns token or null", () => {
    expect(selectJwt({ auth: { jwt: null } } as any)).toBeNull();
    expect(selectJwt({ auth: { jwt: "t" } } as any)).toBe("t");
  });
});
