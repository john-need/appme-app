import toIso  from "@/utils/to-iso";
import generateUUID from "@/utils/generate-uuid";

const timeEntryFactory = (data: Partial<TimeEntry> = {}): TimeEntry => {
  console.log("TIME ENTRY FACTORY DATA: ", data, "");
  const model = {
    id: typeof data.id === "string" ? data.id : generateUUID(),
    activityId: typeof data.activityId === "string"? data.activityId : "",
    minutes: typeof data.minutes === "number" ? data.minutes : 0,
    notes: typeof data.notes === "string" ? data.notes : "",
    created: toIso(data.created),
    updated: toIso(data.updated)
  };
  console.log("TIME ENTRY FACTORY MODEL: ", model, "");
  return model;
};

export default timeEntryFactory;
