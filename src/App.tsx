import { useState } from "react";
import { conversionSchema } from "./schema/conversion";

function App({ currencies }: { currencies: any }) {
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
    if (!parsed.success)
      return setErrorMessage("There was an issue with your input");
  }

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-4 p-4 bg-white shadow rounded-2xl"
    >
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        className="p-2 border rounded"
      />

      <div className="flex items-center gap-2">
        <select
          name="from"
          defaultValue="USD"
          className="p-2 border rounded flex-1"
        >
          {Object.keys(currencies).map((c) => (
            <option key={c} value={c}>
              {currencies[c].name} ({c})
            </option>
          ))}
        </select>
        <select
          name="to"
          defaultValue="EUR"
          className="p-2 border rounded flex-1"
        >
          {Object.keys(currencies).map((c) => (
            <option key={c} value={c}>
              {currencies[c].name} ({c})
            </option>
          ))}
        </select>
      </div>

      {errorMessage && <span className="text-red-500">{errorMessage}</span>}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded-xl">
        Convert
      </button>
    </form>
  );
}

export default App;
