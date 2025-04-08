import { getUserEvents } from '@/actions/events'
import EventCard from '@/components/EventCard'
import EventCardSkeleton from '@/components/EventCardSkeleton'
import Image from 'next/image'
import React, { Suspense } from 'react'

export default async function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex gap-4 mt-10">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      }
    >
      <Events />
    </Suspense>
  )
}

const Events = async () => {
  const { events, username } = await getUserEvents()
  console.log('🚀 ~ Events ~ events:', events, username)

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-600">
        <Image
          src="/noevents.svg"
          alt="No events"
          width={100}
          height={100}
          className="w-48 h-48 opacity-80"
        />
        <h3 className="text-blue-600 font-semibold text-lg">No Events Yet</h3>
        <p className="text-gray-500 text-sm mt-1">
          You haven&apos;t created any events. Let&apos;s get started!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} username={username} />
      ))}
    </div>
  )
}
