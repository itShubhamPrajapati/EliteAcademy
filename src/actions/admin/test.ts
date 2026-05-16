'use server'

import prisma from '@/lib/prisma'
import { mockTestSchema, MockTestFormValues } from '@/lib/validations/testSchema'

export async function createMockTest(data: MockTestFormValues) {
  try {
    const validated = mockTestSchema.parse(data)
    
    // Ensure each question has exactly 1 correct option
    for (const q of validated.questions) {
      const correctCount = q.options.filter(o => o.isCorrect).length
      if (correctCount !== 1) {
        return { success: false, error: "Each question must have exactly one correct option." }
      }
    }

    const test = await prisma.mockTest.create({
      data: {
        title: validated.title,
        durationMinutes: validated.durationMinutes,
        batchId: validated.batchId,
        questions: {
          create: validated.questions.map(q => ({
            text: q.text,
            options: {
              create: q.options.map(o => ({
                text: o.text,
                isCorrect: o.isCorrect
              }))
            }
          }))
        }
      }
    })

    return { success: true, testId: test.id }
  } catch (error: any) {
    console.error("Create Mock Test Error:", error)
    return { success: false, error: error.message || "Failed to create mock test" }
  }
}
