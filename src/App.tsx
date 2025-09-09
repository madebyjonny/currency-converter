import { useState } from "react";
import { conversionSchema } from "./schema/conversion";
import { useConvertCurrency, useCurrencies } from "./hooks/currencies";
import { Select } from "./components/select/select";
import { Input } from "./components/input/input";

function App() {
  const {
    mutate: convertCurrency,
    data: conversionData,
    isPending: isConverting,
    error: conversionError,
  } = useConvertCurrency();
  const { data: currencyList, isLoading, error } = useCurrencies();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const parsed = conversionSchema.safeParse({
      from: formData.get("from"),
      to: formData.get("to"),
      amount: Number(formData.get("amount")),
    });

    if (!parsed.success) {
      return setErrorMessage("There was an issue with your input");
    }

    convertCurrency(parsed.data, {
      onError: (error: unknown) => {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Conversion failed");
        }
      },
    });
  }

  if (isLoading && !currencyList) {
    return (
      <div className="flex justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex justify-center">
        <span>Error loading currencies</span>
      </div>
    );

  return (
    <>
      <h1 className="my-4 p-4 text-2xl font-bold">Currency Converter</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
        <Input
          label="From"
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min={0.01}
          placeholder="Amount e.g. 100.00"
          className="p-2 border rounded"
          required
        />

        <div className="flex items-center gap-2">
          <Select
            name="from"
            defaultValue={"USD"}
            id="from"
            label="From Currency"
          >
            {(currencyList ?? []).map((c) => (
              <option key={`from-${c.id}`} value={c.short_code}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select name="to" defaultValue={"GBP"} id="to" label="To Currency">
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

        {conversionData && (
          <div className="flex flex-col gap-2 p-4 ">
            <span>
              {conversionData.amount.toFixed(2)} {conversionData.from}
            </span>
            <strong>
              To: {`${conversionData.value.toFixed(2)} ${conversionData.to}`}
            </strong>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
