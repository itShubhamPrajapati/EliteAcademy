'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatWindow from '@/components/ChatWindow'
import { Card } from '@/components/ui/Card'
import { Search, MessageCircle } from 'lucide-react'
import { getConversation } from '@/actions/shared/messages'

type Contact = { id: string; name: string; role: string }
type Thread = { id: string; sender: Contact; text: string; createdAt: Date }

interface Props {
  adminId: string
  adminName: string
  threads: Thread[]
  contacts: Contact[]
}

export default function AdminMessageHub({ adminId, adminName, threads, contacts }: Props) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const threadedContactIds = new Set(threads.map(t => t.sender.id))
  const allContacts = [
    ...threads.map(t => t.sender),
    ...contacts.filter(c => !threadedContactIds.has(c.id)),
  ]

  const filtered = allContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelectContact = async (contact: Contact) => {
    setSelectedContact(contact)
    const res = await getConversation(contact.id)
    if (res.success) setChatMessages(res.messages as any[])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Message Hub</h1>
        <p className="text-white/50 mt-1">Communicate with students and parents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
        {/* Contact List */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search contacts…"
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/30 text-sm">No contacts</div>
            ) : (
              filtered.map(contact => (
                <motion.button
                  key={contact.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectContact(contact)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-white/5 text-left transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-primary/15' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{contact.name}</p>
                    <p className="text-[11px] text-white/40">{contact.role}</p>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {selectedContact ? (
              <motion.div
                key={selectedContact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col">
                  <ChatWindow
                    currentUserId={adminId}
                    currentUserName={adminName}
                    otherUserId={selectedContact.id}
                    otherUserName={selectedContact.name}
                    initialMessages={chatMessages}
                  />
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <MessageCircle size={32} className="text-primary/60" />
                  </div>
                  <p className="text-white/60 font-medium">Select a contact to start chatting</p>
                  <p className="text-white/30 text-sm">Respond to student doubts and parent queries</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
