import React, { useMemo } from "react";
import toLocalYMD from "@/utils/to-local-ymd";
import TimeEntryLineGraphList from "@/components/time-entry-line-graph-list/time-entry-line-graph-list";

type Period = "this week" | "last week" | "last 2 weeks" | "this month" | "last 2 months" | "last 6 months" | "this year" | "all";

interface TimeEntryLineGraphsProps {
  timeEntries: TimeEntry[];
  activities: Activity[];
  period: Period;
}

const collectEntries = (activityId: string, entries: TimeEntry[]): TimeEntry[] => {
  return entries
    .filter(entry => entry.activityId === activityId)
    .toSorted((a, b) => b.created.localeCompare(a.created));
};

const TimeEntryLineGraphs: React.FC<TimeEntryLineGraphsProps> = ({ timeEntries, activities, period }) => {
  const filteredTimeEntries = useMemo(() => {
    if (period === "all") return timeEntries;

    const now = new Date();
    const today = toLocalYMD(now);
    const startDate = new Date(today);

    if (period === "this week") {
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate.setDate(diff);
    } else if (period === "last week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "last 2 weeks") {
      startDate.setDate(startDate.getDate() - 14);
    } else if (period === "this month") {
      startDate.setDate(1);
    } else if (period === "last 2 months") {
      startDate.setMonth(startDate.getMonth() - 2);
    } else if (period === "last 6 months") {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (period === "this year") {
      startDate.setMonth(0, 1);
    }

    const startYMD = toLocalYMD(startDate);
    return timeEntries.filter(entry => toLocalYMD(entry.created) >= startYMD);
  }, [timeEntries, period]);

  const muda = useMemo(() => 
    activities.filter(a => a.type === "MUDA").toSorted((a, b) => a.name.localeCompare(b.name)),
    [activities]
  );
  
  const tassei = useMemo(() => 
    activities.filter(a => a.type === "TASSEI").toSorted((a, b) => a.name.localeCompare(b.name)),
    [activities]
  );

  const tasseiEntries = useMemo(() => 
    tassei.reduce<Record<string, TimeEntry[]>>((acc, activity) => {
      acc[activity.id] = collectEntries(activity.id, filteredTimeEntries);
      return acc;
    }, {}),
    [tassei, filteredTimeEntries]
  );

  const mudaEntries = useMemo(() => 
    muda.reduce<Record<string, TimeEntry[]>>((acc, activity) => {
      acc[activity.id] = collectEntries(activity.id, filteredTimeEntries);
      return acc;
    }, {}),
    [muda, filteredTimeEntries]
  );

  return (
    <>
      <TimeEntryLineGraphList 
        title="Tassei" 
        activities={tassei} 
        entriesByActivity={tasseiEntries} 
      />
      <TimeEntryLineGraphList 
        title="Muda" 
        activities={muda} 
        entriesByActivity={mudaEntries} 
      />
    </>
  );
};

export default TimeEntryLineGraphs;
