/* eslint-disable react/prop-types */
import { getUserData } from '@/actions/users'
import EventCard from '@/components/EventCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { notFound } from 'next/navigation'
import React from 'react'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'

export async function generateMetadata({ params }) {
  const { username } = await params
  const user = await getUserData(username)

  if (!user) {
    return {
      title: 'User not found',
    }
  } else {
    return {
      title: `${user.name}'s Profile | Availo`,
      description: `Book an event with ${user.name}. View available public events and schedules.`,
    }
  }
}

const UserPage = async ({ params }) => {
  const { username } = await params
  const user = await getUserData(username)

  if (!user) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-4">
      <div className="max-w-4xl w-full text-center space-y-6 animate-fade-in">
        {/* Avatar and Heading */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 opacity-30 blur-md group-hover:opacity-50 transition" />
            <Avatar className="w-28 h-28 border-4 border-white shadow-2xl ring-2 ring-blue-200">
              <AvatarImage src={user?.imageUrl} alt={user?.name || 'User'} />
              <AvatarFallback className="text-xl">
                {user?.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2">
            {user?.name}
            <Sparkles className="text-yellow-500 w-6 h-6 animate-pulse" />
          </h1>

          <p className="text-lg text-gray-600 mt-2 max-w-xl">
            Welcome to my scheduling page! Choose a session below to book a call
            with me.
          </p>
        </div>
      </div>

      {/* Events */}
      <div className="w-full max-w-6xl mt-10">
        {!user?.events.length ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-600 animate-fade-in">
            <Image
              src="/noevents.svg"
              alt="No events"
              width={200}
              height={200}
              className="opacity-80 mb-4"
            />
            <h3 className="text-blue-600 font-semibold text-lg">
              No Events Yet
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              You haven&apos;t created any events. Let&apos;s get started!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in-slow">
            {user.events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                username={username}
                isPublic
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPage
