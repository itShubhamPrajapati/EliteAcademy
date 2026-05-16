'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { 
  MoreHorizontal, 
  Search, 
  Trash2, 
  ShieldAlert, 
  KeyRound, 
  UserCog, 
  ChevronLeft, 
  ChevronRight,
  Download,
  CheckSquare,
  Square
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { toggleUserStatus, resetPassword } from '@/actions/admin/accounts'
import UserSlideOver from './UserSlideOver'

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  batch?: { grade: string } | null
  parent?: { name: string } | null
}



export function UserDataTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Batch']
    const rows = data.map(u => [
      u.name,
      u.email,
      u.role,
      u.isActive ? 'Active' : 'Suspended',
      u.batch?.grade || 'N/A'
    ])
    
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `elite_users_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="px-1">
          <button
            onClick={() => table.toggleAllRowsSelected()}
            className="text-white/20 hover:text-primary transition-colors"
          >
            {table.getIsAllRowsSelected() ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              row.toggleSelected()
            }}
            className="text-white/20 hover:text-primary transition-colors"
          >
            {row.getIsSelected() ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
          </button>
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-white">{row.getValue('name')}</span>
          <span className="text-xs text-white/40">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string
        return (
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
            role === 'ADMIN' ? 'bg-primary/10 border-primary/20 text-primary' :
            role === 'STUDENT' ? 'bg-success/10 border-success/20 text-success' :
            'bg-warning/10 border-warning/20 text-warning'
          }`}>
            {role}
          </span>
        )
      },
    },
    {
      accessorKey: 'batch',
      header: 'Batch/Link',
      cell: ({ row }) => {
        if (row.original.role === 'STUDENT') {
          return (
            <div className="text-xs">
              <div className="text-white/60">Class {row.original.batch?.grade || 'N/A'}</div>
              <div className="text-white/30 text-[10px]">P: {row.original.parent?.name || 'Unlinked'}</div>
            </div>
          )
        }
        return <span className="text-white/20">—</span>
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${row.original.isActive ? 'text-success' : 'text-destructive'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${row.original.isActive ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
          {row.original.isActive ? 'Active' : 'Suspended'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original
        const isOpen = activeMenu === user.id

        return (
          <div className="relative">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-white/5 hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation()
                setActiveMenu(isOpen ? null : user.id)
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            
            {isOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenu(null) }} />
                <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl p-1 shadow-2xl animate-in fade-in zoom-in duration-200">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedUserId(user.id); setActiveMenu(null) }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <UserCog size={14} /> View 360 Profile
                  </button>
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation()
                      if (confirm('Reset password to "password123"?')) {
                        await resetPassword(user.id)
                        alert('Password reset successfully')
                        setActiveMenu(null)
                      }
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <KeyRound size={14} /> Reset Password
                  </button>
                  <div className="my-1 h-px bg-white/5" />
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation()
                      await toggleUserStatus(user.id)
                      setActiveMenu(null)
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                      user.isActive ? 'text-destructive/70 hover:bg-destructive/10 hover:text-destructive' : 'text-success/70 hover:bg-success/10 hover:text-success'
                    }`}
                  >
                    <ShieldAlert size={14} /> {user.isActive ? 'Suspend User' : 'Unsuspend User'}
                  </button>
                </div>
              </>
            )}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  return (
    <div className="w-full space-y-4">
      <UserSlideOver userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <Input
            placeholder="Search by name or email..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="pl-10 h-11 bg-white/[0.03] border-white/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={exportToCSV}
            variant="outline" 
            className="h-11 border-white/10 bg-white/[0.02] gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <Download size={16} /> Export CSV
          </Button>
          <Select 
            value={(table.getColumn('role')?.getFilterValue() as string) ?? 'ALL'}
            onChange={(e) => table.getColumn('role')?.setFilterValue(e.target.value === 'ALL' ? '' : e.target.value)}
            className="w-40 h-11 text-xs uppercase tracking-widest font-bold"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="STUDENT">Student</option>
            <option value="PARENT">Parent</option>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.03]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-white/5">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[10px] font-bold uppercase tracking-widest text-white/30 h-12">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => setSelectedUserId(row.original.id)}
                  className={`cursor-pointer hover:bg-white/[0.04] transition-colors border-white/5 ${!row.original.isActive ? 'opacity-50 grayscale' : ''} ${row.getIsSelected() ? 'bg-primary/5' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center text-white/20">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={32} className="opacity-20" />
                    <p className="font-medium">No users found match your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 pt-2">
        <div className="text-xs text-white/30 font-medium">
          {Object.keys(rowSelection).length} of {table.getRowModel().rows.length} rows selected
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-9 px-3 gap-2 border-white/10 bg-white/[0.02] text-xs"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          <div className="hidden md:flex items-center gap-1">
            {Array.from({ length: table.getPageCount() }).map((_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  table.getState().pagination.pageIndex === i
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(10,132,255,0.4)]'
                    : 'text-white/30 hover:bg-white/5 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="h-9 px-3 gap-2 border-white/10 bg-white/[0.02] text-xs"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`flex rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all text-white/90 cursor-pointer ${className}`}
      {...props}
    />
  )
}
