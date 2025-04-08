/* eslint-disable react/prop-types */
import React, { Suspense } from 'react'
import { getUserData } from '@/actions/users'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getEventDetails } from '@/actions/events'

export async function generateMetadata({ params }) {
  const { username, eventId } = await params
  const event = await getEventDetails({ username, eventId })

  if (!event) {
    return {
      title: 'Event not found',
    }
  } else {
    return {
      title: `Book ${event.title} with ${event.user?.name} | Calendly`,
      description: `Schedule a ${event.duration}-minutes ${event.title} with ${event.user.name}.`,
    }
  }
}

const UserPage = async ({ params }) => {
  const { username, eventId } = await params
  const event = await getEventDetails({ username, eventId });

  if (!event) {
    notFound()
  }

  return (
    <div>
      {/* <EventDetails /> */}
      <Suspense>
      {/* <BookingForm /> */}
      </Suspense>
    </div>
  )
}

export default UserPage
