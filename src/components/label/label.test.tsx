import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Label } from "./label";

describe("Label component", () => {
  it("renders the Label with a label", () => {
    render(<Label htmlFor="test-label">Test Label</Label>);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });
});
