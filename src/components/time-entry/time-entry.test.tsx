import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimeEntry } from "./time-entry";
import "@testing-library/jest-dom";

describe("TimeEntry", () => {
  const DEFAULT_TEST_ID = "time-entry";

  it("renders hours and minutes text fields with default testId", () => {
    render(<TimeEntry onChange={() => {}} />);
    expect(screen.getByTestId(`${DEFAULT_TEST_ID}-hours`)).toBeInTheDocument();
    expect(screen.getByTestId(`${DEFAULT_TEST_ID}-minutes`)).toBeInTheDocument();
    expect(screen.getByLabelText(/hours/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minutes/i)).toBeInTheDocument();
  });

  it("applies custom id and testId correctly", () => {
    const customId = "my-custom-id";
    const customTestId = "custom-control";
    render(<TimeEntry onChange={() => {}} id={customId} testId={customTestId} />);
    
    const rootBox = screen.getByTestId(customTestId);
    expect(rootBox).toHaveAttribute("id", customId);
    expect(screen.getByTestId(`${customTestId}-hours`)).toBeInTheDocument();
    expect(screen.getByTestId(`${customTestId}-minutes`)).toBeInTheDocument();
  });

  it("displays correct hours and minutes based on value prop (controlled)", () => {
    render(<TimeEntry onChange={() => {}} value={135} />); // 2h 15m
    expect(screen.getByLabelText(/hours/i)).toHaveValue(2);
    expect(screen.getByLabelText(/minutes/i)).toHaveValue(15);
  });

  it("updates display when value prop changes (controlled)", () => {
    const { rerender } = render(<TimeEntry onChange={() => {}} value={60} />);
    expect(screen.getByLabelText(/hours/i)).toHaveValue(1);
    expect(screen.getByLabelText(/minutes/i)).toHaveValue(0);

    rerender(<TimeEntry onChange={() => {}} value={125} />);
    expect(screen.getByLabelText(/hours/i)).toHaveValue(2);
    expect(screen.getByLabelText(/minutes/i)).toHaveValue(5);
  });

  it("calls onChange with correct total minutes when inputs change", () => {
    const handleChange = jest.fn();
    const { rerender } = render(<TimeEntry onChange={handleChange} value={0} />);
    
    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);

    // Change hours
    fireEvent.change(hoursInput, { target: { value: "2" } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: { value: 120 } })
    );
    
    // Controlled: display shouldn't change until prop update
    expect(hoursInput).toHaveValue(0);

    // Parent updates value
    rerender(<TimeEntry onChange={handleChange} value={120} />);
    expect(hoursInput).toHaveValue(2);

    // Change minutes
    fireEvent.change(minutesInput, { target: { value: "45" } });
    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ target: { value: 165 } })
    );
    
    expect(minutesInput).toHaveValue(0);
    rerender(<TimeEntry onChange={handleChange} value={165} />);
    expect(minutesInput).toHaveValue(45);
  });

  it("applies MUI BoxProps to the root component", () => {
    const { container } = render(<TimeEntry onChange={() => {}} mt={4} display="flex" />);
    const box = container.firstChild as HTMLElement;
    expect(box).toHaveStyle("margin-top: 32px");
    expect(box).toHaveStyle("display: flex");
  });

  it("renders the label when provided", () => {
    const label = "Activity Duration";
    render(<TimeEntry onChange={() => {}} label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  describe("uncontrolled mode", () => {
    it("uses defaultValue to initialize state", () => {
      render(<TimeEntry onChange={() => {}} defaultValue={75} />); // 1h 15m
      expect(screen.getByLabelText(/hours/i)).toHaveValue(1);
      expect(screen.getByLabelText(/minutes/i)).toHaveValue(15);
    });

    it("updates internal state and calls onChange when inputs change", () => {
      const handleChange = jest.fn();
      render(<TimeEntry onChange={handleChange} defaultValue={0} />);
      
      const hoursInput = screen.getByLabelText(/hours/i);
      const minutesInput = screen.getByLabelText(/minutes/i);

      fireEvent.change(hoursInput, { target: { value: "1" } });
      expect(hoursInput).toHaveValue(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ target: { value: 60 } })
      );

      fireEvent.change(minutesInput, { target: { value: "30" } });
      expect(minutesInput).toHaveValue(30);
      expect(handleChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ target: { value: 90 } })
      );
    });
  });
});
