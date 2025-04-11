/* eslint-disable react/prop-types */
import { Calendar, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

const EventDetails = ({ event }) => {
  const {
    title,
    description,
    duration,
    user: { name, email, imageUrl } = {},
  } = event || {}

  return (
    <div className="bg-white/60 backdrop-blur-lg border border-blue-100 rounded-3xl shadow-2xl p-10 space-y-8 bg-gradient-to-br from-white to-blue-50 animate-fade-in transition-all duration-500">
      {/* Title */}
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 tracking-tight text-center">
        {title}
      </h1>

      {/* User Info */}
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <Avatar className="w-24 h-24 border-4 border-white shadow-xl ring-4 ring-blue-200">
          <AvatarImage src={imageUrl} alt={name || 'User'} />
          <AvatarFallback className="text-2xl">{name?.[0] || 'U'}</AvatarFallback>
        </Avatar>

        <div className="text-center sm:text-left">
          <p className="text-xl font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      {/* Info Pills */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
        <div className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition">
          <Clock className="w-4 h-4" />
          <span>{duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition">
          <Calendar className="w-4 h-4" />
          <span>Google Meet</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="text-gray-700 text-base leading-relaxed mt-4 border-t border-blue-100 pt-4">
          {description}
        </div>
      )}
    </div>
  )
}

export default EventDetails
