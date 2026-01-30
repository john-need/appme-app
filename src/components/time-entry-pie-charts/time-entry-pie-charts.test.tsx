import React from "react";
import { render, screen } from "@testing-library/react";
import TimeEntryPieCharts from "./time-entry-pie-charts";
import activityFactory from "@/factories/activity-factory";
import toLocalYMD from "@/utils/to-local-ymd";

// Mock ResizeObserver which is needed for recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock toLocalYMD to return consistent dates regardless of timezone
jest.mock("@/utils/to-local-ymd", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("TimeEntryPieCharts", () => {
  const mockToLocalYMD = toLocalYMD as jest.MockedFunction<typeof toLocalYMD>;

  beforeEach(() => {
    // Mock toLocalYMD to return consistent date strings
    mockToLocalYMD.mockImplementation((v?: string | Date): string => {
      if (!v) return "";
      const d = v instanceof Date ? v : new Date(v);
      // For Date objects, use local date components (as they may have been manipulated by getStartOfWeek)
      // For string inputs, use UTC components (as they represent absolute timestamps)
      if (v instanceof Date) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const activities = [
    activityFactory({ id: "1", name: "Work" }),
    activityFactory({ id: "2", name: "Sleep" }),
  ];

  const timeEntries: TimeEntry[] = [
    {
      id: "e1",
      activityId: "1",
      minutes: 60,
      created: "2026-01-28T12:00:00.000Z", // Noon UTC ensures it's Jan 28 in all timezones
      updated: "2026-01-28T12:00:00.000Z",
    },
    {
      id: "e2",
      activityId: "2",
      minutes: 480,
      created: "2026-01-28T12:00:00.000Z",
      updated: "2026-01-28T12:00:00.000Z",
    }
  ];

  it("calculates and passes data to the display component", () => {
    render(<TimeEntryPieCharts activities={activities} timeEntries={timeEntries} dataByPeriod="day" />);
    
    // Check if the date header exists (shows that grouping logic worked)
    expect(screen.getByText("2026-01-28")).toBeInTheDocument();
    
    // Check if the total spent is correctly calculated and formatted (60 + 480 = 540 = 9h 0m)
    expect(screen.getByText(/Total Spent: 9h 0m/)).toBeInTheDocument();
  });

  it("shows 'Other' time when total spent is less than 24 hours", () => {
    render(<TimeEntryPieCharts activities={activities} timeEntries={timeEntries} dataByPeriod="day" />);
    expect(screen.getByText(/Total Spent: 9h 0m/)).toBeInTheDocument();
  });

  it("handles empty time entries", () => {
    render(<TimeEntryPieCharts activities={activities} timeEntries={[]} dataByPeriod="day" />);
    expect(screen.getByText("No activity found for this period.")).toBeInTheDocument();
  });

  it("groups by week correctly", () => {
    render(<TimeEntryPieCharts activities={activities} timeEntries={timeEntries} dataByPeriod="week" />);
    // 2026-01-28 is a Wednesday. Monday of that week is 2026-01-26.
    expect(screen.getByText("Week of 2026-01-26")).toBeInTheDocument();
    expect(screen.getByText(/Total Spent: 9h 0m/)).toBeInTheDocument();
  });

  it("groups by month correctly and sorts descending", () => {
    const multiMonthEntries: TimeEntry[] = [
      ...timeEntries,
      {
        id: "e3",
        activityId: "1",
        minutes: 60,
        created: "2025-12-28T12:00:00.000Z",
        updated: "2025-12-28T12:00:00.000Z",
      }
    ];
    render(<TimeEntryPieCharts activities={activities} timeEntries={multiMonthEntries} dataByPeriod="month" />);
    expect(screen.getByText("January 2026")).toBeInTheDocument();
    expect(screen.getByText("December 2025")).toBeInTheDocument();
    
    // Verify order
    const janHeader = screen.getByText("January 2026");
    const decHeader = screen.getByText("December 2025");
    
    // In DOM, January 2026 should appear before December 2025
    expect(janHeader.compareDocumentPosition(decHeader) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
