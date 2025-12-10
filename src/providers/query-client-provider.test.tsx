import React from "react";
import { render, screen } from "@testing-library/react";
import ReactQueryProvider from "./query-client-provider";
import { useQueryClient } from "@tanstack/react-query";

// Stub the devtools to avoid pulling the actual package UI into tests
jest.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: (props: any) => (
    <div data-testid="rq-devtools">devtools:{String(props?.initialIsOpen)}</div>
  ),
}));

function ChildUsingQueryClient() {
  const client = useQueryClient();
  return <div>hasClient:{client ? "yes" : "no"}</div>;
}

describe("ReactQueryProvider", () => {
  it("provides a QueryClient context to children", () => {
    render(
      <ReactQueryProvider>
        <div>child</div>
        <ChildUsingQueryClient />
      </ReactQueryProvider>
    );

    // Renders children
    expect(screen.getByText("child")).toBeInTheDocument();
    // The child can access a query client from context
    expect(screen.getByText(/hasClient:yes/)).toBeInTheDocument();
  });

  it("renders React Query Devtools closed by default", () => {
    render(
      <ReactQueryProvider>
        <div />
      </ReactQueryProvider>
    );
    const devtools = screen.getByTestId("rq-devtools");
    expect(devtools).toBeInTheDocument();
    expect(devtools).toHaveTextContent("devtools:false");
  });
});
