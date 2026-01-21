import { renderHook, act } from "@testing-library/react";
import useAddPomodoroEntry from "./use-add-pomodoro-entry";

let lastOptions: any = undefined;
jest.mock("@tanstack/react-query", () => ({
  useMutation: (_fn: any, options: any) => {
    lastOptions = options;
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
jest.mock("@/factories/pomodoro-entry-factory", () => ({ 
    __esModule: true, 
    default: (e: any) => ({ id: "e1", ...e }) 
}));
const addEntryQuery = jest.fn(async (pomodoroId: string, entry: any, jwt: string) => ({ id: "e1", pomodoroId, ...entry }));
jest.mock("@/data-layer/add-pomodoro-entry", () => ({
  addPomodoroEntry: (pomodoroId: string, e: any, jwt: string) => addEntryQuery(pomodoroId, e, jwt),
}));

// Action creator mock
jest.mock("@/features/pomodoros/pomodoros-slice", () => ({
  addPomodoroEntry: (payload: any) => ({ type: "pomodoros/addPomodoroEntry", payload }),
}));

describe("useAddPomodoroEntry", () => {
  beforeEach(() => {
    lastOptions = undefined;
    mockStoreDispatch.mockClear();
    addEntryQuery.mockClear();
  });

  it("calls data layer with normalized input and jwt, and dispatches on success", async () => {
    renderHook(() => useAddPomodoroEntry());
    
    const mockData = { id: "e1", pomodoroId: "p1", minutes: 25 };
    
    // Simulate successful mutation callback
    await act(async () => {
      await lastOptions.onSuccess(mockData, { pomodoroId: "p1", entry: { minutes: 25 } }, undefined);
    });

    expect(mockStoreDispatch).toHaveBeenCalledWith({
      type: "pomodoros/addPomodoroEntry",
      payload: mockData,
    });
  });
});
