# EliteAcademy V2 - Premium Tution Management System

EliteAcademy is a state-of-the-art, glassmorphism-inspired management platform for educational institutions. It features a robust architecture for managing students, attendance, results, and study materials with a premium user experience.

## ✨ Key Features
- **360° User Insights**: Comprehensive student auditing and performance tracking.
- **Industrial-Speed Result Entry**: Keyboard-centric, split-pane interface for rapid data entry.
- **Glassmorphic UI**: High-performance, 60fps micro-interactions using Framer Motion.
- **Multi-Role Dashboards**: Specialized views for Admins, Students, and Parents.
- **Automated Reports**: PDF report card generation for students.

## 🚀 Deployment

This project is designed to be flexible and is optimized for **Vercel**. 

For a step-by-step guide on how to deploy this project to production (including database and file storage recommendations), please refer to:
👉 **[DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🛠️ Local Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/itShubhamPrajapati/EliteAcademy.git
   cd EliteAcademy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   Initialize the local SQLite database and seed the admin user:
   ```bash
   npx prisma db push
   npm run seed
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## 🔒 Security
- Authentication via **NextAuth.js**.
- Role-based access control (RBAC).
- Password hashing with **Bcrypt**.

---
Built with ❤️ by EliteAcademy Team.

