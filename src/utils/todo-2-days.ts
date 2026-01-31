const todo2Days = (todo: ToDo) => {
   // Type guard helper
   const isString = (value: unknown): value is string => typeof value === "string";

   const isNever = (occurrence: unknown) => isString(occurrence) && occurrence.trim().split("_")[0] === "NEVER";
   const isDaily = (occurrence: unknown) => isString(occurrence) && occurrence.trim().split("_")[0] === "DAILY";
   const isWeekly = (occurrence: unknown) => isString(occurrence) && occurrence.trim().split("_")[0] === "WEEKLY";
   const isMonthly = (occurrence: unknown) => isString(occurrence) && occurrence.trim().split("_")[0] === "MONTHLY";
   const isYearly = (occurrence: unknown) => isString(occurrence) && occurrence.trim().split("_")[0] === "YEARLY";
   const isSpecificDate = (occurrence: unknown) => isString(occurrence) && /^\d{4}-\d{2}-\d{2}$/.test(occurrence.trim());
   const dayOfWeekMap: Record<string, number> = {
     SUNDAY: 0,
     MONDAY: 1,
     TUESDAY: 2,
     WEDNESDAY: 3,
     THURSDAY: 4,
     FRIDAY: 5,
     SATURDAY: 6,
   };
   const days: string[] = [];

   // Handle empty or invalid occurrences
   if (!todo.occurrences || todo.occurrences.length === 0) {
     return days;
   }

   // Handle NEVER - takes precedence over everything
   if (todo.occurrences.some(isNever)) {
     const startDate = new Date(todo.startsOn);
     if (isNaN(startDate.getTime())) {
       return days;
     }
     days.push(startDate.toISOString().split("T")[0]);
     return days;
   }
   const startDate = new Date(todo.startsOn);
   if (isNaN(startDate.getTime())) {
     return days;
   }
   const endDate = todo.endsOn ? new Date(todo.endsOn) : startDate;
   if (isNaN(endDate.getTime())) {
     return days;
   }
   // Handle specific dates (YYYY-MM-DD format)
   const specificDates = todo.occurrences.filter(isSpecificDate);
   specificDates.forEach((dateStr) => {
     const date = new Date(dateStr.trim() + "T00:00:00");
     if (!isNaN(date.getTime())) {
       days.push(date.toISOString().split("T")[0]);
     }
   });
   // Handle weekly and monthly occurrences
   const weeklyOccurrences = todo.occurrences.filter(isWeekly);
   const monthlyOccurrences = todo.occurrences.filter(isMonthly);
   // Separate different types of MONTHLY occurrences
   const monthlyNthOccurrences = monthlyOccurrences.filter(occ => {
     const parts = occ.trim().split("_");
     return parts.length > 2 && (parts[1] === "1ST" || parts[1] === "2ND" || parts[1] === "3RD" || parts[1] === "LAST");
   });
   const monthlyAllOccurrences = monthlyOccurrences.filter(occ => {
     const parts = occ.trim().split("_");
     return parts.length === 2 && parts[1] in dayOfWeekMap;
   });
   // Handle weekly and monthly (all occurrences)
   if (weeklyOccurrences.length > 0 || monthlyAllOccurrences.length > 0) {
     const targetDays: number[] = [];
     [...weeklyOccurrences, ...monthlyAllOccurrences].forEach((occurrence) => {
       const parts = occurrence.trim().split("_");
       if (parts.length > 1 && parts[1] in dayOfWeekMap) {
         targetDays.push(dayOfWeekMap[parts[1]]);
       }
     });
     targetDays.forEach((targetDay) => {
       const date = new Date(startDate);
       const currentDay = date.getDay();
       const daysUntilTarget = (targetDay - currentDay + 7) % 7;
       if (daysUntilTarget > 0) {
         date.setDate(date.getDate() + daysUntilTarget);
       }
       while (date <= endDate) {
         days.push(date.toISOString().split("T")[0]);
         date.setDate(date.getDate() + 7);
       }
     });
   }
   // Handle MONTHLY_NTH_* occurrences (1ST, 2ND, 3RD, LAST)
   if (monthlyNthOccurrences.length > 0) {
     monthlyNthOccurrences.forEach((occurrence) => {
       const parts = occurrence.trim().split("_");
       if (parts.length < 3 || !(parts[2] in dayOfWeekMap)) {
         return;
       }
       const position = parts[1];
       const targetDay = dayOfWeekMap[parts[2]];
       let currentDate = new Date(startDate);
       while (currentDate <= endDate) {
         const year = currentDate.getFullYear();
         const month = currentDate.getMonth();
         let occurrence: Date | null = null;
         if (position === "LAST") {
           const lastDayOfMonth = new Date(year, month + 1, 0);
           const lastDayOfWeek = lastDayOfMonth.getDay();
           const daysBack = (lastDayOfWeek - targetDay + 7) % 7;
           occurrence = new Date(year, month + 1, 0 - daysBack);
         } else {
           const nthMap: Record<string, number> = { "1ST": 1, "2ND": 2, "3RD": 3 };
           const nth = nthMap[position];
           if (nth) {
             const firstOfMonth = new Date(year, month, 1);
             const firstDayOfWeek = firstOfMonth.getDay();
             const daysUntilTarget = (targetDay - firstDayOfWeek + 7) % 7;
             occurrence = new Date(year, month, 1 + daysUntilTarget + (nth - 1) * 7);
             if (occurrence.getMonth() !== month) {
               occurrence = null;
             }
           }
         }
         if (occurrence && occurrence >= startDate && occurrence <= endDate) {
           days.push(occurrence.toISOString().split("T")[0]);
         }
         currentDate = new Date(year, month + 1, 1);
       }
     });
   }
   // Return sorted and deduplicated days if we have any
   if (days.length > 0) {
     return [...new Set(days)].sort();
   }

   // Handle other occurrence types (DAILY, YEARLY, etc.) - only if we have valid patterns
   const hasValidOccurrence = todo.occurrences.some(isDaily) ||
                               todo.occurrences.some(isMonthly) ||
                               todo.occurrences.some(isYearly);

   if (!hasValidOccurrence) {
     return days; // Return empty array if no valid occurrence patterns found
   }

   const date = new Date(startDate);
   for (; date <= endDate; ) {
     days.push(date.toISOString().split("T")[0]);
     if (todo.occurrences.some(isDaily)) {
       date.setDate(date.getDate() + 1);
     } else if (todo.occurrences.some(isMonthly)) {
       date.setMonth(date.getMonth() + 1);
     } else if (todo.occurrences.some(isYearly)) {
       date.setFullYear(date.getFullYear() + 1);
     } else {
       break;
     }
   }
   return days;
};
export default todo2Days;
