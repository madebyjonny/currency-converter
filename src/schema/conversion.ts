import { z } from "zod";

export const conversionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  amount: z.number().positive(),
});
