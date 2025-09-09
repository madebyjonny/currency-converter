import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "./error-message";
import { describe, expect, it } from "vitest";

describe("ErrorMessage", () => {
  it("renders the error message when message is provided", () => {
    render(<ErrorMessage message="An error occurred" />);
    expect(screen.getByText("An error occurred")).toBeInTheDocument();
  });

  it("renders nothing when message is null", () => {
    const { container } = render(<ErrorMessage message={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when message is an empty string", () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
