import reducer, {
  setPomodoros,
  clearPomodoros,
  addPomodoro,
  updatePomodoro,
  deletePomodoro,
  addPomodoroEntry,
  addActivePomodoroEntry,
  patchActivePomodoroEntry,
  deleteActivePomodoroEntry,
  updatePomodoroEntry,
  setPomodoroEntries,
  setActivePomodoro,
  updateActivePomodoro,
  patchActivePomodoro,
  editPomodoro,
  clearActivePomodoro,
  selectPomodoros,
  fetchPomodoroEntriesThunk,
  updatePomodoroEntryThunk,
  fetchPomodorosThunk,
  saveActivePomodoroThunk,
  addPomodoroThunk,
  addPomodoroEntryThunk,
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

jest.mock("@/data-layer/add-pomodoro", () => ({
  addPomodoro: jest.fn(),
}));

jest.mock("@/data-layer/add-pomodoro-entry", () => ({
  addPomodoroEntry: jest.fn(),
}));

jest.mock("@/data-layer/fetch-pomodoro-entries", () => ({
  fetchPomodoroEntries: jest.fn(),
}));

jest.mock("@/data-layer/update-pomodoro-entry", () => ({
  updatePomodoroEntry: jest.fn(),
}));

jest.mock("@/data-layer/patch-pomodoro", () => ({
  patchPomodoro: jest.fn(),
}));

import { queryClient } from "@/api/query-client";
import { fetchPomodoros } from "@/data-layer/fetch-pomodoros";
import { addPomodoro as addPomodoroApi } from "@/data-layer/add-pomodoro";
import { addPomodoroEntry as addPomodoroEntryApi } from "@/data-layer/add-pomodoro-entry";
import { updatePomodoroEntry as updatePomodoroEntryApi } from "@/data-layer/update-pomodoro-entry";
import { patchPomodoro as patchPomodoroApi } from "@/data-layer/patch-pomodoro";

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
  
  it("addPomodoroEntry adds entry to correct pomodoro", () => {
    const start = reducer(undefined, setPomodoros([p("1", "2020")]));
    const entry: PomodoroEntry = {
      id: "e1",
      pomodoroId: "1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2020-01-01T10:00:00Z",
      updated: "2020-01-01T10:00:00Z",
    };
    const state = reducer(start, addPomodoroEntry(entry));
    expect(state.items[0].entries).toHaveLength(1);
    expect(state.items[0].entries[0]).toEqual(entry);
  });
  
  it("addActivePomodoroEntry adds entry to activePomodoro if id matches", () => {
    const activePomodoro = p("1", "2020");
    const start = { items: [], activePomodoro };
    const entry: PomodoroEntry = {
      id: "e1",
      pomodoroId: "1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2020-01-01T10:00:00Z",
      updated: "2020-01-01T10:00:00Z",
    };
    const state = reducer(start, addActivePomodoroEntry(entry));
    expect(state.activePomodoro?.entries).toHaveLength(1);
    expect(state.activePomodoro?.entries[0]).toEqual(entry);
  });

  it("addActivePomodoroEntry does nothing if activePomodoro id does not match", () => {
    const activePomodoro = p("2", "2020");
    const start = { items: [], activePomodoro };
    const entry: PomodoroEntry = {
      id: "e1",
      pomodoroId: "1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2020-01-01T10:00:00Z",
      updated: "2020-01-01T10:00:00Z",
    };
    const state = reducer(start, addActivePomodoroEntry(entry));
    expect(state.activePomodoro?.entries).toHaveLength(0);
  });

  it("addActivePomodoroEntry does nothing if activePomodoro is null", () => {
    const start = { items: [], activePomodoro: null };
    const entry: PomodoroEntry = {
      id: "e1",
      pomodoroId: "1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2020-01-01T10:00:00Z",
      updated: "2020-01-01T10:00:00Z",
    };
    const state = reducer(start, addActivePomodoroEntry(entry));
    expect(state.activePomodoro).toBeNull();
  });

  it("patchActivePomodoroEntry patches entry in activePomodoro", () => {
    const entry: PomodoroEntry = {
      id: "e1",
      pomodoroId: "1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2020-01-01T10:00:00Z",
      updated: "2020-01-01T10:00:00Z",
    };
    const activePomodoro = { ...p("1", "2020"), entries: [entry] };
    const start = { items: [], activePomodoro };

    const patch = { id: "e1", minutes: 30 };
    const state = reducer(start, patchActivePomodoroEntry(patch));

    expect(state.activePomodoro?.entries[0].minutes).toBe(30);
    expect(state.activePomodoro?.entries[0].id).toBe("e1");
    expect(state.activePomodoro?.entries[0].activityId).toBe("a1");
  });

  it("patchActivePomodoroEntry does nothing if activePomodoro is null", () => {
    const start = { items: [], activePomodoro: null };
    const state = reducer(start, patchActivePomodoroEntry({ id: "e1", minutes: 30 }));
    expect(state.activePomodoro).toBeNull();
  });

  it("deleteActivePomodoroEntry deletes entry in activePomodoro", () => {
    const entry1: PomodoroEntry = {
      id: "e1",
      pomodoroId: "1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2020-01-01T10:00:00Z",
      updated: "2020-01-01T10:00:00Z",
    };
    const entry2: PomodoroEntry = {
      id: "e2",
      pomodoroId: "1",
      activityId: "a1",
      minutes: 5,
      entryType: "SHORT_BREAK",
      created: "2020-01-01T10:30:00Z",
      updated: "2020-01-01T10:30:00Z",
    };
    const activePomodoro = { ...p("1", "2020"), entries: [entry1, entry2] };
    const start = { items: [], activePomodoro };

    const state = reducer(start, deleteActivePomodoroEntry("e1"));

    expect(state.activePomodoro?.entries).toHaveLength(1);
    expect(state.activePomodoro?.entries[0].id).toBe("e2");
  });

  it("deleteActivePomodoroEntry does nothing if activePomodoro is null", () => {
    const start = { items: [], activePomodoro: null };
    const state = reducer(start, deleteActivePomodoroEntry("e1"));
    expect(state.activePomodoro).toBeNull();
  });

  it("updatePomodoroEntry updates entry in correct pomodoro", () => {
    const entry: PomodoroEntry = {
      id: "e1",
      pomodoroId: "1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2020-01-01T10:00:00Z",
      updated: "2020-01-01T10:00:00Z",
    };
    const start = reducer(undefined, setPomodoros([p("1", "2020")]));
    const stateWithEntry = reducer(start, addPomodoroEntry(entry));

    const updatedEntry = { ...entry, minutes: 30 };
    const finalState = reducer(stateWithEntry, updatePomodoroEntry(updatedEntry));

    expect(finalState.items[0].entries).toHaveLength(1);
    expect(finalState.items[0].entries[0].minutes).toBe(30);
  });

  it("setActivePomodoro sets the active pomodoro", () => {
    const pomodoro = p("1", "2020");
    const state = reducer(undefined, setActivePomodoro(pomodoro));
    expect(state.activePomodoro).toEqual(pomodoro);
  });

  it("setActivePomodoro can set active pomodoro to null", () => {
    const start = { items: [], activePomodoro: p("1", "2020") };
    const state = reducer(start, setActivePomodoro(null));
    expect(state.activePomodoro).toBeNull();
  });

  it("updateActivePomodoro replaces the active pomodoro", () => {
    const start = { items: [], activePomodoro: p("1", "2020") };
    const newer = p("2", "2025");
    const state = reducer(start, updateActivePomodoro(newer));
    expect(state.activePomodoro).toEqual(newer);
  });

  it("patchActivePomodoro patches the active pomodoro", () => {
    const start = { items: [], activePomodoro: p("1", "2020") };
    const updates = { name: "Updated Name" };
    const state = reducer(start, patchActivePomodoro(updates));
    expect(state.activePomodoro?.name).toBe("Updated Name");
    expect(state.activePomodoro?.id).toBe("1");
    expect(state.activePomodoro?.created).toBe("2020");
  });

  it("patchActivePomodoro does nothing if active pomodoro is null", () => {
    const start = { items: [], activePomodoro: null };
    const state = reducer(start, patchActivePomodoro({ name: "Oops" }));
    expect(state.activePomodoro).toBeNull();
  });

  it("editPomodoro copies the pomodoro from items to activePomodoro", () => {
    const target = p("2", "2025");
    const start = { items: [p("1", "2020"), target], activePomodoro: null };
    const state = reducer(start, editPomodoro("2"));
    expect(state.activePomodoro).toEqual(target);
    expect(state.activePomodoro).not.toBe(target); // Should be a copy
  });

  it("editPomodoro does nothing if id is not found", () => {
    const start = { items: [p("1", "2020")], activePomodoro: null };
    const state = reducer(start, editPomodoro("999"));
    expect(state.activePomodoro).toBeNull();
  });

  it("clearActivePomodoro sets activePomodoro to null", () => {
    const start = { items: [], activePomodoro: p("1", "2020") };
    const state = reducer(start, clearActivePomodoro());
    expect(state.activePomodoro).toBeNull();
  });

  it("setPomodoroEntries sets entries for specific pomodoro", () => {
    const start = reducer(undefined, setPomodoros([p("1", "2020")]));
    const entries: PomodoroEntry[] = [{
      id: "e1",
      pomodoroId: "1",
      activityId: "a1",
      minutes: 25,
      entryType: "WORK_INTERVAL",
      created: "2020-01-01T10:00:00Z",
      updated: "2020-01-01T10:00:00Z",
    }];
    const state = reducer(start, setPomodoroEntries({ pomodoroId: "1", entries }));
    expect(state.items[0].entries).toEqual(entries);
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

describe("fetchPomodoroEntriesThunk", () => {
  const dispatch = jest.fn();
  const getState = () => ({ auth: { jwt: "jwt" } }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches setPomodoroEntries on success", async () => {
    const mockEntries = [{ id: "e1", pomodoroId: "p1" }];
    (queryClient.fetchQuery as jest.Mock).mockResolvedValue(mockEntries);

    const thunk = fetchPomodoroEntriesThunk("p1");
    const result = await (thunk as any)(dispatch, getState);

    expect(queryClient.fetchQuery).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ["pomodoros", "p1", "entries"]
    }));
    expect(dispatch).toHaveBeenCalledWith(setPomodoroEntries({ pomodoroId: "p1", entries: mockEntries as any }));
    expect(result).toEqual(mockEntries);
  });

  it("dispatches error notification and rethrows on failure", async () => {
    (queryClient.fetchQuery as jest.Mock).mockRejectedValue(new Error("boom"));

    const thunk = fetchPomodoroEntriesThunk("p1");
    await expect((thunk as any)(dispatch, getState)).rejects.toThrow("boom");
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "notification/addNotification" }));
  });
});

