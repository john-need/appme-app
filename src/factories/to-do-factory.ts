import dayjs from "dayjs";
import toIso from "@/utils/to-iso";
import generateUUID from "@/utils/generate-uuid";
import isValidOccurrence from "@/utils/is-valid-occurrence";

const toDoFactory = (data: ToDo | Partial<ToDo> | Record<string, unknown> = {}): ToDo => {

  return {
    id: typeof data.id === "string" ? data.id : generateUUID(),
    activityId: typeof data.activityId === "string" ? data.activityId : undefined,
    comment: typeof data.comment === "string" ? data.comment : undefined,
    completions: Array.isArray(data.completions)
      ? data.completions.filter((c: unknown) => {
        return (typeof c === "string");
      })
      : [],
    created: toIso(data.created),
    goalId: typeof data.goalId === "string" ? data.goalId : undefined,
    occurrences: Array.isArray(data.occurrences)
      ? data.occurrences.filter(isValidOccurrence)
      : [],
    reminder: typeof data.reminder === "number" ? data.reminder : (data.reminder ? Number(data.reminder) : undefined),
    text: typeof data.text === "string" ? data.text : "",
    time: typeof data.time === "string" ? data.time : undefined,
    updated: toIso(data.updated),
    userId: typeof data.userId === "string" ? data.userId : "",
    startsOn: dayjs(data.startsOn as string | number | Date).format("YYYY-MM-DD"),
    endsOn: data.endsOn ? toIso(data.endsOn) : undefined,
  };
};

export default toDoFactory;
