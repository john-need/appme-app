import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRouter from "./app-router";

// Mock route target components with identifiable text
jest.mock("@/pages/time-entries-page", () => ({ __esModule: true, default: () => <div>TimeEntriesPage</div> }));
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
      <MemoryRouter initialEntries={["/login"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("LoginForm")).toBeInTheDocument();
  });

  it("redirects /login to / when authenticated", () => {
    isAuthed = true;
    render(
      <MemoryRouter initialEntries={["/login"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </MemoryRouter>
    );
    // After redirect, the TimeEntriesPage should render
    expect(screen.getByText("TimeEntriesPage")).toBeInTheDocument();
  });

  it("renders ActivitiesPage on /activities", () => {
    render(
      <MemoryRouter initialEntries={["/activities"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("ActivitiesPage")).toBeInTheDocument();
  });

  it("renders PreferencesPage route", () => {
    render(
      <MemoryRouter initialEntries={["/preferences"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("PreferencesPage")).toBeInTheDocument();
  });

  it("renders DashboardPage route", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("DashboardPage")).toBeInTheDocument();
  });
});
