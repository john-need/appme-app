import React from "react";
import { render, screen } from "@testing-library/react";
import DailyActivityPieChart from "../daily-activity-pie-chart";
import activityFactory from "@/factories/activity-factory";

// Mock ResizeObserver which is needed for recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("DailyActivityPieChart", () => {
  const activities = [
    activityFactory({ id: "1", name: "Work" }),
    activityFactory({ id: "2", name: "Sleep" }),
  ];

  const timeEntries: TimeEntry[] = [
    {
      id: "e1",
      activityId: "1",
      minutes: 60,
      created: "2026-01-28T10:00:00.000Z", // In EST this is 2026-01-28 05:00:00
      updated: "2026-01-28T10:00:00.000Z",
    },
    {
      id: "e2",
      activityId: "2",
      minutes: 480,
      created: "2026-01-28T15:00:00.000Z",
      updated: "2026-01-28T15:00:00.000Z",
    }
  ];

  it("renders a pie chart for each day", () => {
    render(<DailyActivityPieChart activities={activities} timeEntries={timeEntries} />);
    
    // Check if the date header exists
    expect(screen.getByText("2026-01-28")).toBeInTheDocument();
    
    // Check if the total spent subheader is correct (60 + 480 = 540 minutes = 9h 0m)
    expect(screen.getByText(/Total Spent: 9h 0m/)).toBeInTheDocument();
  });

  it("shows 'Daily Activity Breakdown' title", () => {
    render(<DailyActivityPieChart activities={activities} timeEntries={timeEntries} />);
    expect(screen.getByText("Daily Activity Breakdown")).toBeInTheDocument();
  });

  it("shows empty state message when no entries provided", () => {
    render(<DailyActivityPieChart activities={activities} timeEntries={[]} />);
    expect(screen.getByText("No activity found for this period.")).toBeInTheDocument();
  });
});
