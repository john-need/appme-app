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


  type Repeats = "NEVER" | "WEEKLY" | "MONTHLY";
  type RepeatsOnDay = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"[];
  type RepeatsOnDate =
    "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16"
    | "17"
    | "18"
    | "19"
    | "20"
    | "21"
    | "22"
    | "23"
    | "24"
    | "25"
    | "26"
    | "27"
    | "28"
    | "29"
    | "30"
    | "31"
  type RepeatsOnNthWeek = "FIRST" | "SECOND" | "THIRD" | "FOURTH" | "LAST";


  interface ToDo {
    activityId?: string;
    comment?: string;
    completions: string[]; //PostGreSQL Date[]
    created: string; //timestamp
    goalId?: string;
    id: string;
    occurrences: string[];
    reminder?: number; // minutes before
    text: string;
    time?: string;
    updated: string; //timestamp
    userId: string;
    startsOn: string //timestamp
    endsOn?: string //timestamp
  }


  interface Milestone {
    id: string;
    goalId: string;
    text: string;
    metric: string;
    date: string; // timestamp
    created: string // timestamp
    updated: string // timestamp
  }

  interface Goal {
    activities: string[];
    created: string; //timestamp
    id: string;
    metrics: string[];
    milestones: Milestone[];
    text: string;
    updated: string; //timestamp
    userId: string;
  }

}
