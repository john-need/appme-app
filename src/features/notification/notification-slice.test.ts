import reducer, { addNotification, removeNotification, clearNotifications } from "./notification-slice";

describe("notification-slice", () => {
  it("should return initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state.list).toEqual([]);
  });

  it("adds a notification", () => {
    const notif = { id: "1", message: "Hello", severity: "info" as const };
    const state = reducer(undefined, addNotification(notif));
    expect(state.list).toEqual([notif]);
  });

  it("removes a notification by id", () => {
    const notif = { id: "1", message: "Hello" };
    const start = { list: [notif, { id: "2", message: "Other" }] };
    const state = reducer(start as any, removeNotification("1"));
    expect(state.list.map((n) => n.id)).toEqual(["2"]);
  });

  it("clears notifications", () => {
    const start = { list: [{ id: "1", message: "x" }] };
    const state = reducer(start as any, clearNotifications());
    expect(state.list).toEqual([]);
  });
});
