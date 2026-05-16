'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, CalendarCheck, FileText, ChevronLeft,
  ChevronRight, LogOut, FilePlus, MessageCircle
} from 'lucide-react'
import NotificationBell from './NotificationBell'

const roleLinks = {
  ADMIN: [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin/accounts', label: 'Accounts', icon: Users },
    { href: '/dashboard/admin/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/dashboard/admin/results', label: 'Results', icon: FileText },
    { href: '/dashboard/admin/create-test', label: 'Tests', icon: FilePlus },
    { href: '/dashboard/admin/messages', label: 'Messages', icon: MessageCircle },
  ],
  STUDENT: [
    { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/student/messages', label: 'Ask Doubt', icon: MessageCircle },
  ],
  PARENT: [
    { href: '/dashboard/parent', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/parent/messages', label: 'Messages', icon: MessageCircle },
  ],
}

export default function Sidebar({ role }: { role: string | undefined }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const links = roleLinks[(role as keyof typeof roleLinks)] || []

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex h-screen sticky top-0 flex-col justify-between shrink-0 border-r border-white/[0.06] bg-black/60 backdrop-blur-2xl z-30"
      >
        <div className="flex flex-col gap-4 pt-6">
          {/* Logo */}
          <div className={`flex items-center gap-3 px-4 mb-2 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <AnimatePresence mode="popLayout">
              {!collapsed && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="text-base font-extrabold tracking-tight text-white"
                >
                  <span className="text-primary">Elite</span>Academy
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 px-2">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      active
                        ? 'bg-primary/20 text-primary font-semibold'
                        : 'text-white/50 hover:bg-white/[0.06] hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <link.icon size={18} className={active ? 'text-primary' : ''} />
                    {!collapsed && <span className="text-sm">{link.label}</span>}
                    {active && !collapsed && (
                      <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/[0.06] flex flex-col gap-2">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
            {!collapsed && (
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">{role}</span>
            )}
            <NotificationBell />
          </div>
          <Link href="/api/auth/signout">
            <motion.div
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut size={18} />
              {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
            </motion.div>
          </Link>
        </div>
      </motion.aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="flex items-center justify-around bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-2 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          {links.slice(0, 5).map((link) => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                    active ? 'text-primary' : 'text-white/40'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute inset-0 bg-primary/15 rounded-xl"
                    />
                  )}
                  <link.icon size={20} />
                  <span className="text-[10px] font-medium">{link.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
