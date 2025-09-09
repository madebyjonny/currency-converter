import { useState } from "react";
import { conversionSchema } from "./schema/conversion";
import { useConvertCurrency, useCurrencies } from "./hooks/currencies";
import type { ConversionResponse } from "./services/currency-service";
import { Select } from "./components/select/select";
import { Input } from "./components/input/input";

function App() {
  const {
    mutate: convertCurrency,
    isPending: isConverting,
    error: conversionError,
  } = useConvertCurrency();
  const { data: currencyList, isLoading, error } = useCurrencies();
  const [convertedData, setConvertedData] = useState<ConversionResponse | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | undefined>(undefined);

  async function handleSubmit(formData: FormData) {
    setErrorMessage("");
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;
    const amount = Number(formData.get("amount"));

    const parsed = conversionSchema.safeParse({
      from,
      to,
      amount,
    });
    if (!parsed.success) {
      return setErrorMessage("There was an issue with your input");
    }

    setAmount(amount);

    convertCurrency(parsed.data, {
      onSuccess: (data) => {
        setConvertedData(data);
      },
      onError: (error: unknown) => {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Conversion failed");
        }
      },
    });
  }

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading currencies</div>;

  return (
    <>
      <h1 className="my-4 p-4 text-2xl font-bold">Currency Converter</h1>
      <form action={handleSubmit} className="flex flex-col gap-4 p-4">
        <Input
          label="Amount"
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount e.g. 100.00"
          defaultValue={amount}
          className="p-2 border rounded"
          required
        />

        <div className="flex items-center gap-2">
          <Select name="from" defaultValue="USD" id="from" label="From">
            {(currencyList ?? []).map((c) => (
              <option key={`from-${c.id}`} value={c.short_code}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select name="to" defaultValue="EUR" id="to" label="To">
            {(currencyList ?? []).map((c) => (
              <option key={`to-${c.id}`} value={c.short_code}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        {errorMessage && <span className="text-red-500">{errorMessage}</span>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-xl">
          {isConverting ? "Converting..." : "Convert"}
        </button>
      </form>

      <div aria-live="polite" className="mt-4">
        {conversionError && (
          <span className="text-red-500">
            {conversionError.message || "Conversion failed"}
          </span>
        )}

        {convertedData && (
          <div className="flex flex-col gap-2 p-4 ">
            <strong>
              {convertedData.amount.toFixed(2)} {convertedData.from}
            </strong>
            <span>
              Converted Amount:{" "}
              {`${convertedData.value.toFixed(2)} ${convertedData.to}`}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
