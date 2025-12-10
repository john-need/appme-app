import { renderHook, act } from "@testing-library/react";
import useUpdateTimeEntry from "./use-update-time-entry";

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

jest.mock("@/data-layer/patch-time-entry", () => ({ __esModule: true, default: jest.fn(async () => ({ id: "t1", start: 1, end: 2 })) }));

jest.mock("@/features/time-entries/time-entries-slice", () => ({
  updateTimeEntry: (payload: any) => ({ type: "timeEntries/update", payload }),
}));

describe("useUpdateTimeEntry", () => {
  beforeEach(() => {
    lastOptions = undefined;
    dispatch.mockClear();
  });

  it("dispatches update on success", async () => {
    renderHook(() => useUpdateTimeEntry());
    await act(async () => {
      await lastOptions.onSuccess({ id: "t1", start: 1, end: 3 }, { id: "t1" }, undefined);
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "timeEntries/update", payload: { id: "t1", start: 1, end: 3 } });
  });
});
