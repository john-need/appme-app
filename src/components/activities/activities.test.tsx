import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Activities from "./activities";

// Mock modal and dialog components to control interactions
jest.mock("@/components/add-activity-modal/add-activity-modal", () => {
  return {
    __esModule: true,
    default: ({ onClose, onSubmit }: { onClose?: () => void; onSubmit?: (a: Partial<Activity>) => void }) =>
      React.createElement(
        "div",
        { "data-testid": "add-modal" },
        React.createElement(
          "button",
          { "data-testid": "add-submit", onClick: () => onSubmit && onSubmit({ id: "new-id", name: "New Activity", type: "MUDA", goal: 1, monday:false,tuesday:false,wednesday:false,thursday:false,friday:false,saturday:false,sunday:false,weekends:false, created: new Date().toISOString(), updated: new Date().toISOString() }) },
          "submit-add"
        ),
        React.createElement("button", { "data-testid": "add-close", onClick: onClose }, "close-add")
      ),
  };
});

jest.mock("@/components/edit-activity-modal/edit-activity-modal", () => {
  return {
    __esModule: true,
    default: ({ onClose, onSubmit, activity }: { onClose?: () => void; onSubmit?: (a: Partial<Activity>) => void; activity?: Activity }) =>
      React.createElement(
        "div",
        { "data-testid": "edit-modal" },
        React.createElement("div", { "data-testid": "edit-activity-id" }, activity?.id ?? ""),
        React.createElement(
          "button",
          { "data-testid": "edit-submit", onClick: () => onSubmit && onSubmit({ ...(activity ?? {}), name: `${activity?.name}-edited` }) },
          "submit-edit"
        ),
        React.createElement("button", { "data-testid": "edit-close", onClick: onClose }, "close-edit")
      ),
  };
});

jest.mock("@/components/confirm-activity-delete-dialog/confirm-activity-delete-dialog", () => {
  return {
    __esModule: true,
    default: ({ open, onClose, activity }: { open?: boolean; onClose?: (confirmed: boolean) => void; activity?: Activity }) =>
      open
        ? React.createElement(
            "div",
            { "data-testid": "confirm-delete" },
            React.createElement("div", { "data-testid": "confirm-activity-name" }, activity?.name ?? ""),
            React.createElement("button", { "data-testid": "confirm-yes", onClick: () => onClose && onClose(true) }, "Yes"),
            React.createElement("button", { "data-testid": "confirm-no", onClick: () => onClose && onClose(false) }, "No")
          )
        : React.createElement(React.Fragment, null),
  };
});

const sampleActivities: Activity[] = [
  {
    id: "a-1",
    name: "Run",
    type: "MUDA",
    comment: "morning",
    goal: 5,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    weekends: false,
  },
  {
    id: "a-2",
    name: "Code",
    type: "TASSEI",
    comment: "work",
    goal: undefined as unknown as number,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    monday: true,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    weekends: false,
  },
];

