import { z } from 'zod'

export const mockTestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  durationMinutes: z.coerce.number().min(5, "Minimum 5 minutes"),
  batchId: z.string().min(1, "Batch is required"),
  questions: z.array(z.object({
    text: z.string().min(3, "Question text required"),
    options: z.array(z.object({
      text: z.string().min(1, "Option text required"),
      isCorrect: z.boolean()
    })).length(4, "Exactly 4 options required")
  })).min(1, "At least 1 question required")
})

export type MockTestFormValues = z.infer<typeof mockTestSchema>
