import reducer, {
  setPomodoros,
  clearPomodoros,
  addPomodoro,
  updatePomodoro,
  deletePomodoro,
  selectPomodoros,
  fetchPomodorosThunk,
} from "./pomodoros-slice";

// Mocks
jest.mock("@/api/query-client", () => ({
  queryClient: {
    fetchQuery: jest.fn(),
    setQueryData: jest.fn(),
    clear: jest.fn(),
  },
}));

jest.mock("@/data-layer/fetch-pomodoros", () => ({
  fetchPomodoros: jest.fn(),
}));

import { queryClient } from "@/api/query-client";
import { fetchPomodoros } from "@/data-layer/fetch-pomodoros";

const p = (id: string, created: string): Pomodoro => ({
  id,
  userId: "u1",
  name: "Pomodoro " + id,
  notes: "",
  activityId: "a1",
  entries: [],
  created,
  updated: created,
});

describe("pomodoros-slice reducers & selector", () => {
  it("initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state.items).toEqual([]);
  });

  it("setPomodoros sorts most recent first", () => {
    const state = reducer(undefined, setPomodoros([p("1", "2020"), p("2", "2025")]));
    expect(state.items.map((x) => x.id)).toEqual(["2", "1"]);
  });

  it("addPomodoro upserts and sorts", () => {
    const start = reducer(undefined, setPomodoros([p("1", "2020")]));
    const newer = p("1", "2030");
    const state = reducer(start, addPomodoro(newer));
    expect(state.items[0].id).toBe("1");
    expect(state.items[0].created).toBe("2030");
  });

  it("updatePomodoro replaces and sorts", () => {
    const start = reducer(undefined, setPomodoros([p("1", "2020"), p("2", "2024")]));
    const updated = p("1", "2026");
    const state = reducer(start, updatePomodoro(updated));
    expect(state.items[0].id).toBe("1");
    expect(state.items[0].created).toBe("2026");
  });

  it("deletePomodoro removes by id", () => {
    const start = reducer(undefined, setPomodoros([p("1", "2020"), p("2", "2024")]));
    const state = reducer(start, deletePomodoro("1"));
    expect(state.items.map((x) => x.id)).toEqual(["2"]);
  });

  it("clearPomodoros clears items", () => {
    const start = reducer(undefined, setPomodoros([p("1", "2020")]));
    const state = reducer(start, clearPomodoros());
    expect(state.items).toEqual([]);
  });

  it("selectPomodoros returns items list from root state", () => {
    const items = [p("1", "2020")];
    const root: any = { pomodoros: { items } };
    expect(selectPomodoros(root)).toEqual(items);
  });
});

describe("fetchPomodorosThunk", () => {
  const dispatch = jest.fn();
  const getState = () => ({ auth: { jwt: "jwt" } }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches setPomodoros on success and primes cache", async () => {
    (queryClient.fetchQuery as jest.Mock).mockResolvedValue([p("1", "2025-01-01")]);
    (fetchPomodoros as jest.Mock).mockResolvedValue([p("1", "2025-01-01")]);

    const thunk = fetchPomodorosThunk();
    const result = await (thunk as any)(dispatch, getState);

    expect(queryClient.fetchQuery).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: setPomodoros.type }));
    expect(queryClient.setQueryData).toHaveBeenCalled();
    expect(result).toEqual([p("1", "2025-01-01")]);
  });

  it("dispatches error notification and rethrows on failure", async () => {
    (queryClient.fetchQuery as jest.Mock).mockRejectedValue(new Error("boom"));
    (fetchPomodoros as jest.Mock).mockRejectedValue(new Error("boom"));

    const thunk = fetchPomodorosThunk();
    await expect((thunk as any)(dispatch, getState)).rejects.toThrow();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "notification/addNotification" }));
  });
});
