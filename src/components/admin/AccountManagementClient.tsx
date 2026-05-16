'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import AddUserModal from '@/components/modals/AddUserModal'

interface AccountManagementClientProps {
  batches: { id: string; grade: string }[]
}

export default function AccountManagementClient({ batches }: AccountManagementClientProps) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  return (
    <>
      <AddUserModal 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        batches={batches} 
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Accounts</h1>
          <p className="text-white/40 text-lg">Manage students, parents and administrators.</p>
        </div>
        <Button 
          onClick={() => setIsAddUserOpen(true)}
          className="h-14 px-8 text-base font-bold gap-3 rounded-2xl shadow-[0_0_20px_rgba(10,132,255,0.3)] hover:shadow-[0_0_30px_rgba(10,132,255,0.5)]"
        >
          <UserPlus size={20} /> Add New User
        </Button>
      </div>
    </>
  )
}
