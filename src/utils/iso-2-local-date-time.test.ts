import iso2LocalDateTime from "./iso-2-local-date-time";

describe("iso2LocalDateTime utility", () => {
  it("converts a valid ISO string to local YYYY-MM-DDTHH:mm format", () => {
    // Note: The output depends on the local timezone of the environment where tests run.
    // However, the implementation uses getFullYear, getMonth+1, getDate, getHours, getMinutes
    // which all refer to the LOCAL time of the Date object created from the ISO string.
    
    const isoString = "2023-10-25T14:30:00Z";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const expected = `${year}-${month}-${day}T${hours}:${minutes}`;

    expect(iso2LocalDateTime(isoString)).toBe(expected);
  });

  it("returns an empty string for invalid ISO strings", () => {
    expect(iso2LocalDateTime("invalid-date")).toBe("");
    expect(iso2LocalDateTime("")).toBe("");
  });

  it("handles leap years correctly", () => {
    const isoString = "2024-02-29T12:00:00Z";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const expected = `${year}-${month}-${day}T${hours}:${minutes}`;

    expect(iso2LocalDateTime(isoString)).toBe(expected);
    expect(expected).toMatch(/^2024-02-29T/);
  });

  it("pads single digit month, day, hours, and minutes with leading zeros", () => {
    // January 5th, 2023 at 04:07 UTC
    const isoString = "2023-01-05T04:07:00Z";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const expected = `${year}-${month}-${day}T${hours}:${minutes}`;

    expect(iso2LocalDateTime(isoString)).toBe(expected);
    // Explicitly check padding if we know the local time won't shift it too much
    // but better to just rely on the formula above which is what the function does.
    const result = iso2LocalDateTime(isoString);
    const parts = result.split(/[T:-]/);
    expect(parts[1].length).toBe(2); // month
    expect(parts[2].length).toBe(2); // day
    expect(parts[3].length).toBe(2); // hours
    expect(parts[4].length).toBe(2); // minutes
  });
});
