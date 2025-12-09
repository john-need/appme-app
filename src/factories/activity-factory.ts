import toIso from "@/utils/to-iso";
import generateUUID from "@/utils/generate-uuid";

const activityFactory = (data: Partial<Activity>  = {}): Activity => ({
  id: typeof data.id === "string" ? data.id : generateUUID(),
  name: typeof data.name === "string" ? data.name : "",
  comment: typeof data.comment === "string" ? data.comment : "",
  goal: typeof data.goal === "number" ? data.goal : 0,
  type: data.type === "MUDA" || data.type === "TASSEI" ? data.type : "TASSEI",
  created: toIso(data.created),
  updated: toIso(data.updated),
  monday: typeof data.monday === "boolean" ? data.monday : false,
  tuesday: typeof data.tuesday === "boolean" ? data.tuesday : false,
  wednesday: typeof data.wednesday === "boolean" ? data.wednesday : false,
  thursday: typeof data.thursday === "boolean" ? data.thursday : false,
  friday: typeof data.friday === "boolean" ? data.friday : false,
  saturday: typeof data.saturday === "boolean" ? data.saturday : false,
  sunday: typeof data.sunday === "boolean" ? data.sunday : false,
  weekends: typeof data.weekends === "boolean" ? data.weekends : false
});

export default activityFactory;