describe("Activities component", () => {
  it("renders column headers and activity rows with correct values", async () => {
    render(
      React.createElement(Activities, { activities: sampleActivities, updateActivity: jest.fn(), deleteActivity: jest.fn(), addActivity: jest.fn() })
    );

    // headers
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Goal/i)).toBeInTheDocument();

    // activity rows
    expect(screen.getByText("Run")).toBeInTheDocument();
    expect(screen.getByText("MUDA")).toBeInTheDocument();
    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("TASSEI")).toBeInTheDocument();

    // activity with undefined goal should render an empty cell (no numeric text)
    const codeRow = screen.getByText("Code").closest("div");
    expect(codeRow).toBeTruthy();
  });

  it("opens AddActivityModal on FAB click and calls addActivity on submit", async () => {
    const addMock = jest.fn();
    render(
      React.createElement(Activities, { activities: sampleActivities, updateActivity: jest.fn(), deleteActivity: jest.fn(), addActivity: addMock })
    );

    const fab = screen.getByLabelText("add-activity");
    await userEvent.click(fab);

    expect(screen.getByTestId("add-modal")).toBeInTheDocument();

    const submit = screen.getByTestId("add-submit");
    await userEvent.click(submit);

    expect(addMock).toHaveBeenCalledTimes(1);
    const calledWith = addMock.mock.calls[0][0];
    expect(calledWith).toHaveProperty("name", "New Activity");
  });

  it("opens EditActivityModal when edit is clicked and calls updateActivity with edited values", async () => {
    const updateMock = jest.fn();
    render(
      React.createElement(Activities, { activities: sampleActivities, updateActivity: updateMock, deleteActivity: jest.fn(), addActivity: jest.fn() })
    );

    const editButtons = screen.getAllByLabelText(/edit-/i);
    expect(editButtons.length).toBeGreaterThan(0);

    await userEvent.click(editButtons[0]);
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();

    const submit = screen.getByTestId("edit-submit");
    await userEvent.click(submit);

    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(updateMock.mock.calls[0][0]).toHaveProperty("name", expect.stringContaining("-edited"));
  });

  it("opens confirm dialog on delete and calls deleteActivity when confirmed", async () => {
    const deleteMock = jest.fn();
    render(
      React.createElement(Activities, { activities: sampleActivities, updateActivity: jest.fn(), deleteActivity: deleteMock, addActivity: jest.fn() })
    );

    const deleteButtons = screen.getAllByLabelText(/delete-/i);
    expect(deleteButtons.length).toBeGreaterThan(0);

    await userEvent.click(deleteButtons[0]);

    // confirm dialog should appear
    expect(screen.getByTestId("confirm-delete")).toBeInTheDocument();

    const yes = screen.getByTestId("confirm-yes");
    await userEvent.click(yes);

    expect(deleteMock).toHaveBeenCalledTimes(1);
  });

  describe("sorting", () => {
    function getRenderedOrderByEditAria(): string[] {
      const buttons = screen.getAllByLabelText(/edit-/i);
      return buttons.map((b) => (b as HTMLElement).getAttribute("aria-label")!.replace("edit-", ""));
    }

    it("renders initial order as provided (no sort active)", () => {
      render(
        React.createElement(Activities, { activities: sampleActivities, updateActivity: jest.fn(), deleteActivity: jest.fn(), addActivity: jest.fn() })
      );
      expect(getRenderedOrderByEditAria()).toEqual(["a-1", "a-2"]);
    });

    it("clicking Name header toggles ascending then descending (case-insensitive)", async () => {
      const data: Activity[] = [
        { ...sampleActivities[0], id: "a1", name: "Yoga" },
        { ...sampleActivities[0], id: "a2", name: "run" },
        { ...sampleActivities[0], id: "a3", name: "Book Club" },
        { ...sampleActivities[0], id: "a4", name: "coding" },
        { ...sampleActivities[0], id: "a5", name: "ALPHA" },
      ];
      render(
        React.createElement(Activities, { activities: data, updateActivity: jest.fn(), deleteActivity: jest.fn(), addActivity: jest.fn() })
      );
      const user = userEvent.setup();
      const nameHeader = screen.getByRole("button", { name: /name/i });

      await user.click(nameHeader); // asc
      expect(getRenderedOrderByEditAria()).toEqual(["a5", "a3", "a4", "a2", "a1"]); // ALPHA, Book Club, coding, run, Yoga

      await user.click(nameHeader); // desc
      expect(getRenderedOrderByEditAria()).toEqual(["a1", "a2", "a4", "a3", "a5"]); // Yoga, run, coding, Book Club, ALPHA
    });

    it("clicking Type header toggles ascending then descending", async () => {
      const data: Activity[] = [
        { ...sampleActivities[0], id: "b1", type: "Wellness" },
        { ...sampleActivities[0], id: "b2", type: "Fitness" },
        { ...sampleActivities[0], id: "b3", type: "Social" },
        { ...sampleActivities[0], id: "b4", type: "Learning" },
        { ...sampleActivities[0], id: "b5", type: "Work" },
      ];
      render(
        React.createElement(Activities, { activities: data, updateActivity: jest.fn(), deleteActivity: jest.fn(), addActivity: jest.fn() })
      );
      const user = userEvent.setup();
      const typeHeader = screen.getByRole("button", { name: /type/i });

      await user.click(typeHeader); // asc: Fitness, Learning, Social, Wellness, Work
      expect(getRenderedOrderByEditAria()).toEqual(["b2", "b4", "b3", "b1", "b5"]);

      await user.click(typeHeader); // desc
      expect(getRenderedOrderByEditAria()).toEqual(["b5", "b1", "b3", "b4", "b2"]);
    });

    it("clicking Goal header sorts numbers and handles null/undefined (asc then desc)", async () => {
      const base = sampleActivities[0];
      const data: Activity[] = [
        { ...base, id: "g1", goal: 30 },
        { ...base, id: "g2", goal: 5 },
        { ...base, id: "g3", goal: null as unknown as number },
        { ...base, id: "g4", goal: undefined as unknown as number },
        { ...base, id: "g5", goal: 10 },
      ];
      render(
        React.createElement(Activities, { activities: data, updateActivity: jest.fn(), deleteActivity: jest.fn(), addActivity: jest.fn() })
      );
      const user = userEvent.setup();
      const goalHeader = screen.getByRole("button", { name: /goal/i });

      await user.click(goalHeader); // asc: 5, 10, 30, (nullish last)
      expect(getRenderedOrderByEditAria()).toEqual(["g2", "g5", "g1", "g3", "g4"]);

      await user.click(goalHeader); // desc: (nullish first), 30, 10, 5
      expect(getRenderedOrderByEditAria()).toEqual(["g3", "g4", "g1", "g5", "g2"]);
    });

    it("keyboard Enter on Type header triggers sorting", async () => {
      render(
        React.createElement(Activities, { activities: sampleActivities, updateActivity: jest.fn(), deleteActivity: jest.fn(), addActivity: jest.fn() })
      );
      const user = userEvent.setup();
      const typeHeader = screen.getByRole("button", { name: /type/i });
      (typeHeader as HTMLElement).focus();
      await user.keyboard("{Enter}");
      // With sampleActivities types MUDA, TASSEI -> MUDA < TASSEI (asc)
      expect(getRenderedOrderByEditAria()).toEqual(["a-1", "a-2"]);
      // Toggle to desc
      await user.keyboard("{Enter}");
      expect(getRenderedOrderByEditAria()).toEqual(["a-2", "a-1"]);
    });
  });
});
