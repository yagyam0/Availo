/* eslint-disable react/prop-types */
import React, { Suspense } from 'react'
import AvailabilityFormSkeleton from './_component/AvailabilityFormSkeleton'

export default async function AvailabilityLayout({ children }) {
  return (
    <div className='mx-auto'>
      <Suspense fallback={<AvailabilityFormSkeleton />}>
        {children}
      </Suspense>
    </div>
  )
}
