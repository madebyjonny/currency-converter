import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCurrencies, convertCurrency } from "../services/currency-service";

export const useCurrencies = () =>
  useQuery({ queryKey: ["currencies"], queryFn: fetchCurrencies });

export const useConvertCurrency = () =>
  useMutation({
    mutationFn: ({
      from,
      to,
      amount,
    }: {
      from: string;
      to: string;
      amount: number;
    }) => convertCurrency(from, to, amount),
  });
