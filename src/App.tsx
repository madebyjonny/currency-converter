import { useState } from "react";
import { conversionSchema } from "./schema/conversion";
import { useConvertCurrency, useCurrencies } from "./hooks/currencies";

function App() {
  const {
    mutate: convertCurrency,
    isPending: isConverting,
    error: conversionError,
  } = useConvertCurrency();
  const { data: currencyList, isLoading, error } = useCurrencies();
  const [convertedValue, setConvertedValue] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

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

    convertCurrency(parsed.data, {
      onSuccess: (data) => {
        setConvertedValue(data.value);
      },
      onError: (error: unknown) => {
        setErrorMessage(error.message || "Conversion failed");
      },
    });
  }

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading currencies</div>;

  return (
    <>
      <form
        action={handleSubmit}
        className="flex flex-col gap-4 p-4 bg-white shadow rounded-2xl"
      >
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          className="p-2 border rounded"
          required
        />

        <div className="flex items-center gap-2">
          <select
            name="from"
            defaultValue="USD"
            className="p-2 border rounded flex-1"
          >
            {(currencyList ?? []).map((c) => (
              <option key={`from-${c.id}`} value={c.short_code}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="to"
            defaultValue="EUR"
            className="p-2 border rounded flex-1"
          >
            {(currencyList ?? []).map((c) => (
              <option key={`to-${c.id}`} value={c.short_code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {errorMessage && <span className="text-red-500">{errorMessage}</span>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-xl">
          Convert
        </button>
      </form>

      <div aria-live="polite" className="mt-4">
        {conversionError && (
          <span className="text-red-500">
            {conversionError.message || "Conversion failed"}
          </span>
        )}
        {isConverting && <span>Converting...</span>}
        {convertedValue && <div>Converted Amount: {convertedValue}</div>}
      </div>
    </>
  );
}

export default App;
