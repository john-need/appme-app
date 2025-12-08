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
    }

    interface TimeEntry {
        activityId: string;
        created: string;
        date: string; // YYYY-MM-DD
        id: string;
        minutes: number;
        notes?: string;
        updated: string;
    }

    interface User {
        id?: string;
        email: string;
        name: string;
        weekStart: "MONDAY" | "SUNDAY";
        timezone: string; // IANA
        defaultView: "WEEK" | "DAY";
        created: string;
        updated: string;
        roles?: Role[]
    }

}
