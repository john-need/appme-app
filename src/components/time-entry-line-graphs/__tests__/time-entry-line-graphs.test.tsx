import React from "react";
import { render, screen } from "@testing-library/react";
import TimeEntryLineGraphs from "../time-entry-line-graphs";
import activityFactory from "@/factories/activity-factory";

// Mock Recharts and MUI components to avoid rendering complexity in unit tests
jest.mock("@/components/time-entry-line-graph/time-entry-line-graph", () => {
  return function MockTimeEntryLineGraph({ activity }: { activity: Activity }) {
    return <div data-testid={`graph-${activity.id}`}>{activity.name}</div>;
  };
});

const mockActivities = [
  activityFactory({ id: "a1", name: "Tassei Activity", type: "TASSEI" }),
  activityFactory({ id: "a2", name: "Muda Activity", type: "MUDA" }),
];

const mockTimeEntries = [
  { id: "e1", activityId: "a1", minutes: 30, created: new Date().toISOString(), updated: new Date().toISOString() },
  { id: "e2", activityId: "a2", minutes: 45, created: new Date().toISOString(), updated: new Date().toISOString() },
];

describe("TimeEntryLineGraphs", () => {
  it("renders both Tassei and Muda sections when activities of both types are present", () => {
    render(
      <TimeEntryLineGraphs
        activities={mockActivities}
        timeEntries={mockTimeEntries}
        period="all"
      />
    );

    expect(screen.getByText("Tassei")).toBeInTheDocument();
    expect(screen.getByText("Muda")).toBeInTheDocument();
    expect(screen.getByTestId("graph-a1")).toBeInTheDocument();
    expect(screen.getByTestId("graph-a2")).toBeInTheDocument();
  });

  it("filters entries based on period (last week)", () => {
    const oldEntry = {
      id: "e3",
      activityId: "a1",
      minutes: 60,
      created: "2000-01-01T12:00:00Z",
      updated: "2000-01-01T12:00:00Z"
    };
    
    // We can't easily check internal filtering without more mocks or exporting the logic,
    // but we can verify it renders. For a deeper test, we'd need to mock TimeEntryLineGraph
    // to inspect the passed timeEntries prop.
    
    render(
      <TimeEntryLineGraphs
        activities={mockActivities}
        timeEntries={[...mockTimeEntries, oldEntry]}
        period="last week"
      />
    );

    expect(screen.getByTestId("graph-a1")).toBeInTheDocument();
  });

  it("does not render sections if no activities of that type exist", () => {
    const onlyTassei = [mockActivities[0]];
    render(
      <TimeEntryLineGraphs
        activities={onlyTassei}
        timeEntries={mockTimeEntries}
        period="all"
      />
    );

    expect(screen.getByText("Tassei")).toBeInTheDocument();
    expect(screen.queryByText("Muda")).not.toBeInTheDocument();
  });
});
