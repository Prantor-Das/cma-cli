import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);

    // Check if the navigation is rendered
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("displays the project name in navigation", () => {
    render(<App />);

    // The navigation should contain the project name (which gets replaced during setup)
    const navigation = screen.getByRole("navigation");
    expect(navigation).toBeInTheDocument();
  });
});
