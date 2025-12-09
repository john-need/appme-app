import toIso from "@/utils/to-iso";

// Cross-platform UUID generator: prefer Web Crypto's randomUUID when available
function generateUUID(): string {
  try {
    // @ts-ignore - global crypto may exist in browsers
    const webCrypto = (globalThis as any)?.crypto;
    if (webCrypto && typeof webCrypto.randomUUID === "function") {
      return webCrypto.randomUUID();
    }
  } catch (e) {
    // ignore
  }

  // fallback to RFC4122 v4 UUID generator (browser-friendly)
  // from: https://stackoverflow.com/a/2117523/115145
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface ActivityInput {
  id?: string;
  name?: string;
  comment?: string;
  goal?: number;
  type?: "MUDA" | "TASSEI";
  created?: string | number;
  updated?: string | number;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
  weekends?: boolean;
}

const activityFactory = (data: ActivityInput = {}): Activity => ({
  id: typeof data.id === "string" ? data.id : generateUUID(),
  name: typeof data.name === "string" ? data.name : "",
  comment: typeof data.comment === "string" ? data.comment : "",
  goal: typeof data.goal === "number" ? data.goal : 0,
  type: data.type === "MUDA" || data.type === "TASSEI" ? data.type : "TASSEI",
  created: toIso(data.created),
  updated: toIso(data.updated),
  monday: typeof data.monday === "boolean" ? data.monday : false,
  tuesday: typeof data.tuesday === "boolean" ? data.tuesday : false,
  wednesday: typeof data.wednesday === "boolean" ? data.wednesday : false,
  thursday: typeof data.thursday === "boolean" ? data.thursday : false,
  friday: typeof data.friday === "boolean" ? data.friday : false,
  saturday: typeof data.saturday === "boolean" ? data.saturday : false,
  sunday: typeof data.sunday === "boolean" ? data.sunday : false,
  weekends: typeof data.weekends === "boolean" ? data.weekends : false
});

export default activityFactory;
