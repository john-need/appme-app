import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./dashboard-page";
import { useAppSelector } from "@/hooks";
import TimeEntryLineGraphs from "@/components/time-entry-line-graphs/time-entry-line-graphs";
import TimeEntryPieCharts from "@/components/time-entry-pie-charts/time-entry-pie-charts";

// Mock the hooks
jest.mock("@/hooks", () => ({
  useAppSelector: jest.fn(),
}));

// Mock the TimeEntryLineGraphs component
jest.mock("@/components/time-entry-line-graphs/time-entry-line-graphs", () => {
  return jest.fn(() => <div data-testid="time-entry-line-graphs" />);
});

// Mock the TimeEntryPieCharts component
jest.mock("@/components/time-entry-pie-charts/time-entry-pie-charts", () => {
  return jest.fn(() => <div data-testid="time-entry-pie-charts" />);
});

// Mock iso2LocalDateTime
jest.mock("@/utils/iso-2-local-date-time", () => ({
  __esModule: true,
  default: jest.fn((date) => date),
}));

describe("DashboardPage", () => {
  const mockActivities: Activity[] = [
    {
      id: "1",
      name: "Tassei Activity",
      type: "TASSEI",
      created: "2026-01-01T00:00:00.000Z",
      updated: "2026-01-01T00:00:00.000Z",
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
      weekends: false,
    },
    {
      id: "2",
      name: "Muda Activity",
      type: "MUDA",
      created: "2026-01-01T00:00:00.000Z",
      updated: "2026-01-01T00:00:00.000Z",
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
      weekends: false,
    },
  ];

  const mockTimeEntries: TimeEntry[] = [
    {
      id: "te1",
      activityId: "1",
      minutes: 30,
      created: "2026-01-05T10:00:00Z",
      updated: "2026-01-05T10:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      // Logic to distinguish between selectActivities and the inline selector for timeEntries
      const selectorStr = selector.toString();
      if (selectorStr.includes("activities") || selectorStr.includes("selectActivities")) {
        return mockActivities;
      }
      // This matches (s) => s.timeEntries?.items ?? []
      return mockTimeEntries;
    });
  });

  it("renders Tassei and Muda through TimeEntryLineGraphs", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("time-entry-line-graphs")).toBeInTheDocument();
  });

  it("renders TimeEntryPieCharts with correct props", () => {
    render(<DashboardPage />);
    expect(TimeEntryPieCharts).toHaveBeenCalledWith(
      expect.objectContaining({
        activities: mockActivities,
        dataByPeriod: "day"
      }),
      undefined
    );
  });

  it("renders TimeEntryLineGraphs with correct props", () => {
    render(<DashboardPage />);
    expect(TimeEntryLineGraphs).toHaveBeenCalledWith(
      expect.objectContaining({
        activities: mockActivities,
        period: "last week"
      }),
      undefined
    );
  });
});
