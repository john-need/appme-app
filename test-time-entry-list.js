// Test script to verify the time-entry-list filtering logic
const testEntry = {
  "id": "53d04840-1d89-4d7d-9a3e-d96195d6876f",
  "activityId": "28b0614a-deba-4a28-b634-756bb2b80ec6",
  "minutes": 10,
  "notes": "",
  "created": "2026-01-20T03:12:52.523Z",
  "updated": "2026-01-20T03:12:52.523Z"
};

// The toLocalYMD function from our component
const toLocalYMD = (v) => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// The isToday function from our updated component
const isToday = (dateStr) => {
  if (!dateStr) return false;

  // Get today's date in UTC (YYYY-MM-DD)
  const todayUTC = new Date().toISOString().slice(0, 10);

  // Get the entry's date in UTC (YYYY-MM-DD)
  const entryUTC = new Date(dateStr).toISOString().slice(0, 10);

  return todayUTC === entryUTC;
};

// Mock the current date to be 2026-01-20 for testing purposes
const originalDate = Date;
global.Date = class extends Date {
  constructor(...args) {
    if (args.length === 0) {
      // When creating a new Date() without arguments, return our fixed date
      super(2026, 0, 20); // January 20, 2026
    } else {
      super(...args);
    }
  }

  // Override toISOString to return a fixed date for new Date().toISOString()
  toISOString() {
    if (this.getFullYear() === 2026 && this.getMonth() === 0 && this.getDate() === 20 &&
        this.getHours() === 0 && this.getMinutes() === 0 && this.getSeconds() === 0) {
      return "2026-01-20T00:00:00.000Z";
    }
    return super.toISOString();
  }
};

console.log("=== Testing time-entry-list filtering logic ===");

// Test with the old approach (toLocalYMD)
const todayLocal = toLocalYMD(new Date());
const entryLocal = toLocalYMD(testEntry.created);
console.log("Today's local date:", todayLocal);
console.log("Entry's local date:", entryLocal);
console.log("Would be included with old approach:", entryLocal === todayLocal);

// Test with the new approach (isToday)
console.log("\nIs the test entry from today (using isToday)?", isToday(testEntry.created));

// Test with different timezone offsets
console.log("\n=== Testing with different timezone offsets ===");

// Function to test with a specific timezone offset
function testWithOffset(offsetMinutes, zoneName) {
  console.log(`\n--- Testing with ${zoneName} (UTC${offsetMinutes >= 0 ? '+' : ''}${Math.floor(offsetMinutes/60)}:${String(Math.abs(offsetMinutes%60)).padStart(2, '0')}) ---`);

  // Create a date object for the test entry
  const entryDate = new Date(testEntry.created);

  // Create a date object for today with the specified timezone offset
  const today = new Date();

  // Convert both to local dates in the specified timezone
  const entryLocalDate = new Date(entryDate.getTime() + (offsetMinutes - entryDate.getTimezoneOffset()) * 60000);
  const todayLocalDate = new Date(today.getTime() + (offsetMinutes - today.getTimezoneOffset()) * 60000);

  // Format as YYYY-MM-DD
  const entryYMD = `${entryLocalDate.getFullYear()}-${String(entryLocalDate.getMonth() + 1).padStart(2, '0')}-${String(entryLocalDate.getDate()).padStart(2, '0')}`;
  const todayYMD = `${todayLocalDate.getFullYear()}-${String(todayLocalDate.getMonth() + 1).padStart(2, '0')}-${String(todayLocalDate.getDate()).padStart(2, '0')}`;

  console.log("Entry date in local time:", entryYMD);
  console.log("Today in local time:", todayYMD);
  console.log("Would be included with local approach:", entryYMD === todayYMD);
  console.log("Would be included with UTC approach:", isToday(testEntry.created));
}

// Test with different timezone offsets
// EST is UTC-5
testWithOffset(-5 * 60, "EST");
// PST is UTC-8
testWithOffset(-8 * 60, "PST");
// IST is UTC+5:30
testWithOffset(5 * 60 + 30, "IST");

// Restore the original Date
global.Date = originalDate;

console.log("\n=== Test complete ===");
