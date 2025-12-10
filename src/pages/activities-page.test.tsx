import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActivitiesPage from "./activities-page";

// Mock redux selector used in the page
jest.mock("react-redux", () => ({
  useSelector: (fn: any) => fn({ activities: { items: [{ id: "a1", name: "Run", type: "CARDIO" }] } }),
}));

// Mock hooks that return mutations
const addMutate = jest.fn();
const updateMutate = jest.fn();
const deleteMutate = jest.fn();
jest.mock("@/hooks/use-add-activity", () => () => ({ mutate: addMutate }));
jest.mock("@/hooks/use-update-activity", () => () => ({ mutate: updateMutate }));
jest.mock("@/hooks/use-delete-activity", () => () => ({ mutate: deleteMutate }));

// Mock child component to capture props
// eslint-disable-next-line react/display-name
jest.mock("@/components/activities/activities", () => (props: any) => (
  <div>
    <div>Activities Mock</div>
    <button onClick={() => props.addActivity({ name: "Swim", type: "CARDIO" })}>add</button>
    <button onClick={() => props.updateActivity({ id: "a1", name: "Run+", type: "CARDIO" })}>update</button>
    <button onClick={() => props.deleteActivity("a1")}>delete</button>
  </div>
));

describe("ActivitiesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("wires callbacks to mutations", async () => {
    const user = userEvent.setup();
    render(<ActivitiesPage />);

    expect(screen.getByText(/Activities Mock/i)).toBeInTheDocument();

    await user.click(screen.getByText("add"));
    await user.click(screen.getByText("update"));
    await user.click(screen.getByText("delete"));

    expect(addMutate).toHaveBeenCalledWith({ activity: { name: "Swim", type: "CARDIO" } });
    expect(updateMutate).toHaveBeenCalledWith({ id: "a1", name: "Run+", type: "CARDIO" });
    expect(deleteMutate).toHaveBeenCalledWith("a1");
  });
});
