import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const analyticsQuerySchema = z.object({
  dateFrom: z.preprocess(emptyToUndefined, z.string().optional()),
  dateTo: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
