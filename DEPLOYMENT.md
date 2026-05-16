# Deployment Guide: EliteAcademy V2

This project is optimized for deployment on **Vercel** with a local-first **SQLite** database.

## Vercel Deployment Steps

1. **Environment Variables**:
   In your Vercel Project Settings, add the following variables:
   - `DATABASE_URL`: `file:./dev.db`
   - `NEXTAUTH_SECRET`: Generate a random string (e.g., using `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

2. **Build Settings**:
   The `package.json` includes a `postinstall` script (`prisma generate`) which Vercel will run automatically. No custom build commands are strictly required, but ensure the framework is set to **Next.js**.

## Important Notes on SQLite + Vercel

> [!WARNING]
> **Persistence Limitation**: SQLite is a file-based database. Vercel's serverless functions have an ephemeral filesystem. This means any data created (new students, messages, results) while the app is running on Vercel **will be lost** when the function restarts or when you redeploy.

### Recommended for Production
To make the data persistent on Vercel, it is highly recommended to switch to a hosted PostgreSQL database:
1. Use **Vercel Postgres**, **Supabase**, or **Neon**.
2. Update the `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`.
3. Update `DATABASE_URL` to your hosted connection string.
4. Run `npx prisma db push` to sync the schema.

## Local Development
- Run `npm install`
- Run `npx prisma db push` (to initialize the local `dev.db`)
- Run `npm run seed` (to create the admin account)
- Run `npm run dev`
