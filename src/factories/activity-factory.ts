import {randomUUID} from "crypto";


import toIso  from "@/utils/to-iso";

interface ActivityInput {
    id?: string;
    name?: string;
    comment?: string;
    goal?: number;
    type?: "MUDA" | "TASSEI";
    created?: string | number;
    updated?: string | number;
}

const activityFactory = (data: ActivityInput = {}): Activity => ({
    id: typeof data.id === "string" ? data.id : randomUUID(),
    name: typeof data.name === "string" ? data.name : "",
    comment: typeof data.comment === "string" ? data.comment : "",
    goal: typeof data.goal === "number" ? data.goal : 0,
    type: data.type === "MUDA" || data.type === "TASSEI" ? data.type : "TASSEI",
    created: toIso(data.created),
    updated: toIso(data.updated)
});

export default activityFactory;
