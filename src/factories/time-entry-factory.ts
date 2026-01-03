import toIso from "@/utils/to-iso";
import generateUUID from "@/utils/generate-uuid";

const timeEntryFactory = (data: Partial<TimeEntry> = {}): TimeEntry => {
 const minutes = Number(data.minutes);
  return {
    id: typeof data.id === "string" ? data.id : generateUUID(),
    activityId: typeof data.activityId === "string" ? data.activityId : "",
    minutes: isNaN(minutes) || minutes < 0 ? 0 : Math.round(minutes),
    notes: typeof data.notes === "string" ? data.notes : "",
    created: toIso(data.created),
    updated: toIso(data.updated)
  };
};

export default timeEntryFactory;
