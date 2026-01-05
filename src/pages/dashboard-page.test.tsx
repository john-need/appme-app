import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./dashboard-page";
import { useAppSelector } from "@/hooks";
import TimeEntryLineGraph from "@/components/time-entry-line-graph/time-entry-line-graph";

// Mock the hooks
jest.mock("@/hooks", () => ({
  useAppSelector: jest.fn(),
}));

// Mock the TimeEntryLineGraph component
jest.mock("@/components/time-entry-line-graph/time-entry-line-graph", () => {
  return jest.fn(() => <div data-testid="time-entry-line-graph" />);
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

  it("renders Tassei and Muda headers", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Tassei")).toBeInTheDocument();
    expect(screen.getByText("Muda")).toBeInTheDocument();
  });

  it("renders TimeEntryLineGraph for each activity with correct props", () => {
    render(<DashboardPage />);
    
    // Verify Tassei activity graph
    expect(TimeEntryLineGraph).toHaveBeenCalledWith(
      expect.objectContaining({
        activity: mockActivities[0],
        timeEntries: expect.arrayContaining([
          expect.objectContaining({ id: "te1", activityId: "1" })
        ])
      }),
      undefined
    );

    // Verify Muda activity graph
    expect(TimeEntryLineGraph).toHaveBeenCalledWith(
      expect.objectContaining({
        activity: mockActivities[1],
        timeEntries: []
      }),
      undefined
    );
    
    const graphs = screen.getAllByTestId("time-entry-line-graph");
    expect(graphs).toHaveLength(2);
  });
});
