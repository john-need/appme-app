import { renderHook, act } from "@testing-library/react";
import { useLogin } from "./use-login";

// Capture the options passed to useMutation
let lastOptions: any = undefined;
let providedMutation: any = undefined;
jest.mock("@tanstack/react-query", () => ({
  useMutation: (_fn: any, options: any) => {
    lastOptions = options;
    providedMutation = {
      mutate: (vars: any) => {
        // The hook's onSuccess/onError are driven by tests manually
        return vars;
      },
      isLoading: false,
    };
    return providedMutation;
  },
}));

// Mock dispatch
const dispatch = jest.fn();
jest.mock("./index", () => ({
  useAppDispatch: () => dispatch,
}));

// Mock action creators and thunks to identifiable actions
const setCredentialsAction = (payload: any) => ({ type: "auth/setCredentials", payload });
jest.mock("@/features/auth/auth-slice", () => ({
  setCredentials: (payload: any) => ({ type: "auth/setCredentials", payload }),
}));
jest.mock("@/features/notification/notification-slice", () => ({
  addNotification: (payload: any) => ({ type: "notification/add", payload }),
}));
jest.mock("@/features/activities/activities-slice", () => ({
  fetchActivitiesThunk: () => ({ type: "activities/fetch" }),
}));
jest.mock("@/features/time-entries/time-entries-slice", () => ({
  fetchTimeEntriesThunk: () => ({ type: "timeEntries/fetch" }),
}));

describe("useLogin", () => {
  beforeEach(() => {
    dispatch.mockClear();
    lastOptions = undefined;
    providedMutation = undefined;
  });

  it("dispatches credentials and fetch thunks on success with user", () => {
     renderHook(() => useLogin());

    act(() => {
      // Simulate onSuccess from react-query with user and token
      lastOptions.onSuccess({ token: "jwt", user: { id: "u1", name: "N", email: "e@x", startOfWeek: "MONDAY", defaultView: "DAY" } });
    });

    // First dispatch is setCredentials
    expect(dispatch).toHaveBeenCalledWith(setCredentialsAction({ jwt: "jwt", user: expect.objectContaining({ id: "u1" }) }));
    // Also dispatches fetch thunks
    expect(dispatch).toHaveBeenCalledWith({ type: "activities/fetch" });
    expect(dispatch).toHaveBeenCalledWith({ type: "timeEntries/fetch" });
  });

  it("clears auth when no user returned", () => {
    renderHook(() => useLogin());
    act(() => {
      lastOptions.onSuccess({ token: "t", user: null });
    });
    expect(dispatch).toHaveBeenCalledWith(setCredentialsAction({ jwt: "", user: null }));
  });

  it("dispatches notification on error", () => {
    renderHook(() => useLogin());
    act(() => {
      lastOptions.onError(new Error("boom"));
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "notification/add", payload: expect.objectContaining({ message: "boom", severity: "error" }) });
  });
});
