import React from "react";
import { render, screen  } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditActivityModal from "./edit-activity-modal";

const baseActivity: Activity = {
  id: "a1",
  name: "Daily Run",
  type: "TASSEI",
  goal: 30,
  comment: "morning",
  monday: true,
  tuesday: false,
  wednesday: true,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
  weekends: false,
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
};

describe("EditActivityModal", () => {
  it("renders dialog with title and prefilled fields from activity", () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<EditActivityModal open={true} onClose={onClose} onSubmit={onSubmit} activity={baseActivity} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Edit Activity/i)).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    const goalInput = screen.getByLabelText(/Goal/i) as HTMLInputElement;
    const commentInput = screen.getByLabelText(/Comment/i) as HTMLInputElement;

    expect(nameInput.value).toBe("Daily Run");
    expect(goalInput.value).toBe("30");
    expect(commentInput.value).toBe("morning");

    // Type select should reflect the initial type
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
  });

  it("disables Save when invalid and enables when fixed", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<EditActivityModal open={true} onClose={onClose} onSubmit={onSubmit} activity={baseActivity} />);

    const saveBtn = screen.getByRole("button", { name: /save/i });
    // initially valid
    expect(saveBtn).toBeEnabled();

    // make invalid: clear name
    const nameInput = screen.getByLabelText(/Name/i);
    await user.clear(nameInput);
    expect(saveBtn).toBeDisabled();

    // restore name but make goal invalid (negative)
    await user.type(nameInput, "Jogging");
    expect(saveBtn).toBeEnabled();
    const goalInput = screen.getByLabelText(/Goal/i);
    await user.clear(goalInput);
    await user.type(goalInput, "-1");
    expect(saveBtn).toBeDisabled();

    // fix goal (0 is allowed)
    await user.clear(goalInput);
    await user.type(goalInput, "0");
    expect(saveBtn).toBeEnabled();

    // fix goal
    await user.clear(goalInput);
    await user.type(goalInput, "45");
    expect(saveBtn).toBeEnabled();
  }, 15000);

  it("submits payload with id and updated values when Save clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<EditActivityModal open={true} onClose={onClose} onSubmit={onSubmit} activity={baseActivity} />);

    // Change fields
    await user.clear(screen.getByLabelText(/Name/i));
    await user.type(screen.getByLabelText(/Name/i), "Evening Run");

    // Change type to MUDA
    const typeSelect = screen.getByLabelText(/Type/i);
    await user.click(typeSelect);
    const mudaOption = await screen.findByRole("option", { name: "MUDA" });
    await user.click(mudaOption);

    await user.clear(screen.getByLabelText(/Goal/i));
    await user.type(screen.getByLabelText(/Goal/i), "60");
    await user.clear(screen.getByLabelText(/Comment/i));
    await user.type(screen.getByLabelText(/Comment/i), "evening session");

    // Toggle some schedule flags: ensure Fri set true, Tue true, keep Mon/Wed from base
    await user.click(screen.getByLabelText("Tue"));
    await user.click(screen.getByLabelText("Fri"));

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = (onSubmit.mock.calls[0] as any[])[0] as Partial<Activity>;
    expect(payload).toMatchObject({
      id: "a1",
      name: "Evening Run",
      type: "MUDA",
      comment: "evening session",
      goal: 60,
      monday: true,
      wednesday: true,
      tuesday: true,
      friday: true,
    });
  }, 15000);

  it("keeps Weekends mutually exclusive with Sat/Sun selections", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    // start with sat/sun true to exercise exclusivity transitions
    const activity: Activity = { ...baseActivity, saturday: true, sunday: true };
    render(<EditActivityModal open={true} onClose={onClose} onSubmit={onSubmit} activity={activity} />);

    const weekends = screen.getByLabelText("Weekends") as HTMLInputElement;
    const sat = screen.getByLabelText("Sat") as HTMLInputElement;
    const sun = screen.getByLabelText("Sun") as HTMLInputElement;

    expect(sat.checked).toBe(true);
    expect(sun.checked).toBe(true);

    await user.click(weekends);
    expect((screen.getByLabelText("Weekends") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Sat") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("Sun") as HTMLInputElement).checked).toBe(false);

    // selecting Sat again should unset Weekends
    await user.click(screen.getByLabelText("Sat"));
    expect((screen.getByLabelText("Sat") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Weekends") as HTMLInputElement).checked).toBe(false);
  });

  it("calls onClose when close button clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSubmit = jest.fn();
    render(<EditActivityModal open={true} onClose={onClose} onSubmit={onSubmit} activity={baseActivity} />);

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
