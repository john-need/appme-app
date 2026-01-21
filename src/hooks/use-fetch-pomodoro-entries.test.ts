import { renderHook, waitFor } from "@testing-library/react";
import { useFetchPomodoroEntries } from "./use-fetch-pomodoro-entries";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks";
import { fetchPomodoroEntriesThunk } from "@/features/pomodoros/pomodoros-slice";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@/hooks", () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock("@/features/pomodoros/pomodoros-slice", () => ({
  fetchPomodoroEntriesThunk: jest.fn(),
}));

describe("useFetchPomodoroEntries", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it("calls useQuery with correct queryKey and enabled status", () => {
    (useQuery as jest.Mock).mockReturnValue({});

    renderHook(() => useFetchPomodoroEntries("p1"));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ["pomodoros", "p1", "entries"],
      enabled: true,
    }));
  });

  it("is disabled if pomodoroId is empty", () => {
    (useQuery as jest.Mock).mockReturnValue({});

    renderHook(() => useFetchPomodoroEntries(""));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining({
      enabled: false,
    }));
  });

  it("queryFn calls dispatch with fetchPomodoroEntriesThunk", async () => {
    let capturedQueryFn: any;
    (useQuery as jest.Mock).mockImplementation((options) => {
      capturedQueryFn = options.queryFn;
      return {};
    });

    renderHook(() => useFetchPomodoroEntries("p1"));

    const mockEntries = [{ id: "e1" }];
    mockDispatch.mockResolvedValue(mockEntries);
    (fetchPomodoroEntriesThunk as jest.Mock).mockReturnValue("mock-thunk");

    const result = await capturedQueryFn();

    expect(fetchPomodoroEntriesThunk).toHaveBeenCalledWith("p1");
    expect(mockDispatch).toHaveBeenCalledWith("mock-thunk");
    expect(result).toEqual(mockEntries);
  });
});
