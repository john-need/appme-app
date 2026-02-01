import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WeeklyOccurrenceSelector from "./weekly-occurrence-selector";

describe("WeeklyOccurrenceSelector", () => {
  it("renders collapsed when isOpen is false", () => {
    const onOccurrenceChange = jest.fn();
    const { container } = render(
      <WeeklyOccurrenceSelector
        isOpen={false}
        occurrences={[]}
        onOccurrenceChange={onOccurrenceChange}
      />
    );
    const collapse = container.querySelector(".MuiCollapse-root");
    expect(collapse).toBeInTheDocument();
  });

  it("renders expanded with weekday buttons when isOpen is true", () => {
    const onOccurrenceChange = jest.fn();
    render(
      <WeeklyOccurrenceSelector
        isOpen={true}
        occurrences={[]}
        onOccurrenceChange={onOccurrenceChange}
      />
    );

    expect(screen.getByLabelText("Monday")).toBeInTheDocument();
    expect(screen.getByLabelText("Tuesday")).toBeInTheDocument();
    expect(screen.getByLabelText("Wednesday")).toBeInTheDocument();
    expect(screen.getByLabelText("Thursday")).toBeInTheDocument();
    expect(screen.getByLabelText("Friday")).toBeInTheDocument();
    expect(screen.getByLabelText("Saturday")).toBeInTheDocument();
    expect(screen.getByLabelText("Sunday")).toBeInTheDocument();
  });

  it("shows selected days based on occurrences prop", () => {
    const onOccurrenceChange = jest.fn();
    render(
      <WeeklyOccurrenceSelector
        isOpen={true}
        occurrences={["WEEKLY_MONDAY", "WEEKLY_FRIDAY"]}
        onOccurrenceChange={onOccurrenceChange}
      />
    );

    const mondayButton = screen.getByLabelText("Monday");
    const fridayButton = screen.getByLabelText("Friday");
    const tuesdayButton = screen.getByLabelText("Tuesday");

    expect(mondayButton).toHaveClass("Mui-selected");
    expect(fridayButton).toHaveClass("Mui-selected");
    expect(tuesdayButton).not.toHaveClass("Mui-selected");
  });

  it("calls onOccurrenceChange with filtered weekly occurrences when a day is toggled", async () => {
    const user = userEvent.setup();
    const onOccurrenceChange = jest.fn();
    render(
      <WeeklyOccurrenceSelector
        isOpen={true}
        occurrences={["WEEKLY_MONDAY"]}
        onOccurrenceChange={onOccurrenceChange}
      />
    );

    await user.click(screen.getByLabelText("Friday"));

    expect(onOccurrenceChange).toHaveBeenCalledWith(expect.arrayContaining(["WEEKLY_MONDAY", "WEEKLY_FRIDAY"]));
  });

  it("filters out non-WEEKLY occurrences when handling changes", async () => {
    const user = userEvent.setup();
    const onOccurrenceChange = jest.fn();
    render(
      <WeeklyOccurrenceSelector
        isOpen={true}
        occurrences={["WEEKLY_MONDAY", "DAILY", "NEVER"]}
        onOccurrenceChange={onOccurrenceChange}
      />
    );

    await user.click(screen.getByLabelText("Tuesday"));

    // Should only contain WEEKLY_ occurrences
    expect(onOccurrenceChange).toHaveBeenCalledWith(
      expect.arrayContaining(["WEEKLY_MONDAY", "WEEKLY_TUESDAY"])
    );
    expect(onOccurrenceChange).toHaveBeenCalledWith(
      expect.not.arrayContaining(["DAILY", "NEVER"])
    );
  });
});