describe("updatePomodoroEntryThunk", () => {
  const dispatch = jest.fn();
  const getState = () => ({ auth: { jwt: "jwt" } }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches updatePomodoroEntry on success", async () => {
    const mockEntry = { id: "e1", pomodoroId: "p1", minutes: 30 } as PomodoroEntry;
    (updatePomodoroEntryApi as jest.Mock).mockResolvedValue(mockEntry);

    const thunk = updatePomodoroEntryThunk("p1", mockEntry);
    const result = await (thunk as any)(dispatch, getState);

    expect(updatePomodoroEntryApi).toHaveBeenCalledWith("jwt", "p1", "e1", mockEntry);
    expect(dispatch).toHaveBeenCalledWith(updatePomodoroEntry(mockEntry));
    expect(result).toEqual(mockEntry);
  });

  it("dispatches error notification and rethrows on failure", async () => {
    (updatePomodoroEntryApi as jest.Mock).mockRejectedValue(new Error("boom"));

    const mockEntry = { id: "e1", pomodoroId: "p1" } as PomodoroEntry;
    const thunk = updatePomodoroEntryThunk("p1", mockEntry);
    await expect((thunk as any)(dispatch, getState)).rejects.toThrow("boom");
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "notification/addNotification" }));
  });
});

describe("saveActivePomodoroThunk", () => {
  const dispatch = jest.fn();
  const mockActivePomodoro = p("1", "2025");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches addPomodoro on success", async () => {
    const getState = () => ({
      auth: { jwt: "jwt" },
      pomodoros: { activePomodoro: mockActivePomodoro, items: [] }
    }) as any;

    (addPomodoroApi as jest.Mock).mockResolvedValue(mockActivePomodoro);

    const thunk = saveActivePomodoroThunk();
    const result = await (thunk as any)(dispatch, getState);

    expect(addPomodoroApi).toHaveBeenCalledWith(mockActivePomodoro, "jwt");
    expect(dispatch).toHaveBeenCalledWith(addPomodoro(mockActivePomodoro));
    expect(result).toEqual(mockActivePomodoro);
  });

  it("dispatches updatePomodoro when active pomodoro exists in items", async () => {
    const mockUser = { id: "u1", email: "test@test.com" };
    const getState = () => ({
      auth: { jwt: "jwt", user: mockUser },
      pomodoros: {
        activePomodoro: mockActivePomodoro,
        items: [mockActivePomodoro]
      }
    }) as any;

    (patchPomodoroApi as jest.Mock).mockResolvedValue(mockActivePomodoro);

    const thunk = saveActivePomodoroThunk();
    const result = await (thunk as any)(dispatch, getState);

    expect(patchPomodoroApi).toHaveBeenCalledWith(
      mockActivePomodoro,
      expect.objectContaining({ id: "u1", email: "test@test.com" }),
      "jwt"
    );
    expect(dispatch).toHaveBeenCalledWith(updatePomodoro(mockActivePomodoro));
    expect(result).toEqual(mockActivePomodoro);
  });

  it("throws error if no active pomodoro", async () => {
    const getState = () => ({
      auth: { jwt: "jwt" },
      pomodoros: { activePomodoro: null }
    }) as any;

    const thunk = saveActivePomodoroThunk();
    await expect((thunk as any)(dispatch, getState)).rejects.toThrow("No active pomodoro to save");
  });

  it("dispatches error notification and rethrows on failure", async () => {
    const getState = () => ({
      auth: { jwt: "jwt" },
      pomodoros: { activePomodoro: mockActivePomodoro, items: [] }
    }) as any;

    (addPomodoroApi as jest.Mock).mockRejectedValue(new Error("api error"));

    const thunk = saveActivePomodoroThunk();
    await expect((thunk as any)(dispatch, getState)).rejects.toThrow("api error");
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "notification/addNotification" }));
  });
});

