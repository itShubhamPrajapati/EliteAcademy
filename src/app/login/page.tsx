'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    const res = await signIn('credentials', { email: data.email, password: data.password, redirect: false })
    if (res?.error) {
      setServerError('Invalid email or password. Please try again.')
    } else {
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      if (session?.user?.role) {
        window.location.href = '/dashboard/' + session.user.role.toLowerCase()
      }
    }
  }

  const handleQuickLogin = (email: string) => {
    setValue('email', email)
    setValue('password', email.includes('admin') ? 'EliteAdmin2025!' : 'password123')
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.7)]">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 mb-4 shadow-[0_0_24px_rgba(10,132,255,0.3)]">
              <span className="text-2xl font-black text-primary">E</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Welcome back</h1>
            <p className="text-white/40 text-sm mt-1">Sign in to EliteAcademy</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                <AlertCircle size={16} className="shrink-0" />
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Email</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="admin@eliteacademy.com"
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Password</label>
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2 h-12 text-base font-bold">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2">Master Admin Portal</p>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@eliteacademy.com')}
              className="group flex items-center justify-between w-full text-left p-2 rounded-xl border border-primary/10 hover:border-primary/40 bg-primary/5 transition-all mb-4"
            >
              <div className="text-[10px] text-white/60">
                <div className="font-bold text-white group-hover:text-primary transition-colors">admin@eliteacademy.com</div>
                <div>Pass: EliteAdmin2025!</div>
              </div>
              <div className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-md font-bold uppercase">Admin</div>
            </button>

            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2">Student & Parent Demo</p>
            <div className="space-y-1">
              {[
                'student9@eliteacademy.com',
                'parent@eliteacademy.com',
              ].map(email => (
                <button
                  key={email}
                  type="button"
                  onClick={() => handleQuickLogin(email)}
                  className="block w-full text-left text-xs text-white/50 hover:text-primary transition-colors py-0.5"
                >
                  → {email} (Pass: password123)
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
