import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.attendance.deleteMany();
  await prisma.testScore.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.user.deleteMany();
  await prisma.batch.deleteMany();

  // Create Batches
  const batch9 = await prisma.batch.create({
    data: { grade: '9th' },
  });

  const batch10 = await prisma.batch.create({
    data: { grade: '10th' },
  });

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      role: 'ADMIN',
      name: 'Admin User',
      email: 'admin@eliteacademy.com',
      password: hashedPassword,
    },
  });

  const student9 = await prisma.user.create({
    data: {
      role: 'STUDENT',
      name: 'Student Nine',
      email: 'student9@eliteacademy.com',
      password: hashedPassword,
      batchId: batch9.id,
    },
  });

  const student10 = await prisma.user.create({
    data: {
      role: 'STUDENT',
      name: 'Student Ten',
      email: 'student10@eliteacademy.com',
      password: hashedPassword,
      batchId: batch10.id,
    },
  });

  const parent = await prisma.user.create({
    data: {
      role: 'PARENT',
      name: 'Parent User',
      email: 'parent@eliteacademy.com',
      password: hashedPassword,
    },
  });

  // Create Study Materials
  await prisma.studyMaterial.createMany({
    data: [
      { title: 'Class 9 Science - Motion Notes', fileUrl: '/materials/9-science-motion.pdf', batchId: batch9.id },
      { title: 'Class 9 Math - Polynomials', fileUrl: '/materials/9-math-poly.pdf', batchId: batch9.id },
      { title: 'Class 10 Science - Gravitation Notes', fileUrl: '/materials/10-science-gravitation.pdf', batchId: batch10.id },
      { title: 'Class 10 Math - Quadratic Equations', fileUrl: '/materials/10-math-quadratic.pdf', batchId: batch10.id },
    ],
  });

  // Create Test Scores
  await prisma.testScore.createMany({
    data: [
      { studentId: student9.id, testName: 'Science Mock 1', score: 45, maxScore: 50 },
      { studentId: student9.id, testName: 'Math Mock 1', score: 38, maxScore: 50 },
      { studentId: student10.id, testName: 'Algebra Mock Test 1', score: 48, maxScore: 50 },
      { studentId: student10.id, testName: 'Science Term 1 Mock', score: 42, maxScore: 50 },
    ],
  });

  // Create Attendance
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.attendance.createMany({
    data: [
      { studentId: student9.id, date: today, status: 'PRESENT' },
      { studentId: student9.id, date: yesterday, status: 'PRESENT' },
      { studentId: student10.id, date: today, status: 'PRESENT' },
      { studentId: student10.id, date: yesterday, status: 'ABSENT' },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
