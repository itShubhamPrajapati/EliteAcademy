'use client'
import { useState, useEffect, useOptimistic, useRef, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Smile, Paperclip, Hash, Info, MoreVertical, MessageCircle } from 'lucide-react'
import { sendMessage, getConversation } from '@/actions/shared/messages'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({ text: z.string().min(1).max(1000) })
type FormData = z.infer<typeof schema>

type Message = {
  id: string
  text: string
  createdAt: Date
  senderId: string
  sender: { id: string; name: string; role: string }
}

interface ChatWindowProps {
  currentUserId: string
  currentUserName: string
  otherUserId: string
  otherUserName: string
  initialMessages: Message[]
}

export default function ChatWindow({
  currentUserId,
  currentUserName,
  otherUserId,
  otherUserName,
  initialMessages,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMsg: Message) => [...state, newMsg]
  )
  const [isPending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getConversation(otherUserId)
      if (res.success) setMessages(res.messages as Message[])
    }, 3000)
    return () => clearInterval(interval)
  }, [otherUserId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [optimisticMessages])

  const onSubmit = async (data: FormData) => {
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      text: data.text,
      createdAt: new Date(),
      senderId: currentUserId,
      sender: { id: currentUserId, name: currentUserName, role: '' },
    }

    reset()

    startTransition(async () => {
      addOptimisticMessage(tempMsg)
      const res = await sendMessage({ text: data.text, receiverId: otherUserId })
      if (res.success) {
        const updated = await getConversation(otherUserId)
        if (updated.success) setMessages(updated.messages as Message[])
      }
    })
  }

  // Group messages by date and sender
  const renderMessages = () => {
    let lastDate = ''
    let lastSenderId = ''

    return optimisticMessages.map((msg, index) => {
      const msgDate = new Date(msg.createdAt).toLocaleDateString()
      const showDateSeparator = msgDate !== lastDate
      const isSameSender = msg.senderId === lastSenderId && !showDateSeparator
      lastDate = msgDate
      lastSenderId = msg.senderId

      const isOwn = msg.senderId === currentUserId

      return (
        <div key={msg.id} className="space-y-1">
          {showDateSeparator && (
            <div className="flex items-center gap-4 py-6">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{msgDate}</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, x: isOwn ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex gap-3 ${isSameSender ? 'pl-11' : 'pt-3'}`}
          >
            {!isOwn && !isSameSender && (
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary shrink-0 mt-1">
                {msg.sender.name.charAt(0)}
              </div>
            )}
            
            <div className={`flex flex-col ${isOwn ? 'items-end flex-1' : 'items-start'}`}>
              {!isSameSender && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white/80">{isOwn ? 'You' : msg.sender.name}</span>
                  <span className="text-[10px] text-white/20 font-medium">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              
              <div
                className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  isOwn
                    ? 'bg-primary text-white rounded-tr-sm shadow-[0_4px_12px_rgba(10,132,255,0.2)]'
                    : 'bg-white/5 text-white/90 rounded-tl-sm border border-white/5'
                } ${msg.id.startsWith('temp-') ? 'opacity-50 grayscale' : ''}`}
              >
                {msg.text}
              </div>
            </div>

            {isOwn && !isSameSender && (
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 shrink-0 mt-1">
                ME
              </div>
            )}
          </motion.div>
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col h-full bg-white/[0.01]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
            <Hash size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">{otherUserName}</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Live Thread</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 transition-all"><Info size={18} /></button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 transition-all"><MoreVertical size={18} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1 custom-scrollbar">
        {renderMessages()}
        {optimisticMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/10 space-y-3">
            <div className="w-16 h-16 rounded-[24px] bg-white/[0.02] border border-white/5 flex items-center justify-center">
              <MessageCircle size={32} />
            </div>
            <p className="text-sm font-medium tracking-tight">No message history yet.</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/[0.02]">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="relative flex flex-col rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl focus-within:border-primary/50 transition-all"
        >
          <textarea
            {...register('text')}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(onSubmit)()
              }
            }}
            placeholder={`Message ${otherUserName}...`}
            className="w-full min-h-[56px] max-h-32 p-4 bg-transparent text-sm text-white placeholder:text-white/20 outline-none resize-none"
          />
          <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-1">
              <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-white/20 transition-all"><Paperclip size={16} /></button>
              <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-white/20 transition-all"><Smile size={16} /></button>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isPending}
              className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_8px_16px_rgba(10,132,255,0.3)] disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <><Send size={14} /> Send</>}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}
