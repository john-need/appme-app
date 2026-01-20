// Test script to verify the updated toLocalYMD function

// The updated toLocalYMD function from our component
const toLocalYMD = (v) => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);
  // Use toLocaleDateString with 'en-CA' locale to get YYYY-MM-DD format in local timezone
  return d.toLocaleDateString('en-CA');
};

// The old toLocalYMD function for comparison
const oldToLocalYMD = (v) => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Test entry from a previous test
const testEntry = {
  "id": "53d04840-1d89-4d7d-9a3e-d96195d6876f",
  "activityId": "28b0614a-deba-4a28-b634-756bb2b80ec6",
  "minutes": 10,
  "notes": "",
  "created": "2026-01-20T03:12:52.523Z",
  "updated": "2026-01-20T03:12:52.523Z"
};

console.log("=== Testing toLocalYMD function ===");

// Create a date object for the test entry
const entryDate = new Date(testEntry.created);
console.log("Entry date (UTC):", entryDate.toUTCString());
console.log("Entry date (Local):", entryDate.toString());

// Test with the old and new toLocalYMD functions
console.log("\n=== Comparing old and new toLocalYMD functions ===");
console.log("Old toLocalYMD:", oldToLocalYMD(entryDate));
console.log("New toLocalYMD:", toLocalYMD(entryDate));

// Test with different timezone offsets
console.log("\n=== Testing with different timezone offsets ===");

// Function to test with a specific timezone offset
function testWithOffset(offsetMinutes, zoneName) {
  console.log(`\n--- Testing with ${zoneName} (UTC${offsetMinutes >= 0 ? '+' : ''}${Math.floor(offsetMinutes/60)}:${String(Math.abs(offsetMinutes%60)).padStart(2, '0')}) ---`);

  // Adjust the date object to the specified timezone
  const adjustedDate = new Date(entryDate.getTime() + (offsetMinutes - entryDate.getTimezoneOffset()) * 60000);

  console.log("Entry date in " + zoneName + ":", adjustedDate.toString());

  // Test with the old and new toLocalYMD functions
  console.log("Old toLocalYMD:", oldToLocalYMD(adjustedDate));
  console.log("New toLocalYMD:", toLocalYMD(adjustedDate));
}

// Test with different timezone offsets
// EST is UTC-5
testWithOffset(-5 * 60, "EST");
// PST is UTC-8
testWithOffset(-8 * 60, "PST");
// IST is UTC+5:30
testWithOffset(5 * 60 + 30, "IST");

console.log("\n=== Test complete ===");
