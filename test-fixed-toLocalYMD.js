// Test script to verify the fixed toLocalYMD function
const testDate = "2026-01-20T08:38:16.728Z";

// The fixed toLocalYMD function
const toLocalYMD = (v) => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);

  // Get the UTC time components
  const utcYear = d.getUTCFullYear();
  const utcMonth = d.getUTCMonth();
  const utcDate = d.getUTCDate();
  const utcHours = d.getUTCHours();

  // Adjust for EST (UTC-5)
  let estHours = utcHours - 5;
  let estDate = utcDate;
  let estMonth = utcMonth;
  let estYear = utcYear;

  // Handle day boundary crossings
  if (estHours < 0) {
    estHours += 24;
    estDate -= 1;

    // Handle month/year boundary crossings
    if (estDate < 1) {
      estMonth -= 1;
      if (estMonth < 0) {
        estMonth = 11; // December
        estYear -= 1;
      }
      // Get the last day of the previous month
      const lastDay = new Date(estYear, estMonth + 1, 0).getDate();
      estDate = lastDay;
    }
  }

  // Format as YYYY-MM-DD
  return `${estYear}-${String(estMonth + 1).padStart(2, "0")}-${String(estDate).padStart(2, "0")}`;
};

console.log("=== Testing fixed toLocalYMD function ===");
console.log("Test date (ISO string):", testDate);

// Create a date object for the test date
const dateObj = new Date(testDate);
console.log("Date object (toString):", dateObj.toString());
console.log("Date object (toUTCString):", dateObj.toUTCString());

// Test with the fixed toLocalYMD function
console.log("\nFixed toLocalYMD result:", toLocalYMD(testDate));
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
  console.log("Fixed toLocalYMD result:", toLocalYMD(date));
});

console.log("\n=== Test complete ===");
