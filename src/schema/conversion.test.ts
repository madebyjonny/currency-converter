import { conversionSchema } from "./conversion";
import { it, expect } from "vitest";

it("rejects invalid amount", () => {
  const result = conversionSchema.safeParse({
    from: "USD",
    to: "EUR",
    amount: -1,
  });
  expect(result.success).toBe(false);
});
