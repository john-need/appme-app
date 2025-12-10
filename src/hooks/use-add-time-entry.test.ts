import { renderHook, act } from "@testing-library/react";
import useAddTimeEntry from "./use-add-time-entry";

let lastOptions: any = undefined;
jest.mock("@tanstack/react-query", () => ({
  useMutation: (_fn: any, options: any) => {
    lastOptions = options;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return { mutate: (_: any) => void 0 } as any;
  },
}));

const mockStoreDispatch = jest.fn();
jest.mock("@/store/root-store", () => ({
  store: {
    getState: () => ({ auth: { jwt: "JWT" } }),
    dispatch: (action: any) => mockStoreDispatch(action),
  },
}));

jest.mock("@/factories/time-entry-factory", () => ({ __esModule: true, default: (t: any) => ({ id: "t1", ...t }) }));
jest.mock("@/data-layer/add-time-entry", () => ({ __esModule: true, default: jest.fn(async () => ({ id: "t1", start: 1, end: 2 })) }));

jest.mock("@/features/time-entries/time-entries-slice", () => ({
  addTimeEntry: (payload: any) => ({ type: "timeEntries/add", payload }),
}));

describe("useAddTimeEntry", () => {
  beforeEach(() => {
    lastOptions = undefined;
    mockStoreDispatch.mockClear();
  });

  it("dispatches add on success", async () => {
    renderHook(() => useAddTimeEntry());
    await act(async () => {
      await lastOptions.onSuccess({ id: "t1", start: 1, end: 2 }, { timeEntry: { start: 1 } }, undefined);
    });
    expect(mockStoreDispatch).toHaveBeenCalledWith({ type: "timeEntries/add", payload: { id: "t1", start: 1, end: 2 } });
  });
});
