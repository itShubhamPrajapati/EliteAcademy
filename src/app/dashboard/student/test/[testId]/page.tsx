import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TestEngine from '@/components/TestEngine'

export default async function DynamicTestPage({ params }: { params: { testId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'STUDENT') redirect('/login')

  const { testId } = await params

  const test = await prisma.mockTest.findUnique({
    where: { id: testId },
    include: {
      questions: {
        include: {
          options: {
            select: { id: true, text: true } // Do NOT send isCorrect to client
          }
        }
      }
    }
  })

  if (!test) return <div className="text-center p-xl">Test not found.</div>

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.batchId !== test.batchId) {
    return <div className="text-center p-xl text-red-500">Unauthorized. This test does not belong to your batch.</div>
  }

  return (
    <div className="py-md">
      <TestEngine test={test} />
    </div>
  )
}
