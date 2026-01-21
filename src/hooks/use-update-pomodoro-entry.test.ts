import { renderHook, act } from "@testing-library/react";
import useUpdatePomodoroEntry from "./use-update-pomodoro-entry";

let lastOptions: any = undefined;
jest.mock("@tanstack/react-query", () => ({
  useMutation: (fn: any, options: any) => {
    lastOptions = options;
    return {
      mutate: (vars: any) => {
        return fn(vars).then((data: any) => {
          if (options?.onSuccess) options.onSuccess(data, vars, undefined);
          return data;
        });
      },
    } as any;
  },
}));

// Mock store and thunk
const mockStoreDispatch = jest.fn();
jest.mock("@/store/root-store", () => ({
  store: {
    dispatch: (action: any) => mockStoreDispatch(action),
  },
}));

jest.mock("@/features/pomodoros/pomodoros-slice", () => ({
  updatePomodoroEntryThunk: jest.fn((pomodoroId: string, entry: any) => ({
    type: "THUNK",
    pomodoroId,
    entry,
  })),
}));

// Mock factory
jest.mock("@/factories/pomodoro-entry-factory", () => ({
  __esModule: true,
  default: (data: any) => ({ ...data, normalized: true }),
}));

import { updatePomodoroEntryThunk } from "@/features/pomodoros/pomodoros-slice";

describe("useUpdatePomodoroEntry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastOptions = undefined;
  });

  it("calls updatePomodoroEntryThunk with normalized entry and dispatches it", async () => {
    const mockThunkResult = { id: "e1", normalized: true };
    mockStoreDispatch.mockResolvedValue(mockThunkResult);

    const { result } = renderHook(() => useUpdatePomodoroEntry());

    const inputEntry = { id: "e1", minutes: 25 } as any;
    const pomodoroId = "p1";

    let mutationResult;
    await act(async () => {
      mutationResult = await result.current.mutate({ pomodoroId, entry: inputEntry });
    });

    expect(updatePomodoroEntryThunk).toHaveBeenCalledWith(pomodoroId, expect.objectContaining({
      id: "e1",
      normalized: true
    }));
    expect(mockStoreDispatch).toHaveBeenCalledWith({
      type: "THUNK",
      pomodoroId,
      entry: expect.objectContaining({ id: "e1", normalized: true })
    });
    expect(mutationResult).toEqual(mockThunkResult);
  });
});
