import { z } from "zod";

export const demoLoginParamsSchema = z.object({
  role: z.enum(["admin", "pharmacy", "staff", "user"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be one of: admin, pharmacy, staff, user",
  }),
});

export type DemoLoginParams = z.infer<typeof demoLoginParamsSchema>;
