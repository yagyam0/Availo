import { getUserAvailability } from '@/actions/availability'
import React from 'react'
import AvailabilityForm from './_component/AvailabilityForm'
import { defaultAvailability } from '@/app/_lib/constants'

const AvailabilityPage = async () => {
  const availability = await getUserAvailability()
  console.log('🚀 ~ AvailabilityPage ~ availability:', availability)

  return (
    <div>
      <AvailabilityForm initialData={availability || defaultAvailability} />
    </div>
  )
}

export default AvailabilityPage
