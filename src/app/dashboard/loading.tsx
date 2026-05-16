import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="space-y-xl">
      <div className="space-y-sm">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <Skeleton className="h-32 w-full rounded-[24px]" />
        <Skeleton className="h-32 w-full rounded-[24px]" />
        <Skeleton className="h-32 w-full rounded-[24px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <Skeleton className="h-64 w-full rounded-[24px]" />
        <Skeleton className="h-64 w-full rounded-[24px]" />
      </div>
    </div>
  )
}
