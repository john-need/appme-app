import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MonthlyOccurrenceSelector from "./monthly-occurrence-selector";

describe("MonthlyOccurrenceSelector", () => {
  it("renders collapsed when isOpen is false", () => {
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const { container } = render(
      <MonthlyOccurrenceSelector
        isOpen={false}
        occurrences={[]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );
    const collapse = container.querySelector(".MuiCollapse-root");
    expect(collapse).toBeInTheDocument();
  });

  it("renders expanded with Set By radio group when isOpen is true", () => {
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    render(
      <MonthlyOccurrenceSelector
        isOpen={true}
        occurrences={[]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    expect(screen.getByText("Set By")).toBeInTheDocument();
    expect(screen.getByLabelText("Day")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
  });

  it("shows day grid by default with nth day buttons", () => {
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    render(
      <MonthlyOccurrenceSelector
        isOpen={true}
        occurrences={[]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    expect(screen.getByText("1ST mon")).toBeInTheDocument();
    expect(screen.getByText("2ND tue")).toBeInTheDocument();
    expect(screen.getByText("LAST fri")).toBeInTheDocument();
  });

  it("switches to date grid when Date radio is selected", async () => {
    const user = userEvent.setup();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    render(
      <MonthlyOccurrenceSelector
        isOpen={true}
        occurrences={[]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    await user.click(screen.getByLabelText("Date"));

    // Date grid should show numbers 1-31
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
  });

  it("highlights selected nth day occurrences", () => {
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    render(
      <MonthlyOccurrenceSelector
        isOpen={true}
        occurrences={["MONTHLY_1ST_MONDAY", "MONTHLY_2ND_FRIDAY"]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    const firstMondayBtn = screen.getByText("1ST mon");
    const secondFridayBtn = screen.getByText("2ND fri");
    
    expect(firstMondayBtn).toBeInTheDocument();
    expect(secondFridayBtn).toBeInTheDocument();
  });

  it("calls onAddOccurrence when unselected day button is clicked", async () => {
    const user = userEvent.setup();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    render(
      <MonthlyOccurrenceSelector
        isOpen={true}
        occurrences={[]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    await user.click(screen.getByText("1ST mon"));

    expect(onAddOccurrence).toHaveBeenCalledWith("MONTHLY_1ST_MONDAY");
  });

  it("calls onDeleteOccurrence when selected day button is clicked", async () => {
    const user = userEvent.setup();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    render(
      <MonthlyOccurrenceSelector
        isOpen={true}
        occurrences={["MONTHLY_1ST_MONDAY"]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    await user.click(screen.getByText("1ST mon"));

    expect(onDeleteOccurrence).toHaveBeenCalledWith("MONTHLY_1ST_MONDAY");
  });

  it("calls onAddOccurrence when unselected date button is clicked", async () => {
    const user = userEvent.setup();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    render(
      <MonthlyOccurrenceSelector
        isOpen={true}
        occurrences={[]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    await user.click(screen.getByLabelText("Date"));
    await user.click(screen.getByText("15"));

    expect(onAddOccurrence).toHaveBeenCalledWith("MONTHLY_DAY_15");
  });

  it("calls onDeleteOccurrence when selected date button is clicked", async () => {
    const user = userEvent.setup();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    render(
      <MonthlyOccurrenceSelector
        isOpen={true}
        occurrences={["MONTHLY_DAY_15"]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    await user.click(screen.getByLabelText("Date"));
    await user.click(screen.getByText("15"));

    expect(onDeleteOccurrence).toHaveBeenCalledWith("MONTHLY_DAY_15");
  });
});
