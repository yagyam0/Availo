
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const AvailabilityFormSkeleton = () => {
  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-blue-100 bg-gradient-to-br from-white to-blue-50">
        <Skeleton className="h-6 w-60 mb-8 mx-auto" />

        <div className="space-y-6">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-lg p-4 shadow-sm bg-gradient-to-tr from-white to-blue-50"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-32 rounded-md" />
                <span className="text-lg text-gray-700">to</span>
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
          ))}

          <div className="space-y-2 mt-6">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>

          <Skeleton className="h-10 w-44 rounded-md mt-4" />
        </div>
      </div>
    </div>
  )
}

export default AvailabilityFormSkeleton
