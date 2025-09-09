import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Select } from "./select";

describe("Select component", () => {
  it("renders the select with a label", () => {
    render(
      <Select id="test-select" name="test" label="Test Label">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("renders the select with options", () => {
    render(
      <Select id="test-select" name="test" label="Test Label">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });
});
