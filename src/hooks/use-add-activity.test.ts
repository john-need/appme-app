import { renderHook, act } from "@testing-library/react";
import useAddActivity from "./use-add-activity";

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
jest.mock("@/factories/activity-factory", () => ({ __esModule: true, default: (a: any) => ({ id: "a1", ...a }) }));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addQuery = jest.fn(async (_activity: any, _jwt?: string) => ({ id: "a1", name: "N", type: "CARDIO" }));
jest.mock("@/data-layer/add-activity", () => ({ __esModule: true, default: (a: any, jwt?: string) => addQuery(a, jwt) }));

// Action creator recognizable
jest.mock("@/features/activities/activities-slice", () => ({
  addActivity: (payload: any) => ({ type: "activities/add", payload }),
}));

describe("useAddActivity", () => {
  beforeEach(() => {
    lastOptions = undefined;
    mockStoreDispatch.mockClear();
    addQuery.mockClear();
  });

  it("calls data layer with normalized input and jwt, dispatches on success", async () => {
    renderHook(() => useAddActivity());
    // Simulate successful mutation
    await act(async () => {
      await lastOptions.onSuccess({ id: "a1", name: "N", type: "CARDIO" }, { activity: { name: "N" } }, undefined);
    });
    expect(mockStoreDispatch).toHaveBeenCalledWith({ type: "activities/add", payload: { id: "a1", name: "N", type: "CARDIO" } });
  });
});
