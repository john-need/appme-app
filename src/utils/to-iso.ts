// helper to normalize input to ISO string
export default function toIso(input?: string | number | Date): string {
  // handle zero epoch explicitly
  if (input === 0) return new Date(0).toISOString();
  if (input === undefined || input === null) return new Date().toISOString();
  if (typeof input === "string") {
    const d = new Date(input);
    if (!isNaN(d.getTime())) return d.toISOString();
    // if the string looks like a timestamp number
    const asNum = Number(input);
    if (!isNaN(asNum)) return new Date(asNum).toISOString();
    return new Date().toISOString();
  }
  if (typeof input === "number") {
    return new Date(input).toISOString();
  }
  if (input instanceof Date) {
    return input.toISOString();
  }
  return new Date().toISOString();
}
