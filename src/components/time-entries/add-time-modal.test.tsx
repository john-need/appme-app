import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddTimeModal } from "./add-time-modal";
import "@testing-library/jest-dom";

describe("AddTimeModal", () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default minutes", () => {
    render(<AddTimeModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    
    expect(screen.getByText(/Add Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hours/i)).toHaveValue(0);
    expect(screen.getByLabelText(/minutes/i)).toHaveValue(0);
  });

  it("calls onSubmit with correct minutes when Add is clicked", () => {
    render(<AddTimeModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    
    const minutesInput = screen.getByLabelText(/minutes/i);
    fireEvent.change(minutesInput, { target: { value: "30" } });
    
    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(addButton);
    
    expect(onSubmit).toHaveBeenCalledWith(30);
    expect(onClose).toHaveBeenCalled();
  });

  it("disables Add button when minutes are invalid", () => {
    render(<AddTimeModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    
    const minutesInput = screen.getByLabelText(/minutes/i);
    fireEvent.change(minutesInput, { target: { value: "0" } });
    
    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toBeDisabled();
    
    fireEvent.change(minutesInput, { target: { value: "" } });
    expect(addButton).toBeDisabled();
  });

  it("calls onClose when close button is clicked", () => {
    render(<AddTimeModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it("resets minutes to 0 when closed and reopened", () => {
    const { rerender } = render(<AddTimeModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    
    // Change value
    const minutesInput = screen.getByLabelText(/minutes/i);
    fireEvent.change(minutesInput, { target: { value: "30" } });
    expect(minutesInput).toHaveValue(30);

    // Close
    rerender(<AddTimeModal open={false} onClose={onClose} onSubmit={onSubmit} />);
    
    // Reopen
    rerender(<AddTimeModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    
    // Should be reset to 0 according to requirement "reset the minutes to 0"
    expect(screen.getByLabelText(/minutes/i)).toHaveValue(0);
  });
});
