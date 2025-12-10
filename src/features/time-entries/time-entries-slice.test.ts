import reducer, {
  setTimeEntries,
  clearTimeEntries,
  addTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  selectTimeEntries,
  fetchTimeEntriesThunk,
} from "./time-entries-slice";

// Mocks
jest.mock("@/api/query-client", () => ({
  queryClient: {
    fetchQuery: jest.fn(),
    setQueryData: jest.fn(),
    clear: jest.fn(),
  },
}));

jest.mock("@/data-layer/fetch-time-entries", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { queryClient } from "@/api/query-client";
import fetchTimeEntries from "@/data-layer/fetch-time-entries";

const t = (id: string, created: string): TimeEntry => ({ id, activityId: "a1", minutes: 30, created, updated: created });

describe("time-entries-slice reducers & selector", () => {
  it("initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state.items).toEqual([]);
  });

  it("setTimeEntries sorts most recent first", () => {
    const state = reducer(undefined, setTimeEntries([t("1", "2020"), t("2", "2025")]));
    expect(state.items.map((x) => x.id)).toEqual(["2", "1"]);
  });

  it("addTimeEntry upserts and sorts", () => {
    const start = reducer(undefined, setTimeEntries([t("1", "2020")]));
    const newer = t("1", "2030");
    const state = reducer(start, addTimeEntry(newer));
    expect(state.items[0].id).toBe("1");
    expect(state.items[0].created).toBe("2030");
  });

  it("updateTimeEntry replaces and sorts", () => {
    const start = reducer(undefined, setTimeEntries([t("1", "2020"), t("2", "2024")]));
    const updated = t("1", "2026");
    const state = reducer(start, updateTimeEntry(updated));
    expect(state.items[0].id).toBe("1");
  });

  it("deleteTimeEntry removes by id", () => {
    const start = reducer(undefined, setTimeEntries([t("1", "2020"), t("2", "2024")]));
    const state = reducer(start, deleteTimeEntry("1"));
    expect(state.items.map((x) => x.id)).toEqual(["2"]);
  });

  it("clearTimeEntries clears items", () => {
    const start = reducer(undefined, setTimeEntries([t("1", "2020")]));
    const state = reducer(start, clearTimeEntries());
    expect(state.items).toEqual([]);
  });

  it("selectTimeEntries returns items list from root state", () => {
    const items = [t("1", "2020")];
    const root: any = { timeEntries: { items } };
    expect(selectTimeEntries(root)).toEqual(items);
  });
});

describe("fetchTimeEntriesThunk", () => {
  const dispatch = jest.fn();
  const getState = () => ({ auth: { jwt: "jwt" } }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches setTimeEntries on success and primes cache", async () => {
    (queryClient.fetchQuery as jest.Mock).mockResolvedValue([t("1", "2025-01-01")]);
    (fetchTimeEntries as jest.Mock).mockResolvedValue([t("1", "2025-01-01")]);

    const thunk = fetchTimeEntriesThunk();
    const result = await (thunk as any)(dispatch, getState);

    expect(queryClient.fetchQuery).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: setTimeEntries.type }));
    expect(queryClient.setQueryData).toHaveBeenCalled();
    expect(result).toEqual([t("1", "2025-01-01")]);
  });

  it("dispatches error notification and rethrows on failure", async () => {
    (queryClient.fetchQuery as jest.Mock).mockRejectedValue(new Error("boom"));
    (fetchTimeEntries as jest.Mock).mockRejectedValue(new Error("boom"));

    const thunk = fetchTimeEntriesThunk();
    await expect((thunk as any)(dispatch, getState)).rejects.toThrow();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "notification/addNotification" }));
  });
});
