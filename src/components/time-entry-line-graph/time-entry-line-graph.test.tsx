import React from "react";
import { render, screen } from "@testing-library/react";
import TimeEntryLineGraph from "./time-entry-line-graph";

// Mock recharts components
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div style={{ width: "800px", height: "400px" }}>{children}</div>
  ),
  BarChart: ({ children, data }: { children: React.ReactNode; data: any[] }) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Minutes Spent</div>,
  ReferenceLine: ({ label }: { label: string }) => <div>{label}</div>,
}));

describe("TimeEntryLineGraph", () => {
  const mockActivity: Activity = {
    id: "1",
    name: "Test Activity",
    type: "TASSEI",
    created: "2026-01-01T00:00:00.000Z",
    updated: "2026-01-01T00:00:00.000Z",
    goal: 60,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    weekends: false,
  };

  beforeAll(() => {
    // Mocking Date to have consistent results
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-05T12:00:00Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders the activity name", () => {
    render(<TimeEntryLineGraph activity={mockActivity} timeEntries={[]} />);
    expect(screen.getByText("Test Activity")).toBeInTheDocument();
  });

  it("renders the goal line label when goal is present", () => {
    render(<TimeEntryLineGraph activity={mockActivity} timeEntries={[]} />);
    // Recharts ReferenceLine with label "Goal" should render text "Goal"
    expect(screen.getByText("Goal")).toBeInTheDocument();
  });

  it("does not render the goal line label when goal is absent", () => {
    const activityNoGoal = { ...mockActivity, goal: undefined };
    render(<TimeEntryLineGraph activity={activityNoGoal} timeEntries={[]} />);
    expect(screen.queryByText("Goal")).not.toBeInTheDocument();
  });

  it("aggregates multiple time entries on the same day", () => {
    const multipleEntries: TimeEntry[] = [
      {
        id: "te1",
        activityId: "1",
        minutes: 30,
        created: "2026-01-05T10:00:00Z",
        updated: "2026-01-05T10:00:00Z",
      },
      {
        id: "te2",
        activityId: "1",
        minutes: 45,
        created: "2026-01-05T15:00:00Z",
        updated: "2026-01-05T15:00:00Z",
      },
    ];
    render(<TimeEntryLineGraph activity={mockActivity} timeEntries={multipleEntries} />);
    
    const chart = screen.getByTestId("bar-chart");
    const data = JSON.parse(chart.getAttribute("data-chart-data") || "[]");
    
    // Find the entry for 2026-01-05
    const todayData = data.find((d: any) => d.date === "2026-01-05");
    expect(todayData.minutes).toBe(75); // 30 + 45
  });

  it("handles time entries outside of the current year range correctly (ignored)", () => {
    const oldEntry: TimeEntry[] = [
      {
        id: "te-old",
        activityId: "1",
        minutes: 100,
        created: "2024-12-31T23:59:59Z",
        updated: "2024-12-31T23:59:59Z",
      },
    ];
    render(<TimeEntryLineGraph activity={mockActivity} timeEntries={oldEntry} />);
    
    const chart = screen.getByTestId("bar-chart");
    const data = JSON.parse(chart.getAttribute("data-chart-data") || "[]");
    
    // Data should only contain dates from Jan 1 2026 to Jan 5 2026
    expect(data.length).toBe(5); 
    const totalMinutes = data.reduce((acc: number, d: any) => acc + d.minutes, 0);
    expect(totalMinutes).toBe(0);
  });
});
