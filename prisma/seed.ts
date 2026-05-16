import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding EliteAcademy — Admin-only clean state...')

  // Full wipe
  await prisma.message.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.testScore.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.individualResult.deleteMany()
  await prisma.option.deleteMany()
  await prisma.question.deleteMany()
  await prisma.mockTest.deleteMany()
  await prisma.studyMaterial.deleteMany()
  await prisma.user.deleteMany()
  await prisma.batch.deleteMany()

  const password = await bcrypt.hash('admin123', 10)

  // Master Admin only
  await prisma.user.create({
    data: {
      name: 'Master Admin',
      email: 'admin@eliteacademy.com',
      password,
      role: 'ADMIN',
    },
  })

  // Create the two standard batches
  await prisma.batch.createMany({
    data: [
      { grade: '9th' },
      { grade: '10th' },
    ],
  })

  console.log('✅ Database is clean and ready for real data.')
  console.log('')
  console.log('🔐 Admin Login:')
  console.log('   Email:    admin@eliteacademy.com')
  console.log('   Password: admin123')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
