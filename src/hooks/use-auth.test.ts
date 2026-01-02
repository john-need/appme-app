import { renderHook, act } from "@testing-library/react";
import { useAuth, useIsAuthenticated, useCurrentUser, useJwt } from "./use-auth";
import { isJwtValid } from "@/utils/jwt";

// Mock jwt utility
jest.mock("@/utils/jwt", () => ({
  isJwtValid: jest.fn(),
}));

// Mock hooks index to control dispatch/selector
const mockDispatch = jest.fn();
const mockSelector = jest.fn();
jest.mock("./index", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (fn: any) => mockSelector(fn),
}));

describe("use-auth hooks", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockSelector.mockReset();
    (isJwtValid as jest.Mock).mockReturnValue(true);
  });

  it("returns auth slice and action wrappers", () => {
    mockSelector.mockImplementation((fn: any) => fn({ auth: { isAuthenticated: true, user: { id: "u1" }, jwt: "t" } }));
    const { result } = renderHook(() => useAuth());
    expect(result.current.auth).toEqual({ isAuthenticated: true, user: { id: "u1" }, jwt: "t" });

    act(() => {
      result.current.login("jwt", { id: "u1" } as any);
      result.current.logout();
      result.current.updateJwt("jwt2");
      result.current.updateUser({ id: "u2" } as any);
    });
    // Should dispatch 4 times + 0 from useEffect because token is valid
    expect(mockDispatch).toHaveBeenCalledTimes(4);
  });

  it("dispatches clearCredentials if JWT is invalid in useAuth", () => {
    (isJwtValid as jest.Mock).mockReturnValue(false);
    mockSelector.mockImplementation((fn: any) => fn({ auth: { isAuthenticated: true, user: { id: "u1" }, jwt: "expired-jwt" } }));
    
    renderHook(() => useAuth());
    
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "auth/clearCredentials" }));
  });

  it("selectors work: useIsAuthenticated/useCurrentUser/useJwt", () => {
    mockSelector.mockImplementation((fn: any) => fn({ auth: { isAuthenticated: false, user: null, jwt: null } }));
    const isAuth = renderHook(() => useIsAuthenticated()).result.current;
    const user = renderHook(() => useCurrentUser()).result.current;
    const jwt = renderHook(() => useJwt()).result.current;
    expect(isAuth).toBe(false);
    expect(user).toBeNull();
    expect(jwt).toBeNull();
  });

  it("selectors dispatch clearCredentials if JWT is invalid", () => {
    (isJwtValid as jest.Mock).mockReturnValue(false);
    mockSelector.mockImplementation((fn: any) => fn({ auth: { isAuthenticated: true, user: { id: "u1" }, jwt: "expired-jwt" } }));
    
    renderHook(() => useIsAuthenticated());
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "auth/clearCredentials" }));
    
    mockDispatch.mockClear();
    renderHook(() => useCurrentUser());
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "auth/clearCredentials" }));

    mockDispatch.mockClear();
    renderHook(() => useJwt());
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "auth/clearCredentials" }));
  });
});
