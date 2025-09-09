interface ConversionResultProps {
  errorMessage?: string | null;
  conversionData?: {
    amount: number;
    from: string;
    to: string;
    value: number;
  };
}

export function ConversionResult({
  errorMessage,
  conversionData,
}: ConversionResultProps) {
  if (!errorMessage && !conversionData) {
    return null;
  }

  return (
    <div aria-live="polite" className="mt-4">
      {errorMessage && (
        <span className="text-red-500">
          {errorMessage || "Conversion failed"}
        </span>
      )}

      {conversionData && (
        <div className="flex flex-col gap-2 p-4 ">
          <strong>
            To: {`${conversionData.value.toFixed(2)} ${conversionData.to}`}
          </strong>
        </div>
      )}
    </div>
  );
}
