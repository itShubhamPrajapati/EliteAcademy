# Deployment Guide: EliteAcademy V2

This project is optimized for deployment on **Vercel**. While it currently uses a local-first **SQLite** database for development, production deployment requires a few adjustments for persistence and stability.

## Vercel Deployment Steps

1. **Environment Variables**:
   In your Vercel Project Settings, add the following variables:
   - `DATABASE_URL`: `file:./dev.db` (for testing only) or your hosted Postgres URL (recommended).
   - `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`).
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`).

2. **Build Settings**:
   - Framework: **Next.js**
   - Build Command: `next build`
   - Install Command: `npm install` (Vercel runs the `postinstall` script `prisma generate` automatically).

## ⚠️ Important Production Considerations

To make the app fully functional and persistent on Vercel, you must address two ephemeral filesystem limitations:

### 1. Database Persistence
SQLite is a file-based database. Vercel's functions are ephemeral, meaning any data created in `dev.db` **will be lost** when the function restarts or you redeploy.

**Recommendation**: Switch to a hosted PostgreSQL database.
- Use **Vercel Postgres**, **Supabase**, or **Neon**.
- Update `provider = "postgresql"` in `prisma/schema.prisma`.
- Update `DATABASE_URL` in Vercel settings.
- Run `npx prisma db push` to initialize the production schema.

### 2. File Upload Persistence
The app currently saves Study Materials and Test Results to `public/uploads/`. Vercel **does not persist** files written to the local filesystem at runtime.

**Recommendation**: Use a cloud storage provider.
- Use **Vercel Blob**, **Cloudinary**, or **AWS S3**.
- Modify `src/actions/admin/upload.ts` and `src/actions/admin/results.ts` to upload to the chosen provider instead of using `fs.writeFile`.

## Local Development
- Run `npm install`
- Run `npx prisma db push` (to initialize the local `dev.db`)
- Run `npm run seed` (to create the admin account)
- Run `npm run dev`

