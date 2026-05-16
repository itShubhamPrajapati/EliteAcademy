'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function submitTest(testId: string, answers: Record<string, string>) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const test = await prisma.mockTest.findUnique({
    where: { id: testId },
    include: {
      questions: {
        include: {
          options: true
        }
      }
    }
  })

  if (!test) throw new Error('Test not found')

  let score = 0
  const totalQuestions = test.questions.length

  for (const q of test.questions) {
    const correctOption = q.options.find(o => o.isCorrect)
    if (correctOption && answers[q.id] === correctOption.id) {
      score += 1
    }
  }

  // Keep max score as 50 to match current UI and schema
  const maxScore = 50
  const finalScore = totalQuestions > 0 ? Math.round((score / totalQuestions) * maxScore) : 0

  const testScore = await prisma.testScore.create({
    data: {
      studentId: session.user.id,
      testName: test.title,
      score: finalScore,
      maxScore: maxScore
    }
  })

  return { success: true, scoreId: testScore.id }
}
