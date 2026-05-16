import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import Confetti from '@/components/Confetti'

export default async function ResultPage({ params }: { params: { scoreId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return <div>Unauthorized</div>

  const { scoreId } = await params
  const testScore = await prisma.testScore.findUnique({ where: { id: scoreId } })

  if (!testScore || testScore.studentId !== session.user.id) {
    return <div>Score not found</div>
  }

  const percentage = (testScore.score / testScore.maxScore) * 100
  const passed = percentage >= 40

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      {passed && <Confetti />}
      <div className="glass-panel p-2xl rounded-[24px] max-w-lg w-full text-center space-y-lg">
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl ${passed ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
          {passed ? '🎉' : '📚'}
        </div>
        <h1 className="text-4xl font-extrabold text-on-surface">
          {passed ? 'Great Job!' : 'Keep Practicing'}
        </h1>
        <p className="text-on-surface-variant text-lg">{testScore.testName}</p>
        
        <div className="bg-surface-container py-md rounded-xl">
          <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Your Score</p>
          <p className={`text-6xl font-black ${passed ? 'text-primary' : 'text-error'}`}>
            {testScore.score} <span className="text-2xl text-outline">/ {testScore.maxScore}</span>
          </p>
        </div>

        <Link href="/dashboard/student" className="inline-block w-full font-bold bg-surface-variant text-on-surface-variant hover:bg-outline-variant py-md rounded-full transition-all">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
