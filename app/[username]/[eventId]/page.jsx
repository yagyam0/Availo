/* eslint-disable react/prop-types */
import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getEventAvailability, getEventDetails } from '@/actions/events'
import EventDetails from './_components/EventDetails'
import BookingForm from './_components/BookingForm'

export async function generateMetadata({ params }) {
  const { username, eventId } = await params
  const event = await getEventDetails({ username, eventId })

  if (!event) {
    return {
      title: 'Event not found',
    }
  } else {
    return {
      title: `Book ${event.title} with ${event.user?.name} | Availo`,
      description: `Schedule a ${event.duration}-minutes ${event.title} with ${event.user.name}.`,
    }
  }
}

const EventPage = async ({ params }) => {
  const { username, eventId } = await params
  const event = await getEventDetails({ username, eventId })
  const availability = await getEventAvailability(eventId)
  console.log('🚀 ~ EventPage ~ availability:', availability)

  if (!event) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-12 items-start">
      {/* Event Page */}
      <div className="w-full lg:w-1/2">
        <EventDetails event={event} />
      </div>

      {/* Booking Form */}
      <div className="w-full ">
        <Suspense fallback={<div>Loading form...</div>}>
          <BookingForm event={event} availability={availability} />
        </Suspense>
      </div>
    </div>
  )
}

export default EventPage
