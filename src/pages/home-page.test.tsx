import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "./home-page";

// Mock selector hook and child component
jest.mock("@/hooks", () => ({
  useAppSelector: (fn: any) => fn({ timeEntries: { items: [{ id: "t1" }, { id: "t2" }] } }),
}));

// eslint-disable-next-line react/display-name
jest.mock("@/components/time-entries/time-entries", () => (props: any) => (
  <div>TimeEntries Mock count={props.timeEntries?.length ?? 0}</div>
));

describe("HomePage", () => {
  it("passes time entries from store to TimeEntries", () => {
    render(<HomePage />);
    expect(screen.getByText(/TimeEntries Mock count=2/)).toBeInTheDocument();
  });
});
