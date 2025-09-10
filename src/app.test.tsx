import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { useConvertCurrency, useCurrencies } from "./hooks/currencies";
import type { Mock } from "vitest";

vi.mock("./hooks/currencies", () => {
  return {
    useConvertCurrency: vi.fn(() => ({
      mutate: vi.fn(),
      data: null,
      isPending: false,
    })),
    useCurrencies: vi.fn(() => ({
      data: null,
      isLoading: false,
      error: null,
    })),
  };
});

describe("App", () => {
  it("renders the form inputs", () => {
    (useCurrencies as Mock).mockReturnValue({
      data: [
        { id: 1, short_code: "USD", name: "US Dollar" },
        { id: 2, short_code: "GBP", name: "British Pound" },
      ],
      isLoading: false,
      error: null,
    });

    render(<App />);

    expect(screen.getByLabelText("From")).toBeInTheDocument();
    expect(screen.getByLabelText("From Currency")).toBeInTheDocument();
    expect(screen.getByLabelText("To Currency")).toBeInTheDocument();
  });

  it("handles user input and submits the form", async () => {
    const mockConvertCurrency = vi.fn();

    (useConvertCurrency as Mock).mockReturnValue({
      mutate: mockConvertCurrency,
      data: { value: 100 },
      isPending: false,
    });

    (useCurrencies as Mock).mockReturnValue({
      data: [
        { id: 1, short_code: "USD", name: "US Dollar" },
        { id: 2, short_code: "GBP", name: "British Pound" },
      ],
      isLoading: false,
      error: null,
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText("From"), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByLabelText("From Currency"), {
      target: { value: "USD" },
    });
    fireEvent.change(screen.getByLabelText("To Currency"), {
      target: { value: "GBP" },
    });

    fireEvent.click(screen.getByText("Convert"));

    await waitFor(() => {
      expect(mockConvertCurrency).toHaveBeenCalledWith(
        { from: "USD", to: "GBP", amount: 50 },
        expect.any(Object)
      );
    });
  });

  it("renders a loading state when currencies are being fetched", () => {
    (useCurrencies as Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<App />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders an error state when currencies fail to load", () => {
    (useCurrencies as Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch currencies"),
    });

    render(<App />);

    expect(screen.getByText("Error loading currencies")).toBeInTheDocument();
  });
});
