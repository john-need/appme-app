import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditTimeEntryModal from "./edit-time-entry-modal";
import "@testing-library/jest-dom";
import toLocalYMD from "@/utils/to-local-ymd";
import formatTime from "@/utils/format-time";

const mockTimeEntry: TimeEntry = {
    id: "t1",
    activityId: "a1",
    minutes: 45,
    notes: "Initial notes",
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
};

describe("EditTimeEntryModal", () => {
    it("renders with initial values", () => {
        render(
            <EditTimeEntryModal
                open={true}
                timeEntry={mockTimeEntry}
                onClose={() => {}}
                onSubmit={() => {}}
            />
        );

        expect(screen.getByText(/Edit Time Entry/i)).toBeInTheDocument();
        // TimeEntry component uses labels "hours" and "minutes"
        expect(screen.getByLabelText(/hours/i)).toHaveValue(0);
        expect(screen.getByLabelText(/minutes/i)).toHaveValue(45);
        expect(screen.getByLabelText(/Notes/i)).toHaveValue("Initial notes");
        
        const expectedDateString = `${toLocalYMD(mockTimeEntry.created)} ${formatTime(mockTimeEntry.created)}`;
        expect(screen.getByText(expectedDateString)).toBeInTheDocument();
    });

    it("calls onSubmit with updated values when Save is clicked", () => {
        const handleSubmit = jest.fn();
        render(
            <EditTimeEntryModal
                open={true}
                timeEntry={mockTimeEntry}
                onClose={() => {}}
                onSubmit={handleSubmit}
            />
        );

        // Change hours to 1
        fireEvent.change(screen.getByLabelText(/hours/i), { target: { value: "1" } });
        // Change minutes to 15 (Total 75 minutes)
        fireEvent.change(screen.getByLabelText(/minutes/i), { target: { value: "15" } });
        
        fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: "Updated notes" } });

        fireEvent.click(screen.getByRole("button", { name: /Save/i }));

        expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
            minutes: 75,
            notes: "Updated notes",
        }));
    });

    it("disables Save button when minutes is less than 1", () => {
        render(
            <EditTimeEntryModal
                open={true}
                timeEntry={mockTimeEntry}
                onClose={() => {}}
                onSubmit={() => {}}
            />
        );

        const saveButton = screen.getByRole("button", { name: /Save/i });
        expect(saveButton).toBeEnabled();

        // Set hours and minutes to 0
        fireEvent.change(screen.getByLabelText(/hours/i), { target: { value: "0" } });
        fireEvent.change(screen.getByLabelText(/minutes/i), { target: { value: "0" } });
        
        expect(saveButton).toBeDisabled();
    });

    it("calls onClose when close button is clicked", () => {
        const handleClose = jest.fn();
        render(
            <EditTimeEntryModal
                open={true}
                timeEntry={mockTimeEntry}
                onClose={handleClose}
                onSubmit={() => {}}
            />
        );

        fireEvent.click(screen.getByLabelText(/close/i));
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
