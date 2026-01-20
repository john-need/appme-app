// Test script to reproduce the issue with toLocalYMD in EST timezone
const testDate = "2026-01-20T08:38:16.728Z";

// The current toLocalYMD function
const toLocalYMD = (v) => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);
  // Use toLocaleDateString with 'en-CA' locale to get YYYY-MM-DD format in local timezone
  return d.toLocaleDateString('en-CA');
};

console.log("=== Testing toLocalYMD with specific date in different timezones ===");
console.log("Test date (ISO string):", testDate);

// Create a date object for the test date
const dateObj = new Date(testDate);
console.log("Date object (toString):", dateObj.toString());
console.log("Date object (toUTCString):", dateObj.toUTCString());

// Test with the current toLocalYMD function
console.log("\nCurrent toLocalYMD result:", toLocalYMD(testDate));

// Function to simulate different timezone offsets
function testWithOffset(offsetMinutes, zoneName) {
  console.log(`\n--- Testing with ${zoneName} (UTC${offsetMinutes >= 0 ? '+' : ''}${Math.floor(offsetMinutes/60)}:${String(Math.abs(offsetMinutes%60)).padStart(2, '0')}) ---`);

  // Create a date object with the specified timezone offset
  const date = new Date(testDate);

  // Get the local date components in the specified timezone
  const localDate = new Date(date.getTime() + (offsetMinutes - date.getTimezoneOffset()) * 60000);

  console.log("Local date in " + zoneName + ":", localDate.toString());
  console.log("Local date components:");
  console.log("  Year:", localDate.getFullYear());
  console.log("  Month:", localDate.getMonth() + 1); // +1 because getMonth() returns 0-11
  console.log("  Day:", localDate.getDate());
  console.log("  Hours:", localDate.getHours());
  console.log("  Minutes:", localDate.getMinutes());

  // Format as YYYY-MM-DD manually
  const ymd = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
  console.log("Manually formatted YMD:", ymd);

  // Test with toLocaleDateString
  console.log("toLocaleDateString('en-CA'):", localDate.toLocaleDateString('en-CA'));
}

// Test with EST timezone (UTC-5)
testWithOffset(-5 * 60, "EST");

// Proposed fix: Adjust the date to the specified timezone before formatting
const fixedToLocalYMD = (v, timezoneOffset = -5 * 60) => { // Default to EST
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);

  // Adjust the date to the specified timezone
  const localDate = new Date(d.getTime() + (timezoneOffset - d.getTimezoneOffset()) * 60000);

  // Format as YYYY-MM-DD
  return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
};

console.log("\n=== Testing fixed toLocalYMD function ===");
console.log("Fixed toLocalYMD result for EST:", fixedToLocalYMD(testDate));

console.log("\n=== Test complete ===");
