import reducer, {
  setActivities,
  clearActivities,
  addActivity,
  updateActivity,
  removeActivity,
  selectActivities,
  selectActivityById,
  fetchActivitiesThunk,
} from "./activities-slice";

// Mock query client and data-layer call
jest.mock("@/api/query-client", () => {
  return {
    queryClient: {
      fetchQuery: jest.fn(),
      setQueryData: jest.fn(),
    },
  };
});

jest.mock("@/data-layer/fetch-activities", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { queryClient } from "@/api/query-client";
import fetchActivities from "@/data-layer/fetch-activities";

const a = (id: string, created: string): Activity => ({ id, name: id, type: "MUDA", created, updated: created });

describe("activities-slice reducers & selectors", () => {
  it("initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state.items).toEqual([]);
  });

  it("setActivities sorts most recent first", () => {
    const list = [a("1", "2024-01-01"), a("2", "2025-02-02")];
    const state = reducer(undefined, setActivities(list));
    expect(state.items.map((i) => i.id)).toEqual(["2", "1"]);
  });

  it("addActivity upserts and sorts", () => {
    const start = reducer(undefined, setActivities([a("1", "2024-01-01")]));
    const newer = a("1", "2026-03-03");
    const state = reducer(start, addActivity(newer));
    expect(state.items[0].id).toBe("1");
    expect(state.items[0].created).toBe("2026-03-03");
  });

  it("updateActivity replaces and sorts", () => {
    const start = reducer(undefined, setActivities([a("1", "2024-01-01"), a("2", "2025-02-02")]));
    const updated = a("1", "2027-05-05");
    const state = reducer(start, updateActivity(updated));
    expect(state.items[0].id).toBe("1");
  });

  it("removeActivity removes by id", () => {
    const start = reducer(undefined, setActivities([a("1", "2024-01-01"), a("2", "2025-02-02")]));
    const state = reducer(start, removeActivity("1"));
    expect(state.items.map((i) => i.id)).toEqual(["2"]);
  });

  it("clearActivities clears items", () => {
    const start = reducer(undefined, setActivities([a("1", "2024")]));
    const state = reducer(start, clearActivities());
    expect(state.items).toEqual([]);
  });

  it("selectors return items and by id", () => {
    const items = [a("1", "2024"), a("2", "2025")];
    const root: any = { activities: { items } };
    expect(selectActivities(root)).toEqual(items);
    expect(selectActivityById(root, "2")?.id).toBe("2");
    expect(selectActivityById(root, undefined)).toBeUndefined();
  });
});

describe("fetchActivitiesThunk", () => {
  const dispatch = jest.fn();
  const getState = () => ({ auth: { jwt: "JWT" } }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches setActivities on success and primes cache", async () => {
    (queryClient.fetchQuery as jest.Mock).mockResolvedValue([a("1", "2025-01-01")]);
    (fetchActivities as jest.Mock).mockResolvedValue([a("1", "2025-01-01")]);

    const thunk = fetchActivitiesThunk();
    const result = await (thunk as any)(dispatch, getState);

    expect(queryClient.fetchQuery).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: setActivities.type }));
    expect(queryClient.setQueryData).toHaveBeenCalled();
    expect(result).toEqual([a("1", "2025-01-01")]);
  });

  it("dispatches error notification and rethrows on failure", async () => {
    (queryClient.fetchQuery as jest.Mock).mockRejectedValue(new Error("boom"));
    (fetchActivities as jest.Mock).mockRejectedValue(new Error("boom"));

    const thunk = fetchActivitiesThunk();
    await expect((thunk as any)(dispatch, getState)).rejects.toThrow();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "notification/addNotification" }));
  });
});
