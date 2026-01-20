// Test script to verify the updated toLocalYMD function
const testDate = "2026-01-20T08:38:16.728Z";

// The updated toLocalYMD function
const toLocalYMD = (v) => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);

  // Convert to EST by subtracting 5 hours from UTC time
  const estDate = new Date(d.getTime() - (5 * 60 * 60 * 1000));

  // Format as YYYY-MM-DD
  return `${estDate.getFullYear()}-${String(estDate.getMonth() + 1).padStart(2, "0")}-${String(estDate.getDate()).padStart(2, "0")}`;
};

console.log("=== Testing updated toLocalYMD function ===");
console.log("Test date (ISO string):", testDate);

// Create a date object for the test date
const dateObj = new Date(testDate);
console.log("Date object (toString):", dateObj.toString());
console.log("Date object (toUTCString):", dateObj.toUTCString());

// Test with the updated toLocalYMD function
console.log("\nUpdated toLocalYMD result:", toLocalYMD(testDate));
console.log("Expected result for EST: 2026-01-19");

// Test with different input formats
console.log("\n=== Testing with different input formats ===");
console.log("Date object input:", toLocalYMD(dateObj));
console.log("ISO string input:", toLocalYMD(testDate));

// Test with different dates
console.log("\n=== Testing with different dates ===");
const dates = [
  "2026-01-19T23:59:59.999Z", // Just before midnight UTC
  "2026-01-20T00:00:00.000Z", // Midnight UTC
  "2026-01-20T04:59:59.999Z", // Just before midnight EST
  "2026-01-20T05:00:00.000Z", // Midnight EST
  "2026-01-20T12:00:00.000Z", // Noon UTC
];

dates.forEach(date => {
  console.log(`\nDate: ${date}`);
  console.log("UTC time:", new Date(date).toUTCString());
  console.log("Local time:", new Date(date).toString());
  console.log("Updated toLocalYMD result:", toLocalYMD(date));
});

console.log("\n=== Test complete ===");
