import toIso from "@/utils/to-iso";
import generateUUID from "@/utils/generate-uuid";

 const userFactory = (data: Partial<User> = {}): User => ({
  id: typeof data.id === "string" ? data.id : generateUUID(),
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
