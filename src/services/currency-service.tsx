const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY;
const BASE_URL = "https://api.currencybeacon.com/v1";

export interface Currency {
  code: string;
  decimal_mark: string;
  id: number;
  name: string;
  precision: number;
  short_code: string;
  subunit: number;
  symbol: string;
  symbol_first: boolean;
  thousands_separator: string;
}

export interface ConversionResponse {
  amount: number;
  date: string;
  from: string;
  timestamp: number;
  to: string;
  value: number;
}

export async function fetchCurrencies() {
  const res = await fetch(`${BASE_URL}/currencies?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch currencies");
  const data = await res.json();
  return data.response as Currency[];
}

export async function convertCurrency(
  from: string,
  to: string,
  amount: number
) {
  const res = await fetch(
    `${BASE_URL}/convert?api_key=${API_KEY}&from=${from}&to=${to}&amount=${amount}`
  );
  if (!res.ok) throw new Error("Failed to convert currency");
  const data = await res.json();
  return data.response as ConversionResponse;
}
