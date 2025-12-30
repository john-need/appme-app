import toIso  from "@/utils/to-iso";
import generateUUID from "@/utils/generate-uuid";

const timeEntryFactory = (data: Partial<TimeEntry> = {}): TimeEntry => {
  const { id, activityId, minutes, notes, created, updated } = data;

  const entry = {
    id: typeof id === "string" ? id : generateUUID(),
    activityId: typeof activityId === "string" ? activityId : "",
    minutes: typeof minutes === "number" ? minutes : 0,
    notes: typeof notes === "string" ? notes : "",
    created: toIso(created),
    updated: toIso(updated),
  };
  console.log("Entry:", entry);
  return entry;
};

export default timeEntryFactory;
