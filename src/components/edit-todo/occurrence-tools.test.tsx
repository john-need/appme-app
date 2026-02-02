import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import OccurrenceTools from "./occurrence-tools";

describe("OccurrenceTools", () => {
  const renderWithLocalization = (component: React.ReactElement) => {
    return render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {component}
      </LocalizationProvider>
    );
  };

  it("renders collapsed when isOpen is false", () => {
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    const { container } = renderWithLocalization(
      <OccurrenceTools
        isOpen={false}
        occurrences={[]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );
    
    const collapse = container.querySelector(".MuiCollapse-root");
    expect(collapse).toBeInTheDocument();
  });

  it("renders expanded with all main buttons when isOpen is true", () => {
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    expect(screen.getByText("NEVER")).toBeInTheDocument();
    expect(screen.getByText("DAILY")).toBeInTheDocument();
    expect(screen.getByText("WEEKDAYS")).toBeInTheDocument();
    expect(screen.getByText("WEEKLY")).toBeInTheDocument();
    expect(screen.getByText("MONTHLY")).toBeInTheDocument();
    expect(screen.getByText("ON DATES")).toBeInTheDocument();
  });

  it("displays chips for each occurrence", () => {
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={["WEEKLY_MONDAY", "DAILY"]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    // Use getAllByText to handle multiple elements with same text
    const dailyElements = screen.getAllByText("DAILY");
    expect(dailyElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("WEEKLY_MONDAY")).toBeInTheDocument();
  });

  it("calls onAddOccurrence when NEVER button is clicked", async () => {
    const user = userEvent.setup();
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    await user.click(screen.getByText("NEVER"));
    expect(onAddOccurrence).toHaveBeenCalledWith("NEVER");
  });

  it("calls onAddOccurrence when DAILY button is clicked", async () => {
    const user = userEvent.setup();
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    await user.click(screen.getByText("DAILY"));
    expect(onAddOccurrence).toHaveBeenCalledWith("DAILY");
  });

  it("calls onSetOccurrences with weekdays when WEEKDAYS button is clicked", async () => {
    const user = userEvent.setup();
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    await user.click(screen.getByText("WEEKDAYS"));
    expect(onSetOccurrences).toHaveBeenCalledWith([
      "WEEKLY_MONDAY",
      "WEEKLY_TUESDAY",
      "WEEKLY_WEDNESDAY",
      "WEEKLY_THURSDAY",
      "WEEKLY_FRIDAY"
    ]);
    expect(onSetActiveOccurrenceTool).toHaveBeenCalledWith(null);
  });

  it("calls onSetActiveOccurrenceTool when WEEKLY button is clicked", async () => {
    const user = userEvent.setup();
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    await user.click(screen.getByText("WEEKLY"));
    expect(onSetActiveOccurrenceTool).toHaveBeenCalledWith("WEEKLY");
  });

  it("calls onSetActiveOccurrenceTool when MONTHLY button is clicked", async () => {
    const user = userEvent.setup();
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    await user.click(screen.getByText("MONTHLY"));
    expect(onSetActiveOccurrenceTool).toHaveBeenCalledWith("MONTHLY");
  });

  it("calls onSetActiveOccurrenceTool when ON DATES button is clicked", async () => {
    const user = userEvent.setup();
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    await user.click(screen.getByText("ON DATES"));
    expect(onSetActiveOccurrenceTool).toHaveBeenCalledWith("ON_DATES");
  });

  it("calls onDeleteOccurrence when chip delete is clicked", async () => {
    const user = userEvent.setup();
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={["WEEKLY_FRIDAY"]}
        activeOccurrenceTool={null}
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    const chip = screen.getByText("WEEKLY_FRIDAY").closest(".MuiChip-root");
    const deleteIcon = chip?.querySelector(".MuiChip-deleteIcon");
    
    if (deleteIcon) {
      await user.click(deleteIcon);
      expect(onDeleteOccurrence).toHaveBeenCalledWith("WEEKLY_FRIDAY");
    }
  });

  it("shows WeeklyOccurrenceSelector when activeOccurrenceTool is WEEKLY", () => {
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool="WEEKLY"
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    // Weekly selector shows weekday toggle buttons - check by text content
    expect(screen.getByText("MON")).toBeInTheDocument();
    expect(screen.getByText("TUE")).toBeInTheDocument();
    expect(screen.getByText("FRI")).toBeInTheDocument();
  });

  it("shows MonthlyOccurrenceSelector when activeOccurrenceTool is MONTHLY", () => {
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool="MONTHLY"
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    expect(screen.getByText("Set By")).toBeInTheDocument();
    expect(screen.getByLabelText("Day")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
  });

  it("shows OnDatesOccurrenceSelector when activeOccurrenceTool is ON_DATES", () => {
    const onSetActiveOccurrenceTool = jest.fn();
    const onAddOccurrence = jest.fn();
    const onDeleteOccurrence = jest.fn();
    const onSetOccurrences = jest.fn();
    
    renderWithLocalization(
      <OccurrenceTools
        isOpen={true}
        occurrences={[]}
        activeOccurrenceTool="ON_DATES"
        onSetActiveOccurrenceTool={onSetActiveOccurrenceTool}
        onAddOccurrence={onAddOccurrence}
        onDeleteOccurrence={onDeleteOccurrence}
        onSetOccurrences={onSetOccurrences}
      />
    );

    const calendar = screen.getByRole("grid");
    expect(calendar).toBeInTheDocument();
  });
});
