import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmActivityDeleteDialog from "./confirm-activity-delete-dialog";

import activityFactory from "@/factories/activity-factory";

describe("ConfirmActivityDeleteDialog", () => {
  const activity: Activity = activityFactory({
    id: "a1",
    name: "Daily Run",
    type: "TASSEI",
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  });

  it("renders dialog with title and activity name in the message", () => {
    const onClose = jest.fn();
    render(<ConfirmActivityDeleteDialog open activity={activity} onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Delete This Activity\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /You are about to delete activity "Daily Run"\. This action cannot be undone\./i
      )
    ).toBeInTheDocument();
  });

  it("calls onClose(true) when Delete is clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ConfirmActivityDeleteDialog open activity={activity} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith(true);
  });

  it("calls onClose(false) when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ConfirmActivityDeleteDialog open activity={activity} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith(false);
  });
});
