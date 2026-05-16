import { z } from 'zod'

export const accountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["STUDENT", "PARENT", "ADMIN"]),
  batchId: z.string().optional(),
  parentId: z.string().optional()
})

export type AccountFormValues = z.infer<typeof accountSchema>
