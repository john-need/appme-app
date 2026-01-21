import { renderHook, act } from "@testing-library/react";
import useAddPomodoro from "./use-add-pomodoro";

let lastOptions: any = undefined;
jest.mock("@tanstack/react-query", () => ({
  useMutation: (_fn: any, options: any) => {
    lastOptions = options;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return { mutate: (_: any) => void 0 } as any;
  },
}));

// Mock store to provide jwt and spy on dispatch
const mockStoreDispatch = jest.fn();
jest.mock("@/store/root-store", () => ({
  store: {
    getState: () => ({ auth: { jwt: "JWT" } }),
    dispatch: (action: any) => mockStoreDispatch(action),
  },
}));

// Mock normalization and data layer
jest.mock("@/factories/pomodoro-factory", () => ({ __esModule: true, default: (p: any) => ({ id: "p1", ...p }) }));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addQuery = jest.fn(async (pomodoro: any, jwt: string) => ({ id: "p1", ...pomodoro }));
jest.mock("@/data-layer/add-pomodoro", () => ({
  addPomodoro: (p: any, jwt: string) => addQuery(p, jwt),
}));

// Action creator mock
jest.mock("@/features/pomodoros/pomodoros-slice", () => ({
  addPomodoro: (payload: any) => ({ type: "pomodoros/addPomodoro", payload }),
}));

describe("useAddPomodoro", () => {
  beforeEach(() => {
    lastOptions = undefined;
    mockStoreDispatch.mockClear();
    addQuery.mockClear();
  });

  it("calls data layer with normalized input and jwt, and dispatches on success", async () => {
    renderHook(() => useAddPomodoro());
    
    const mockData = { id: "p1", name: "New Pomodoro", userId: "u1" };
    
    // Simulate successful mutation callback
    await act(async () => {
      await lastOptions.onSuccess(mockData, { pomodoro: { name: "New Pomodoro" } }, undefined);
    });

    expect(mockStoreDispatch).toHaveBeenCalledWith({
      type: "pomodoros/addPomodoro",
      payload: mockData,
    });
  });
});
