import React from "react";
import { render, screen } from "@testing-library/react";
import DailyActivityPieChart, { DailyPieChartData } from "../daily-activity-pie-chart";

// Mock ResizeObserver which is needed for recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("DailyActivityPieChart", () => {
  const dailyData: DailyPieChartData[] = [
    {
      date: "2026-01-28",
      totalSpentFormatted: "9h 0m",
      data: [
        { name: "Work", value: 60, formattedValue: "1h 0m" },
        { name: "Sleep", value: 480, formattedValue: "8h 0m" },
        { name: "Other", value: 900, formattedValue: "15h 0m" },
      ],
    },
  ];

  it("renders a pie chart for each day", () => {
    render(<DailyActivityPieChart dailyData={dailyData} />);
    
    // Check if the date header exists
    expect(screen.getByText("2026-01-28")).toBeInTheDocument();
    
    // Check if the total spent subheader is correct
    expect(screen.getByText(/Total Spent: 9h 0m/)).toBeInTheDocument();
  });

  it("shows 'Activity Breakdown' title", () => {
    render(<DailyActivityPieChart dailyData={dailyData} />);
    expect(screen.getByText("Activity Breakdown")).toBeInTheDocument();
  });

  it("shows empty state message when no entries provided", () => {
    render(<DailyActivityPieChart dailyData={[]} />);
    expect(screen.getByText("No activity found for this period.")).toBeInTheDocument();
  });
});
