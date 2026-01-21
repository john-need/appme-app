import generateUUID from "@/utils/generate-uuid";
import toIso from "@/utils/to-iso";
import pomodoroEntryFactory from "@/factories/pomodoro-entry-factory";

const pomodoroFactory = (data: Partial<Pomodoro> | Record<string, unknown> = {}): Pomodoro => {
  const d = data as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : generateUUID(),
    userId: typeof d.userId === "string" ? d.userId : "",
    name: typeof d.name === "string" ? d.name : "",
    notes: typeof d.notes === "string" ? d.notes : "",
    activityId: typeof d.activityId === "string" ? d.activityId : "",
    created: toIso(d.created),
    updated: toIso(d.updated),
    entries: (Array.isArray(d.entries) ? d.entries : []).map((entryData: unknown) => pomodoroEntryFactory(entryData as Record<string, unknown>)),
  };
};

export default pomodoroFactory;
