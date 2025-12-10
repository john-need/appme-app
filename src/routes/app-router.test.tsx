import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRouter from "./app-router";

// Mock route target components with identifiable text
jest.mock("@/pages/home-page", () => ({ __esModule: true, default: () => <div>HomePage</div> }));
jest.mock("@/pages/activities-page", () => ({ __esModule: true, default: () => <div>ActivitiesPage</div> }));
jest.mock("@/pages/preferences-page", () => ({ __esModule: true, default: () => <div>PreferencesPage</div> }));
jest.mock("@/pages/dashboard-page", () => ({ __esModule: true, default: () => <div>DashboardPage</div> }));
jest.mock("@/components/login-form/login-form", () => ({ __esModule: true, default: () => <div>LoginForm</div> }));

// We'll control auth state per-test
let isAuthed = false;
jest.mock("@/hooks", () => ({
  useIsAuthenticated: () => isAuthed,
}));

describe("AppRouter", () => {
  beforeEach(() => {
    isAuthed = false;
  });

  it("renders LoginForm on /login when unauthenticated", () => {
    isAuthed = false;
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("LoginForm")).toBeInTheDocument();
  });

  it("redirects /login to / when authenticated", () => {
    isAuthed = true;
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRouter />
      </MemoryRouter>
    );
    // After redirect, the HomePage should render
    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });

  it("renders ActivitiesPage on /activities", () => {
    render(
      <MemoryRouter initialEntries={["/activities"]}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("ActivitiesPage")).toBeInTheDocument();
  });

  it("renders PreferencesPage route", () => {
    render(
      <MemoryRouter initialEntries={["/preferences"]}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("PreferencesPage")).toBeInTheDocument();
  });

  it("renders DashboardPage route", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("DashboardPage")).toBeInTheDocument();
  });
});
