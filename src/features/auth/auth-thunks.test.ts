import { loginThunk } from "./auth-thunks";
import { setCredentials } from "./auth-slice";
import type { AnyAction } from "redux";

type Thunk = (dispatch: (action: AnyAction | Thunk) => Promise<unknown> | AnyAction) => Promise<unknown> | AnyAction;

const createMockStore = () => {
  const actions: AnyAction[] = [];
  const store: {
    getActions: () => AnyAction[];
    dispatch: (action: AnyAction | Thunk) => Promise<unknown> | AnyAction;
  } = {
    getActions: () => actions,
    dispatch: (action: AnyAction | Thunk) => {
      if (typeof action === "function") {
        // thunk
        // call the thunk with the store.dispatch
        return (action as Thunk)(store.dispatch);
      }
      actions.push(action as AnyAction);
      return action as AnyAction;
    }
  };
  return store;
};

describe("auth thunks", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("dispatches setCredentials on successful login", async () => {
    const fakeToken = "header." + Buffer.from(JSON.stringify({ id: "user-1" })).toString("base64") + ".sig";
    const fakeUser = { id: "user-1", email: "a@b.com", name: "A", startOfWeek: "MONDAY", timezone: "UTC", defaultView: "WEEK", created: new Date().toISOString(), updated: new Date().toISOString() };

    // define global.fetch as jest fn (jsdom may not polyfill fetch)
    // mock /auth then /users/:id
    const originalFetch = global.fetch;
    global.fetch = jest.fn((input: RequestInfo) => {
      const url = String(input);
      if (url.endsWith("/auth")) {
        return Promise.resolve({ ok: true, status: 200, json: async () => ({ token: fakeToken }), text: async () => JSON.stringify({ token: fakeToken }) });
      }
      if (url.includes("/users/")) {
        return Promise.resolve({ ok: true, status: 200, json: async () => (fakeUser), text: async () => JSON.stringify(fakeUser) });
      }
      return Promise.resolve({ ok: false, status: 404, json: async () => null, text: async () => "" });
    }) as unknown as typeof fetch;

    const store = createMockStore();
    // invoke thunk via the mock dispatch; cast dispatch to accept the specific thunk type
    await (store.dispatch as unknown as (thunk: ReturnType<typeof loginThunk>) => Promise<unknown>)(loginThunk("a@b.com", "pass"));

    const actions = store.getActions();
    expect(actions.some((a: AnyAction) => a.type === setCredentials.type)).toBe(true);
    // restore fetch
    global.fetch = originalFetch as unknown as typeof fetch;
  });

  it("dispatches notification on failed login", async () => {
    const originalFetch2 = global.fetch;
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 401, text: async () => "Bad creds" })) as unknown as typeof fetch;

    const store = createMockStore();
    await expect((store.dispatch as unknown as (thunk: ReturnType<typeof loginThunk>) => Promise<unknown>)(loginThunk("a@b.com", "bad"))).rejects.toThrow();
    const actions = store.getActions();
    expect(actions.some((a: AnyAction) => a.type === "notification/addNotification")).toBe(true);
    global.fetch = originalFetch2 as unknown as typeof fetch;
  });
});
