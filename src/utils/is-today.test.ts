import isToday from "./is-today";

describe("isToday", () => {
  const realDate = Date;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return true for today", () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });

  it("should return true for today as an ISO string", () => {
    const today = new Date().toISOString();
    expect(isToday(today)).toBe(true);
  });

  it("should return true for today as a space-separated ISO string", () => {
    // Format: 2026-01-23 00:58:03.744000
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const ms = String(now.getMilliseconds()).padStart(3, "0");
    const dateString = `${y}-${m}-${d} ${hh}:${mm}:${ss}.${ms}000`;
    
    expect(isToday(dateString)).toBe(true);
  });

  it("should return false for yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });

  it("should return false for tomorrow", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isToday(tomorrow)).toBe(false);
  });

  it("should return false for invalid date", () => {
    expect(isToday("invalid-date")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isToday("")).toBe(false);
  });

  describe("Timezone tests", () => {
    let originalToLocaleDateString: any;

    beforeEach(() => {
      originalToLocaleDateString = realDate.prototype.toLocaleDateString;

      // Mock toLocaleDateString to ensure predictable YYYY-MM-DD output regardless of runner timezone
      // when "en-CA" is used.
      // eslint-disable-next-line prefer-arrow-callback
      jest.spyOn(realDate.prototype, "toLocaleDateString").mockImplementation(function (this: Date, locales?: Intl.LocalesArgument) {
        if (locales === "en-CA") {
          const y = this.getFullYear();
          const m = String(this.getMonth() + 1).padStart(2, "0");
          const d = String(this.getDate()).padStart(2, "0");
          return `${y}-${m}-${d}`;
        }
        return originalToLocaleDateString.call(this, locales);
      });
    });

    it("should return true when it is today in a specific timezone (simulated by mocking Date)", () => {
      // Mocking Date to 2026-01-22 10:00:00 local time
      // We use realDate(2026, 0, 22, 10, 0, 0) which creates a date in the test runner's local time
      const mockToday = new realDate(2026, 0, 22, 10, 0, 0);
      jest.spyOn(global, "Date").mockImplementation(((arg?: any) => {
        if (arg !== undefined) return new realDate(arg);
        return new realDate(mockToday.getTime());
      }) as any);

      // The isToday function will:
      // 1. Get the current date (mockToday)
      // 2. Subtract timezone offset (which makes it UTC-equivalent in terms of hour/minute if we consider the offset)
      // 3. Call toLocaleString("en-CA")
      // Since we mocked toLocaleString("en-CA") to ALWAYS return YYYY-MM-DD based on local components,
      // it should match the testDate's toLocaleDateString("en-CA").

      const testDate = new realDate(2026, 0, 22, 15, 0, 0);
      expect(isToday(testDate)).toBe(true);
    });

    it("should return false when it is NOT today in a specific timezone", () => {
       const mockToday = new realDate(2026, 0, 22, 10, 0, 0);
       jest.spyOn(global, "Date").mockImplementation(((arg?: any) => {
         if (arg !== undefined) return new realDate(arg);
         return new realDate(mockToday.getTime());
       }) as any);

       // Yesterday
       const yesterday = new realDate(2026, 0, 21, 10, 0, 0);
       expect(isToday(yesterday)).toBe(false);

       // Tomorrow
       const tomorrow = new realDate(2026, 0, 23, 10, 0, 0);
       expect(isToday(tomorrow)).toBe(false);
    });

    it("handles boundary shifts correctly based on local time", () => {
        const mockToday = new realDate(2026, 0, 22, 10, 0, 0); // Jan 22, 2026
        jest.spyOn(global, "Date").mockImplementation(((arg?: any) => {
            if (arg !== undefined) return new realDate(arg);
            return new realDate(mockToday.getTime());
        }) as any);

        // Same day in local time
        expect(isToday(new realDate(2026, 0, 22, 23, 59))).toBe(true);
        // Different day in local time
        expect(isToday(new realDate(2026, 0, 21, 23, 59))).toBe(false);
    });
  });
});
