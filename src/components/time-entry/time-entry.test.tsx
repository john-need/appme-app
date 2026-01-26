import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimeEntry } from "./time-entry";
import "@testing-library/jest-dom";

describe("TimeEntry", () => {
  it("renders hours and minutes text fields", () => {
    render(<TimeEntry onChange={() => {}} />);
    expect(screen.getByLabelText(/hours/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minutes/i)).toBeInTheDocument();
  });

  it("calls onChange with correct total minutes when hours change", () => {
    const handleChange = jest.fn();
    render(<TimeEntry onChange={handleChange} />);
    
    const hoursInput = screen.getByLabelText(/hours/i);
    fireEvent.change(hoursInput, { target: { value: "2" } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 120,
        }),
      })
    );
  });

  it("calls onChange with correct total minutes when minutes change", () => {
    const handleChange = jest.fn();
    render(<TimeEntry onChange={handleChange} />);
    
    const minutesInput = screen.getByLabelText(/minutes/i);
    fireEvent.change(minutesInput, { target: { value: "45" } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 45,
        }),
      })
    );
  });

  it("calculates total minutes correctly when both change", () => {
    const handleChange = jest.fn();
    render(<TimeEntry onChange={handleChange} />);
    
    const hoursInput = screen.getByLabelText(/hours/i);
    const minutesInput = screen.getByLabelText(/minutes/i);

    fireEvent.change(hoursInput, { target: { value: "1" } });
    fireEvent.change(minutesInput, { target: { value: "30" } });

    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 90,
        }),
      })
    );
  });

  it("applies BoxProps to the root component", () => {
    const { container } = render(<TimeEntry onChange={() => {}} mt={4} />);
    // MUI Box with mt={4} typically adds a margin-top class or style.
    // We can check if the first child (the Box) has the expected property.
    const box = container.firstChild as HTMLElement;
    expect(box).toHaveStyle("margin-top: 32px"); // mt: 4 * 8px = 32px by default in MUI
  });
});
