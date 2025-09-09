import { fetchCurrencies, convertCurrency } from "./currency-service";
import { vi, it, expect, describe } from "vitest";
import type { Mock } from "vitest";

vi.stubGlobal("fetch", vi.fn());

describe("fetchCurrencies", () => {
  it("fetches and returns currency data", async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: { USD: { name: "US Dollar" } } }),
    });

    const data = await fetchCurrencies();
    expect(data).toEqual({ USD: { name: "US Dollar" } });
  });

  it("throws an error when the fetch fails", async () => {
    (fetch as Mock).mockResolvedValueOnce({ ok: false });

    await expect(fetchCurrencies()).rejects.toThrow(
      "Failed to fetch currencies"
    );
  });
});

describe("convertCurrency", () => {
  it("converts currency and returns the result", async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: { convertedAmount: 100 } }),
    });

    const result = await convertCurrency("USD", "EUR", 50);
    expect(result).toEqual({ convertedAmount: 100 });
  });

  it("throws an error when the conversion fails", async () => {
    (fetch as Mock).mockResolvedValueOnce({ ok: false });

    await expect(convertCurrency("USD", "EUR", 50)).rejects.toThrow(
      "Failed to convert currency"
    );
  });
});
