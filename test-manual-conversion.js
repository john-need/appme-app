// Test script to manually verify the conversion of a UTC date to EST
const testDate = "2026-01-20T08:38:16.728Z";

console.log("=== Manual conversion of UTC date to EST ===");
console.log("Test date (ISO string):", testDate);

// Create a date object for the test date
const dateObj = new Date(testDate);
console.log("Date object (toString):", dateObj.toString());
console.log("Date object (toUTCString):", dateObj.toUTCString());

// Get the UTC components
const utcYear = dateObj.getUTCFullYear();
const utcMonth = dateObj.getUTCMonth() + 1; // +1 because getMonth() returns 0-11
const utcDate = dateObj.getUTCDate();
const utcHours = dateObj.getUTCHours();
const utcMinutes = dateObj.getUTCMinutes();
const utcSeconds = dateObj.getUTCSeconds();

console.log("\nUTC components:");
console.log(`UTC date: ${utcYear}-${String(utcMonth).padStart(2, "0")}-${String(utcDate).padStart(2, "0")}`);
console.log(`UTC time: ${String(utcHours).padStart(2, "0")}:${String(utcMinutes).padStart(2, "0")}:${String(utcSeconds).padStart(2, "0")}`);

// Convert to EST (UTC-5)
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
    if (estMonth < 1) {
      estMonth = 12; // December
      estYear -= 1;
    }
    // Get the last day of the previous month
    const daysInMonth = new Date(estYear, estMonth, 0).getDate();
    estDate = daysInMonth;
  }
}

console.log("\nEST components (manual conversion):");
console.log(`EST date: ${estYear}-${String(estMonth).padStart(2, "0")}-${String(estDate).padStart(2, "0")}`);
console.log(`EST time: ${String(estHours).padStart(2, "0")}:${String(utcMinutes).padStart(2, "0")}:${String(utcSeconds).padStart(2, "0")}`);

// Verify with Date object methods
console.log("\n=== Debugging the conversion process ===");

// Method 1: Using Date.UTC and setUTCHours
console.log("\nMethod 1: Using Date.UTC and setUTCHours");
const utcDateObj1 = new Date(Date.UTC(utcYear, utcMonth - 1, utcDate, utcHours, utcMinutes, utcSeconds));
console.log("UTC date object:", utcDateObj1.toUTCString());

const estDate1 = new Date(utcDateObj1);
estDate1.setUTCHours(utcDateObj1.getUTCHours() - 5);
console.log("EST date (using setUTCHours):", estDate1.toString());
console.log("EST date components:", estDate1.getFullYear(), estDate1.getMonth() + 1, estDate1.getDate());

// Method 2: Direct calculation using the original date
console.log("\nMethod 2: Direct calculation using the original date");
const utcTime = dateObj.getTime();
const estTime = utcTime - (5 * 60 * 60 * 1000); // Subtract 5 hours in milliseconds
const estDate2 = new Date(estTime);
console.log("EST date (direct calculation):", estDate2.toString());
console.log("EST date components:", estDate2.getFullYear(), estDate2.getMonth() + 1, estDate2.getDate());

// Method 3: Using the issue description date directly
console.log("\nMethod 3: Using the issue description date directly");
const issueDate = new Date("2026-01-20T08:38:16.728Z");
console.log("Issue date (UTC):", issueDate.toUTCString());
console.log("Issue date (local):", issueDate.toString());
const estIssueDate = new Date(issueDate.getTime() - (5 * 60 * 60 * 1000));
console.log("EST issue date:", estIssueDate.toString());
console.log("EST issue date components:", estIssueDate.getFullYear(), estIssueDate.getMonth() + 1, estIssueDate.getDate());
console.log("\nEST date (using Date object):", estDate2.toString());
console.log(`EST date components: ${estDate2.getFullYear()}-${String(estDate2.getMonth() + 1).padStart(2, "0")}-${String(estDate2.getDate()).padStart(2, "0")}`);

console.log("\n=== Test complete ===");
