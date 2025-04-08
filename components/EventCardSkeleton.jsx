import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const EventCardSkeleton = () => {
  return (
    <Card className="w-full max-w-xl border-blue-100 bg-gradient-to-tr from-white to-blue-50 shadow-sm animate-pulse rounded-xl">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/3 bg-blue-100" />
          <Skeleton className="h-5 w-16 bg-blue-100 rounded-sm" />
        </div>
        <Skeleton className="h-4 w-24 bg-blue-100" />
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <Skeleton className="h-4 w-full bg-blue-100" />
        <Skeleton className="h-4 w-3/4 bg-blue-100" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full bg-blue-100" />
          <Skeleton className="h-4 w-16 bg-blue-100" />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 mt-2">
        <Skeleton className="h-8 w-24 bg-blue-200 rounded-md" />
        <Skeleton className="h-8 w-20 bg-blue-100 rounded-md" />
      </CardFooter>
    </Card>
  )
}

export default EventCardSkeleton;
