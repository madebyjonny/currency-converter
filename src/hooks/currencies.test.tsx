import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCurrencies, useConvertCurrency } from "./currencies";
import * as currencyService from "../services/currency-service";
import { vi, describe, it, expect } from "vitest";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCurrencies", () => {
  it("fetches currencies successfully", async () => {
    const mockData = [
      {
        id: 1,
        name: "US Dollar",
        code: "USD",
        short_code: "USD",
        decimal_mark: ".",
        precision: 2,
        symbol: "$",
        subunit: 100,
        symbol_first: true,
        thousands_separator: ",",
      },
      {
        id: 2,
        name: "Euro",
        code: "EUR",
        short_code: "EUR",
        decimal_mark: ",",
        precision: 2,
        symbol: "€",
        subunit: 100,
        symbol_first: true,
        thousands_separator: ".",
      },
    ];
    vi.spyOn(currencyService, "fetchCurrencies").mockResolvedValue(mockData);

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it("handles error", async () => {
    vi.spyOn(currencyService, "fetchCurrencies").mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect((result.current.error as Error).message).toBe("Network error");
  });
});

describe("useConvertCurrency", () => {
  it("converts currency successfully", async () => {
    const mockValue = {
      amount: 100,
      date: "2025-09-09",
      from: "USD",
      to: "EUR",
      timestamp: 1694284800,
      value: 123,
    };
    vi.spyOn(currencyService, "convertCurrency").mockResolvedValue(mockValue);

    const { result } = renderHook(() => useConvertCurrency(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ from: "USD", to: "EUR", amount: 100 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockValue);
  });

  it("handles conversion error", async () => {
    vi.spyOn(currencyService, "convertCurrency").mockRejectedValue(
      new Error("Conversion failed")
    );

    const { result } = renderHook(() => useConvertCurrency(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ from: "USD", to: "EUR", amount: 100 });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect((result.current.error as Error).message).toBe("Conversion failed");
  });
});
