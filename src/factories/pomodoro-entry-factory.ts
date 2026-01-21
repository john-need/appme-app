import generateUUID from "@/utils/generate-uuid";
import toIso from "@/utils/to-iso";

const pomodoroEntryFactory = (data: Record<string, unknown> = {}): PomodoroEntry => {
    const minutes = Number(data.minutes);
    return {
        id: typeof data.id === "string" ? data.id as string : generateUUID(),
        activityId: typeof data.activityId === "string" ? data.activityId : "",
        pomodoroId: typeof data.pomodoroId === "string" ? data.pomodoroId : "",
        minutes: isNaN(minutes) ? 0 : Math.floor(minutes),
        notes: typeof data.notes === "string" ? data.notes : "",
        entryType: (typeof data.entryType === "string" ? data.entryType : "WORK_INTERVAL") as PomodoroEntryType,
        created: toIso(data.created),
        updated: toIso(data.updated)
    };
};

export default pomodoroEntryFactory;
