import React, { useMemo } from "react";
import toLocalYMD from "@/utils/to-local-ymd";
import DailyActivityPieChart, { DailyPieChartData, PieChartData } from "../daily-activity-pie-chart/daily-activity-pie-chart";

interface TimeEntryPieChartsProps {
  activities: Activity[];
  timeEntries: TimeEntry[];
  dataByPeriod: "day" | "week" | "month";
}

const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const TimeEntryPieCharts: React.FC<TimeEntryPieChartsProps> = ({ activities, timeEntries, dataByPeriod }) => {
  const dailyData: DailyPieChartData[] = useMemo(() => {
    // Group entries by period
    const entriesByPeriod: Record<string, TimeEntry[]> = {};
    timeEntries.forEach((entry) => {
      let periodKey = "";
      const date = new Date(entry.created);

      if (dataByPeriod === "day") {
        periodKey = toLocalYMD(entry.created);
      } else if (dataByPeriod === "week") {
        const startOfWeek = getStartOfWeek(date);
        periodKey = `Week of ${toLocalYMD(startOfWeek)}`;
      } else if (dataByPeriod === "month") {
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        periodKey = `${month} ${year}`;
      }

      if (!entriesByPeriod[periodKey]) {
        entriesByPeriod[periodKey] = [];
      }
      entriesByPeriod[periodKey].push(entry);
    });

    // Sort period keys descending (newest first)
    const sortedPeriodKeys = Object.keys(entriesByPeriod).sort((a, b) => {
      if (dataByPeriod === "month") {
        // Parse "Month Year" back to date for sorting
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime();
      }
      return b.localeCompare(a);
    });

    const activityMap = activities.reduce((acc, activity) => {
      acc[activity.id] = activity.name;
      return acc;
    }, {} as Record<string, string>);

    return sortedPeriodKeys.map((periodKey) => {
      const periodEntries = entriesByPeriod[periodKey];
      const activityMinutes: Record<string, number> = {};
      let totalSpent = 0;

      periodEntries.forEach((entry) => {
        activityMinutes[entry.activityId] = (activityMinutes[entry.activityId] || 0) + entry.minutes;
        totalSpent += entry.minutes;
      });

      const data: PieChartData[] = Object.entries(activityMinutes).map(([activityId, minutes]) => ({
        name: activityMap[activityId] || "Unknown",
        value: minutes,
        formattedValue: formatDuration(minutes),
      }));

      // Calculate total possible minutes in this period
      let totalPossibleMinutes = 1440; // Default to 1 day
      if (dataByPeriod === "week") {
        totalPossibleMinutes = 1440 * 7;
      } else if (dataByPeriod === "month") {
        // Find how many days in this month
        // We can parse the periodKey if needed, but easier is to use one entry's date
        const firstEntryDate = new Date(periodEntries[0].created);
        const daysInMonth = new Date(firstEntryDate.getFullYear(), firstEntryDate.getMonth() + 1, 0).getDate();
        totalPossibleMinutes = 1440 * daysInMonth;
      }

      const leftover = totalPossibleMinutes - totalSpent;
      if (leftover > 0) {
        data.push({
          name: "Other",
          value: leftover,
          formattedValue: formatDuration(leftover),
        });
      }

      return {
        date: periodKey,
        totalSpentFormatted: formatDuration(totalSpent),
        data,
      };
    });
  }, [activities, timeEntries, dataByPeriod]);

  return <DailyActivityPieChart dailyData={dailyData} />;
};

export default TimeEntryPieCharts;
