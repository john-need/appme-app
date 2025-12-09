import toIso from "@/utils/to-iso";

function getUuid(): string {
  try {
    if (typeof globalThis !== "undefined" && (globalThis as any).crypto && typeof (globalThis as any).crypto.randomUUID === "function") {
      return (globalThis as any).crypto.randomUUID();
    }
  } catch (e) {
    // ignore
  }
  // fallback: timestamp + random
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

interface UserInput {
  id?: string;
  email?: string;
  name?: string;
  startOfWeek?: "MONDAY" | "SUNDAY";
  timezone?: string;
  defaultView?: "WEEK" | "DAY";
  created?: string | number;
  updated?: string | number;
  roles?: string[];
}

const userFactory = (data: UserInput = {}): User => ({
  id: typeof data.id === "string" ? data.id : getUuid(),
  email: typeof data.email === "string" ? data.email : "",
  name: typeof data.name === "string" ? data.name : "",
  startOfWeek: data.startOfWeek === "MONDAY" || data.startOfWeek === "SUNDAY" ? data.startOfWeek : "MONDAY",
  timezone: typeof data.timezone === "string" ? data.timezone : "UTC",
  defaultView: data.defaultView === "WEEK" || data.defaultView === "DAY" ? data.defaultView : "WEEK",
  created: toIso(data.created),
  updated: toIso(data.updated),
  roles: (Array.isArray(data.roles) ? data.roles : ["USER"]) as Role[],
});

export default userFactory;
