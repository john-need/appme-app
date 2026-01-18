export {};

declare global {

    export type ActivityType = "MUDA" | "TASSEI";
    export type Role = "ADMIN" | "USER";

    interface Activity {
      id: string;
      name: string;
      type: ActivityType;
      created: string;
      updated: string;
      comment?: string;
      goal?: number;
      monday:boolean;
      tuesday:boolean;
      wednesday:boolean;
      thursday:boolean;
      friday:boolean;
      saturday:boolean;
      sunday:boolean;
      weekends:boolean;
    }

    interface TimeEntry {
        activityId: string;
        created: string;
        id: string;
        minutes: number;
        notes?: string;
        updated: string;
    }

    interface User {
        id?: string;
        email: string;
        name: string;
        startOfWeek: "MONDAY" | "SUNDAY";
        timezone: string; // IANA
        defaultView: "WEEK" | "DAY";
        created: string;
        updated: string;
        roles?: Role[]
    }


  type PomodoroEntryType = "SHORT_BREAK" | "LONG_BREAK" | "WORK_INTERVAL";

  interface PomodoroEntry {
    id: string;
    activityId: string;
    pomodoroId: string;
    minutes: number;
    created: string;
    updated: string;
    notes?: string;
    entryType: PomodoroEntryType
  }

  interface Pomodoro {
    id: string;
    notes: string;
    name: string;
    userId: string;
    entries: PomodoroEntry[];
    created: string;
    updated: string;
    activityId: string;
  }

}
