import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConversionResult } from "./conversion-result";

describe("ConversionResult", () => {
  it("renders conversion error message", () => {
    render(
      <ConversionResult errorMessage="Test error" conversionData={undefined} />
    );

    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("renders conversion data", () => {
    const mockData = {
      amount: 100,
      from: "USD",
      to: "EUR",
      value: 85,
    };

    render(<ConversionResult conversionData={mockData} />);

    expect(screen.getByText("To: 85.00 EUR")).toBeInTheDocument();
  });

  it("renders nothing when no data or error is provided", () => {
    const { container } = render(<ConversionResult />);

    expect(container).toBeEmptyDOMElement();
  });
});
