import {randomUUID} from "crypto";
import toIso  from "@/utils/to-iso";


type DBRow = Record<string, unknown>;

const timeEntryFactory = (data: Partial<TimeEntry> | DBRow = {}): TimeEntry => {
    const row = data as DBRow;
    return {
        id: typeof (data as Partial<TimeEntry>).id === "string" ? (data as Partial<TimeEntry>).id as string : randomUUID(),
        // support both camelCase and snake_case DB rows
        activityId: typeof (data as Partial<TimeEntry>).activityId === "string"
            ? (data as Partial<TimeEntry>).activityId as string
            : (typeof row.activity_id === "string" ? row.activity_id as string : ""),
        date: typeof (data as Partial<TimeEntry>).date === "string" ? (data as Partial<TimeEntry>).date as string : toIso(new Date()).slice(0, 10),
        minutes: typeof (data as Partial<TimeEntry>).minutes === "number" ? (data as Partial<TimeEntry>).minutes as number : (typeof row.minutes === "number" ? row.minutes as number : 0),
        notes: typeof (data as Partial<TimeEntry>).notes === "string" ? (data as Partial<TimeEntry>).notes as string : (typeof row.notes === "string" ? row.notes as string : ""),
        created: toIso((data as Partial<TimeEntry>).created ?? row.created),
        updated: toIso((data as Partial<TimeEntry>).updated ?? row.updated)
    };
};

export default timeEntryFactory;
