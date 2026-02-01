import transmogrifyOccurrences from "@/utils/transmogrify-occurrences";

const repeatsLabels = (occurrences: string[]) => {
  const vettedOccurrences = transmogrifyOccurrences(occurrences, "vet");

  const monthlyOccurrences = vettedOccurrences.filter((occ) => occ.startsWith("MONTHLY_"));
  const weeklyOccurrences = vettedOccurrences.filter((occ) => occ.startsWith("WEEKLY_"));
  const otherOccurrences = vettedOccurrences.filter((occ) => !occ.startsWith("MONTHLY_") && !occ.startsWith("WEEKLY_"));

  const labels = otherOccurrences.map((occurrence) => {
    if (occurrence === "DAILY") {
      return "Daily";
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(occurrence)) {
      return `On ${occurrence}`;
    }
    return occurrence;
  });

  const dowMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

  if (weeklyOccurrences.length > 0) {
    const days = weeklyOccurrences
      .sort((a, b) => {
        const dayA = a.replace("WEEKLY_", "");
        const dayB = b.replace("WEEKLY_", "");
        return dowMap.indexOf(dayA) - dowMap.indexOf(dayB);
      })
      .map((occ) => {
        const day = occ.replace("WEEKLY_", "");
        return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
      });

    if (days.length === 1) {
      labels.push(`Weekly on ${days[0]}`);
    } else {
      const lastDay = days.pop();
      labels.push(`Weekly on ${days.join(", ")} and ${lastDay}`);
    }
  }

  if (monthlyOccurrences.length === 0) {
    return labels;
  }

  // Helper to format day numbers (1st, 2nd, 3rd, 4-31th)
  const formatOrdinal = (n: number | string) => {
    const num = typeof n === "string" ? parseInt(n, 10) : n;
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const monthlyParts: string[] = [];

  // Sort monthly occurrences to have a consistent order: Day of week, positional, then specific days
  // (dowMap is already defined above)

  // 1. MONTHLY_MONDAY style
  const monthlyDows = monthlyOccurrences
    .filter(occ => {
      const parts = occ.split("_");
      return parts.length === 2 && dowMap.includes(parts[1]);
    })
    .sort((a, b) => {
      const dayA = a.split("_")[1];
      const dayB = b.split("_")[1];
      return dowMap.indexOf(dayA) - dowMap.indexOf(dayB);
    })
    .map(occ => {
      const day = occ.split("_")[1];
      return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    });

  if (monthlyDows.length > 0) {
    monthlyParts.push(monthlyDows.join(", "));
  }

  // 2. MONTHLY_1ST_MONDAY style
  const positionalOccs = monthlyOccurrences
    .filter(occ => {
      const parts = occ.split("_");
      return parts.length === 3 && ["1ST", "2ND", "3RD", "4TH", "LAST"].includes(parts[1]) && dowMap.includes(parts[2]);
    })
    .sort((a, b) => {
      const partsA = a.split("_");
      const partsB = b.split("_");
      const posMap: Record<string, number> = { "1ST": 0, "2ND": 1, "3RD": 2, "4TH": 3, "LAST": 4 };
      if (partsA[1] !== partsB[1]) {
        return posMap[partsA[1]] - posMap[partsB[1]];
      }
      return dowMap.indexOf(partsA[2]) - dowMap.indexOf(partsB[2]);
    });

  positionalOccs.forEach(occ => {
    const parts = occ.split("_");
    const pos = parts[1].toLowerCase();
    const day = parts[2].charAt(0).toUpperCase() + parts[2].slice(1).toLowerCase();
    monthlyParts.push(`the ${pos} ${day}`);
  });

  // 3. MONTHLY_DAY_15 style
  const dayNumbers = monthlyOccurrences
    .filter(occ => occ.startsWith("MONTHLY_DAY_"))
    .map(occ => parseInt(occ.replace("MONTHLY_DAY_", ""), 10))
    .sort((a, b) => a - b);

  if (dayNumbers.length > 0) {
    const formattedDays = dayNumbers.map(n => formatOrdinal(n));
    if (formattedDays.length === 1) {
      monthlyParts.push(`the ${formattedDays[0]}`);
    } else {
      const lastDay = formattedDays.pop();
      monthlyParts.push(`the ${formattedDays.join(", ")} and ${lastDay}`);
    }
  }

  let monthlyLabel = "";
  if (monthlyParts.length > 0) {
    if (monthlyParts.length === 1) {
      monthlyLabel = `Monthly on ${monthlyParts[0]}`;
    } else {
      const lastPart = monthlyParts.pop();
      monthlyLabel = `Monthly on ${monthlyParts.join(", ")}, and ${lastPart}`;
    }
  }

  return [...labels, monthlyLabel];
};


export default repeatsLabels;