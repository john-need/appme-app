import { renderHook, act } from "@testing-library/react";
import useUpdateActivity from "./use-update-activity";

let lastOptions: any = undefined;
jest.mock("@tanstack/react-query", () => ({
  useMutation: (_fn: any, options: any) => {
    lastOptions = options;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return { mutate: (_: any) => void 0 } as any;
  },
}));

// Mock dispatch from hooks index
const dispatch = jest.fn();
jest.mock("./index", () => ({
  useAppDispatch: () => dispatch,
}));

jest.mock("@/store/root-store", () => ({
  store: { getState: () => ({ auth: { jwt: "JWT" } }) },
}));

jest.mock("@/data-layer/patch-activity", () => ({ __esModule: true, default: jest.fn(async () => ({ id: "a1", name: "X", type: "CARDIO" })) }));

jest.mock("@/features/activities/activities-slice", () => ({
  updateActivity: (payload: any) => ({ type: "activities/update", payload }),
}));

describe("useUpdateActivity", () => {
  beforeEach(() => {
    lastOptions = undefined;
    dispatch.mockClear();
  });

  it("dispatches update on success", async () => {
    renderHook(() => useUpdateActivity());
    await act(async () => {
      await lastOptions.onSuccess({ id: "a1", name: "X", type: "CARDIO" }, { id: "a1" }, undefined);
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "activities/update", payload: { id: "a1", name: "X", type: "CARDIO" } });
  });
});
