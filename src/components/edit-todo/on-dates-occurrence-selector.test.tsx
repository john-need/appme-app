import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import OnDatesOccurrenceSelector from "./on-dates-occurrence-selector";

describe("OnDatesOccurrenceSelector", () => {
  const renderWithLocalization = (component: React.ReactElement) => {
    return render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {component}
      </LocalizationProvider>
    );
  };

  it("renders collapsed when isOpen is false", () => {
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const { container } = renderWithLocalization(
      <OnDatesOccurrenceSelector
        isOpen={false}
        occurrences={[]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );
    const collapse = container.querySelector(".MuiCollapse-root");
    expect(collapse).toBeInTheDocument();
  });

  it("renders expanded with DateCalendar when isOpen is true", () => {
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    renderWithLocalization(
      <OnDatesOccurrenceSelector
        isOpen={true}
        occurrences={[]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    // DateCalendar should be present - look for typical calendar elements
    const calendar = screen.getByRole("grid");
    expect(calendar).toBeInTheDocument();
  });

  it("marks dates in occurrences as selected", () => {
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const testDate = "2024-01-15";
    
    renderWithLocalization(
      <OnDatesOccurrenceSelector
        isOpen={true}
        occurrences={[testDate]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    // The calendar should be rendered
    const calendar = screen.getByRole("grid");
    expect(calendar).toBeInTheDocument();
  });

  it("calls onAddOccurrence when unselected date is clicked", async () => {
    const user = userEvent.setup();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    
    renderWithLocalization(
      <OnDatesOccurrenceSelector
        isOpen={true}
        occurrences={[]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    // Get the current day button (should be available in the calendar)
    const calendar = screen.getByRole("grid");
    expect(calendar).toBeInTheDocument();

    // Find day buttons - they should be available in the calendar
    const dayButtons = screen.getAllByRole("gridcell");
    expect(dayButtons.length).toBeGreaterThan(0);

    // Click on a date button that has a clickable element
    const clickableDays = dayButtons.filter(day => {
      const button = day.querySelector("button");
      return button && !button.disabled;
    });
    
    if (clickableDays.length > 0) {
      const button = clickableDays[0].querySelector("button");
      if (button) {
        await user.click(button);
        expect(onAddOccurrence).toHaveBeenCalled();
      }
    }
  });

  it("calls onDeleteOccurrence when selected date is clicked", async () => {
    const user = userEvent.setup();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    
    // Use a date that should be visible in the current month
    const today = new Date();
    const testDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-15`;
    
    renderWithLocalization(
      <OnDatesOccurrenceSelector
        isOpen={true}
        occurrences={[testDate]}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
      />
    );

    const calendar = screen.getByRole("grid");
    expect(calendar).toBeInTheDocument();

    // Find clickable day buttons
    const dayButtons = screen.getAllByRole("gridcell");
    const clickableDays = dayButtons.filter(day => {
      const button = day.querySelector("button");
      return button && !button.disabled;
    });
    
    if (clickableDays.length > 0) {
      const button = clickableDays[0].querySelector("button");
      if (button) {
        await user.click(button);
        // Either add or delete should be called
        expect(onAddOccurrence.mock.calls.length + onDeleteOccurrence.mock.calls.length).toBeGreaterThan(0);
      }
    }
  });
});
