import { renderHook, act } from "@testing-library/react";
import useDeleteActivity from "./use-delete-activity";

let lastOptions: any = undefined;
jest.mock("@tanstack/react-query", () => ({
  useMutation: (_fn: any, options: any) => {
    lastOptions = options;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return { mutate: (_: any) => void 0 } as any;
  },
}));

const dispatch = jest.fn();
jest.mock("./index", () => ({ useAppDispatch: () => dispatch }));

jest.mock("@/store/root-store", () => ({ store: { getState: () => ({ auth: { jwt: "JWT" } }) } }));

jest.mock("@/data-layer/delete-activity", () => ({ __esModule: true, default: jest.fn(async () => true) }));

jest.mock("@/features/activities/activities-slice", () => ({
  removeActivity: (id: string) => ({ type: "activities/remove", payload: id }),
}));

describe("useDeleteActivity", () => {
  beforeEach(() => {
    lastOptions = undefined;
    dispatch.mockClear();
  });

  it("dispatches remove on success", async () => {
    renderHook(() => useDeleteActivity());
    await act(async () => {
      await lastOptions.onSuccess(true, "a1", undefined);
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "activities/remove", payload: "a1" });
  });
});
