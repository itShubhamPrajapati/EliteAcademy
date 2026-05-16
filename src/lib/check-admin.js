const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkAdmin() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@eliteacademy.com' }
  })
  if (admin) {
    console.log('Admin user found:', admin.email)
    console.log('Role:', admin.role)
    console.log('Has Password:', !!admin.password)
  } else {
    console.log('Admin user NOT found!')
  }
  await prisma.$disconnect()
}

checkAdmin()
