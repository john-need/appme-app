import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActivitiesPage from "./activities-page";

// Mock redux hooks and thunk
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: (fn: any) => fn({ activities: { items: [{ id: "a1", name: "Run", type: "CARDIO" }] } }),
  useDispatch: () => mockDispatch,
}));

jest.mock("@/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

const mockAddActivityThunk = jest.fn();
const mockDeleteActivityThunk = jest.fn();
const mockUpdateActivityThunk = jest.fn();
jest.mock("@/features/activities/activities-slice", () => ({
  selectActivities: (state: any) => state.activities.items,
  addActivityThunk: (activity: any) => mockAddActivityThunk(activity),
  deleteActivityThunk: (id: string) => mockDeleteActivityThunk(id),
  updateActivityThunk: (activity: any) => mockUpdateActivityThunk(activity),
}));


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

    expect(mockAddActivityThunk).toHaveBeenCalledWith({ name: "Swim", type: "CARDIO" });
    expect(mockDeleteActivityThunk).toHaveBeenCalledWith("a1");
    expect(mockUpdateActivityThunk).toHaveBeenCalledWith({ id: "a1", name: "Run+", type: "CARDIO" });
    expect(mockDispatch).toHaveBeenCalled();
  });
});