describe("addPomodoroThunk", () => {
  const dispatch = jest.fn();
  const mockPomodoro = { name: "New Pomodoro" } as Partial<Pomodoro>;
  const mockResponse = { id: "p1", ...mockPomodoro } as Pomodoro;
  const getState = () => ({ auth: { jwt: "jwt" } }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches addPomodoro on success", async () => {
    (addPomodoroApi as jest.Mock).mockResolvedValue(mockResponse);

    const thunk = addPomodoroThunk(mockPomodoro);
    const result = await (thunk as any)(dispatch, getState);

    expect(addPomodoroApi).toHaveBeenCalledWith(expect.objectContaining({ name: "New Pomodoro" }), "jwt");
    expect(dispatch).toHaveBeenCalledWith(addPomodoro(mockResponse));
    expect(result).toEqual(mockResponse);
  });

  it("dispatches error notification and rethrows on failure", async () => {
    (addPomodoroApi as jest.Mock).mockRejectedValue(new Error("boom"));

    const thunk = addPomodoroThunk(mockPomodoro);
    await expect((thunk as any)(dispatch, getState)).rejects.toThrow("boom");
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "notification/addNotification" }));
  });
});

describe("addPomodoroEntryThunk", () => {
  const dispatch = jest.fn();
  const mockEntry = { minutes: 25 } as Partial<PomodoroEntry>;
  const mockResponse = { id: "e1", pomodoroId: "p1", ...mockEntry } as PomodoroEntry;
  const getState = () => ({ auth: { jwt: "jwt" } }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches addPomodoroEntry on success", async () => {
    (addPomodoroEntryApi as jest.Mock).mockResolvedValue(mockResponse);

    const thunk = addPomodoroEntryThunk("p1", mockEntry);
    const result = await (thunk as any)(dispatch, getState);

    expect(addPomodoroEntryApi).toHaveBeenCalledWith("p1", expect.objectContaining({ minutes: 25 }), "jwt");
    expect(dispatch).toHaveBeenCalledWith(addPomodoroEntry(mockResponse));
    expect(result).toEqual(mockResponse);
  });

  it("dispatches error notification and rethrows on failure", async () => {
    (addPomodoroEntryApi as jest.Mock).mockRejectedValue(new Error("boom"));

    const thunk = addPomodoroEntryThunk("p1", mockEntry);
    await expect((thunk as any)(dispatch, getState)).rejects.toThrow("boom");
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "notification/addNotification" }));
  });
});
