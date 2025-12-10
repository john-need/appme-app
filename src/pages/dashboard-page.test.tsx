import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./dashboard-page";

describe("DashboardPage", () => {
  it("renders dashboard headings and text", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("heading", { level: 4, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the dashboard/i)).toBeInTheDocument();
  });
});
