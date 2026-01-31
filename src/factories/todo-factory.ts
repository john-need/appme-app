import toIso from "@/utils/to-iso";
import generateUUID from "@/utils/generate-uuid";

const todoFactory = (data: Record<string, unknown> = {}): ToDo => {

  return {
    id: typeof data.id === "string" ? data.id : generateUUID(),
    activityId: typeof data.activityId === "string" ? data.activityId : undefined,
    comment: typeof data.comment === "string" ? data.comment : undefined,
    completions: Array.isArray(data.completions)
      ? data.completions.map((c: unknown) => {
        if (typeof c === "string") {
          return c;
        }
        if (typeof c === "object" && c !== null) {
          const obj = c as Record<string, unknown>;
          return (obj.completed || obj.created || "") as string;
        }
        return "";
      })
      : [],
    created: toIso(data.created),
    goalId: typeof data.goalId === "string" ? data.goalId : undefined,
    occurrences: Array.isArray(data.occurrences)
      ? data.occurrences.map((o: unknown) => {
        if (typeof o === "string") {
          return o;
        }
        if (typeof o === "object" && o !== null) {
          const obj = o as Record<string, unknown>;
          return (obj.occurrence || "") as string;
        }
        return "";
      })
      : [],
    reminder: typeof data.reminder === "number" ? data.reminder : (data.reminder ? Number(data.reminder) : undefined),
    text: typeof data.text === "string" ? data.text : "",
    time: typeof data.time === "string" ? data.time : undefined,
    updated: toIso(data.updated),
    userId: typeof data.userId === "string" ? data.userId : "",
    startsOn: toIso(data.startsOn),
    endsOn: data.endsOn ? toIso(data.endsOn) : undefined,
  };
};

export default todoFactory;
