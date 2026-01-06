import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddActivityModal from "./add-activity-modal";

describe("AddActivityModal", () => {
  it("renders dialog with title and core fields", () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<AddActivityModal open={true} onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Add Activity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Goal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    // schedule checkboxes
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Weekends"].forEach((lbl) => {
      expect(screen.getByLabelText(lbl)).toBeInTheDocument();
    });
  });

  it("disables Add until name and goal are valid (>= 0)", async () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<AddActivityModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    const user = userEvent.setup();

    const addBtn = screen.getByRole("button", { name: /add/i });
    expect(addBtn).toBeDisabled();

    await user.type(screen.getByLabelText(/Name/i), "Read");
    // still disabled because goal missing/invalid
    expect(addBtn).toBeDisabled();

    await user.clear(screen.getByLabelText(/Goal/i));
    await user.type(screen.getByLabelText(/Goal/i), "-1");
    expect(addBtn).toBeDisabled();

    await user.clear(screen.getByLabelText(/Goal/i));
    await user.type(screen.getByLabelText(/Goal/i), "0");
    expect(addBtn).toBeEnabled();

    await user.clear(screen.getByLabelText(/Goal/i));
    await user.type(screen.getByLabelText(/Goal/i), "15");
    expect(addBtn).toBeEnabled();
  });

  it("submits payload with defaults and provided values when valid", async () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<AddActivityModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Name/i), "Workout");
    // change type from default TASSEI to MUDA to verify select behavior
    const typeSelect = screen.getByLabelText(/Type/i);
    await user.click(typeSelect);
    const mudaOption = await screen.findByRole("option", { name: "MUDA" });
    await user.click(mudaOption);

    await user.clear(screen.getByLabelText(/Goal/i));
    await user.type(screen.getByLabelText(/Goal/i), "30");
    await user.type(screen.getByLabelText(/Comment/i), "evening session");

    // schedule: Mon, Wed, Fri
    await user.click(screen.getByLabelText("Mon"));
    await user.click(screen.getByLabelText("Wed"));
    await user.click(screen.getByLabelText("Fri"));

    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const payload = (onSubmit.mock.calls[0] as any[])[0] as Partial<Activity>;
    expect(payload).toMatchObject({
      name: "Workout",
      type: "MUDA",
      comment: "evening session",
      goal: 30,
      monday: true,
      wednesday: true,
      friday: true,
    });
    // unchecked boxes should be false by default
    expect(payload.tuesday).toBe(false);
    expect(payload.thursday).toBe(false);
  }, 15000);

  it("keeps Weekends mutually exclusive with Sat/Sun selections", async () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<AddActivityModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    const user = userEvent.setup();

    // select Weekends -> Sat/Sun should uncheck
    const weekends = screen.getByLabelText("Weekends") as HTMLInputElement;
    const sat = screen.getByLabelText("Sat") as HTMLInputElement;
    const sun = screen.getByLabelText("Sun") as HTMLInputElement;

    await user.click(sat); // sat true
    await user.click(sun); // sun true
    expect(sat.checked).toBe(true);
    expect(sun.checked).toBe(true);

    await user.click(weekends); // weekends true -> sat/sun become false
    expect((screen.getByLabelText("Weekends") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Sat") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("Sun") as HTMLInputElement).checked).toBe(false);

    // selecting Sat again should unset Weekends
    await user.click(screen.getByLabelText("Sat"));
    expect((screen.getByLabelText("Sat") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Weekends") as HTMLInputElement).checked).toBe(false);
  });

  it("calls onClose when close button clicked", async () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<AddActivityModal open={true} onClose={onClose} onSubmit={onSubmit} />);
    const user = userEvent.setup();

    // The small floating close button has aria-label="close"
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
