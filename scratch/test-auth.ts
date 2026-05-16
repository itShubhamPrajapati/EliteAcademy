import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@eliteacademy.com'
  const password = 'EliteAdmin2025!'
  
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log('User not found in DB')
    return
  }
  
  console.log('User found:', user.email)
  console.log('Stored hash:', user.password)
  
  const isValid = await bcrypt.compare(password, user.password!)
  console.log('Password is valid:', isValid)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
