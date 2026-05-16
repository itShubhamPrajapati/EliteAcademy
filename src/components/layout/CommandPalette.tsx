'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, Command, Users, CalendarCheck, FileText, MessageCircle, X, ChevronRight, User } from 'lucide-react'
import { searchUsers } from '@/actions/admin/accounts'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  const handleSearch = useCallback(async (q: string) => {
    if (!q) {
      setResults([])
      return
    }
    const res = await searchUsers(q)
    if (res.success) {
      setResults(res.data || [])
    }
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(query), 200)
    return () => clearTimeout(timer)
  }, [query, handleSearch])

  const navigation = [
    { label: 'Go to Overview', icon: Command, href: '/dashboard/admin' },
    { label: 'Manage Accounts', icon: Users, href: '/dashboard/admin/accounts' },
    { label: 'Mark Attendance', icon: CalendarCheck, href: '/dashboard/admin/attendance' },
    { label: 'Upload Results', icon: FileText, href: '/dashboard/admin/results' },
    { label: 'Messages', icon: MessageCircle, href: '/dashboard/admin/messages' },
  ]

  const filteredNav = navigation.filter(n => n.label.toLowerCase().includes(query.toLowerCase()))
  const allItems = [...filteredNav, ...results.map(r => ({ ...r, type: 'user' }))]

  const handleSelect = (item: any) => {
    if (item.href) {
      router.push(item.href)
    } else if (item.type === 'user') {
      // For now, jump to accounts with a query or something similar
      // In Phase 3, we can open the Slide-Over directly if we have state management
      router.push(`/dashboard/admin/accounts?id=${item.id}`)
    }
    setOpen(false)
    setQuery('')
  }

  useEffect(() => {
    if (open) {
      setSelectedIndex(0)
    }
  }, [open, query])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((i) => (i + 1) % allItems.length)
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((i) => (i - 1 + allItems.length) % allItems.length)
    } else if (e.key === 'Enter') {
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="flex items-center px-6 py-5 border-b border-white/10">
              <Search className="text-white/40 mr-4" size={22} />
              <input
                autoFocus
                placeholder="Search students, pages, or actions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder-white/20 font-medium"
              />
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/5">
                  Esc
                </div>
                <button onClick={() => setOpen(false)} className="text-white/20 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {allItems.length > 0 ? (
                <div className="space-y-1">
                  {allItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex
                    return (
                      <button
                        key={item.id || item.href}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                          isSelected ? 'bg-primary/20 text-white' : 'text-white/40 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-white/5'}`}>
                            {item.type === 'user' ? <User size={20} /> : <item.icon size={20} />}
                          </div>
                          <div className="text-left">
                            <div className={`font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}>{item.label || item.name}</div>
                            {(item.type === 'user' || item.href) && (
                              <div className="text-xs text-white/30">{item.email || item.href}</div>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                            Jump <ChevronRight size={14} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : query ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Search size={32} className="text-white/20" />
                  </div>
                  <p className="text-white/40 font-medium italic">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2">Suggestions</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {navigation.map((n, idx) => (
                      <button
                        key={n.href}
                        onClick={() => handleSelect(n)}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <n.icon size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{n.label}</div>
                          <div className="text-[10px] text-white/30">{n.href}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="text-white/40">↑↓</span> Navigate</span>
                <span className="flex items-center gap-1"><span className="text-white/40">Enter</span> Select</span>
              </div>
              <div>EliteAcademy V2 Command Engine</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
