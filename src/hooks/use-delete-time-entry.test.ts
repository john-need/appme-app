import { renderHook, act } from "@testing-library/react";
import useDeleteTimeEntry from "./use-delete-time-entry";

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

jest.mock("@/data-layer/delete-time-entry", () => ({ __esModule: true, default: jest.fn(async () => true) }));

jest.mock("@/features/time-entries/time-entries-slice", () => ({
  deleteTimeEntry: (id: string) => ({ type: "timeEntries/remove", payload: id }),
}));

describe("useDeleteTimeEntry", () => {
  beforeEach(() => {
    lastOptions = undefined;
    dispatch.mockClear();
  });

  it("dispatches delete on success", async () => {
    renderHook(() => useDeleteTimeEntry());
    await act(async () => {
      await lastOptions.onSuccess(true, "t1", undefined);
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "timeEntries/remove", payload: "t1" });
  });
});
