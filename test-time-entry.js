// Test script to verify the time entry filtering logic
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

// The new isToday function from our updated component
const isToday = (dateStr) => {
  if (!dateStr) return false;

  // Get today's date in UTC (YYYY-MM-DD)
  const todayUTC = new Date().toISOString().slice(0, 10);

  // Get the entry's date in UTC (YYYY-MM-DD)
  const entryUTC = new Date(dateStr).toISOString().slice(0, 10);

  return todayUTC === entryUTC;
};

// Let's simulate different timezones by creating dates at specific times
console.log("=== Testing with specific times to simulate timezone issues ===");

// Create a date object for "2026-01-20T03:12:52.523Z" (the test entry's created date)
const entryDateObj = new Date("2026-01-20T03:12:52.523Z");
console.log("Entry date (UTC):", entryDateObj.toUTCString());
console.log("Entry date (Local):", entryDateObj.toString());

// Create a date object for the same day but at midnight in local timezone
const localMidnight = new Date();
localMidnight.setFullYear(2026, 0, 20); // January 20, 2026
localMidnight.setHours(0, 0, 0, 0); // Midnight
console.log("\nLocal midnight:", localMidnight.toString());
console.log("Local midnight (UTC):", localMidnight.toUTCString());

// Test with our new isToday function
console.log("\n=== Testing with our new isToday function ===");
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

// Now test our isToday function with the mocked date
console.log("Is the test entry from today (using isToday)?", isToday(testEntry.created));

// Restore the original Date
global.Date = originalDate;

// Test with our toLocalYMD function
console.log("\n=== Testing with toLocalYMD function ===");
const entryLocalYMD = toLocalYMD(testEntry.created);
const todayLocalYMD = toLocalYMD(localMidnight);
console.log("Entry date (toLocalYMD):", entryLocalYMD);
console.log("Today (toLocalYMD):", todayLocalYMD);
console.log("Would be included in today's entries:", entryLocalYMD === todayLocalYMD);

// Test with toLocaleDateString("en-CA")
console.log("\n=== Testing with toLocaleDateString('en-CA') ===");
const entryEnCA = new Date(testEntry.created).toLocaleDateString("en-CA");
const todayEnCA = localMidnight.toLocaleDateString("en-CA");
console.log("Entry date (en-CA):", entryEnCA);
console.log("Today (en-CA):", todayEnCA);
console.log("Would be included in today's entries:", entryEnCA === todayEnCA);

// Test with ISO string
console.log("\n=== Testing with ISO string ===");
const entryISO = new Date(testEntry.created).toISOString().slice(0, 10);
const todayISO = localMidnight.toISOString().slice(0, 10);
console.log("Entry date (ISO):", entryISO);
console.log("Today (ISO):", todayISO);
console.log("Would be included in today's entries:", entryISO === todayISO);

// Test with different timezone offsets
console.log("\n=== Testing with different timezone offsets ===");
// EST is UTC-5
const estOffset = -5 * 60; // minutes
// PST is UTC-8
const pstOffset = -8 * 60; // minutes
// IST is UTC+5:30
const istOffset = 5 * 60 + 30; // minutes

// Function to test with a specific timezone offset
function testWithOffset(offsetMinutes, zoneName) {
  console.log(`\n--- Testing with ${zoneName} (UTC${offsetMinutes >= 0 ? '+' : ''}${Math.floor(offsetMinutes/60)}:${String(Math.abs(offsetMinutes%60)).padStart(2, '0')}) ---`);

  // Adjust the date objects to the specified timezone
  const entryDate = new Date(entryDateObj.getTime() + (offsetMinutes - new Date().getTimezoneOffset()) * 60000);
  const todayDate = new Date(localMidnight.getTime() + (offsetMinutes - new Date().getTimezoneOffset()) * 60000);

  console.log("Entry date in " + zoneName + ":", entryDate.toString());
  console.log("Today in " + zoneName + ":", todayDate.toString());

  // Test with our toLocalYMD function
  const entryYMD = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`;
  const todayYMD = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  console.log("Entry date (YMD):", entryYMD);
  console.log("Today (YMD):", todayYMD);
  console.log("Would be included in today's entries:", entryYMD === todayYMD);
}

// Test with different timezone offsets
testWithOffset(estOffset, "EST");
testWithOffset(pstOffset, "PST");
testWithOffset(istOffset, "IST");
