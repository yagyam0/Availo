/* eslint-disable react/prop-types */
'use client'
import React, { useState } from 'react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Clock, Link, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import useFetch from '@/hooks/useFetch'
import { deleteEvent } from '@/actions/events'
import { useRouter } from 'next/navigation'
import { AlertUserDialog } from './AlertUserDialog'

const EventCard = ({ event, username, isPublic = false }) => {
  const [copy, setCopy] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { title, description, duration, isPrivate, _count } = event

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${username}/${event.id}`
      )
      setCopy(true)
      setTimeout(() => setCopy(false), 2000)
    } catch (error) {
      console.log('🚀 ~ handleCopy ~ error:', error)
    }
  }

  const handleCardClick = (e) => {
    const { tagName } = e.target

    if (!['BUTTON', 'SVG'].includes(tagName)) {
      window.open(`${window.location.origin}/${username}/${event.id}`, '_blank')
    }
  }

  const { loading, makeCall: deleteEventById, error } = useFetch(deleteEvent)
  console.log('🚀 ~ EventCard: delete event error', error)

  const handleShowDialog = () => {
    setIsOpen(!isOpen)
  }

  const handleDeleteEvent = async () => {
    await deleteEventById(event?.id)
    router.refresh()
  }

  return (
    <>
      <Card
        className={cn(
          'w-full max-w-xl border border-blue-200 bg-gradient-to-tr from-white/80 to-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300'
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold text-blue-600">
                {title}
              </CardTitle>
              <p className="text-gray-400 text-sm">
                {_count?.bookings ?? 0} Bookings
              </p>
            </div>
            <Badge
              className="bg-blue-600 text-white rounded-md text-xs"
              variant="secondary"
            >
              {isPrivate ? 'Private' : 'Public'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="py-4 text-sm text-gray-700 space-y-3">
          {description && (
            <p className="line-clamp-2 text-gray-600">{description}</p>
          )}

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{duration} mins</span>
          </div>
        </CardContent>

        {!isPublic && (
          <CardFooter className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm min-w-[110px] justify-center"
              onClick={handleCopy}
            >
              <Link className="h-4 w-4" />
              <span className="relative w-[70px] text-left">
                <span
                  className={cn(copy ? 'opacity-0 absolute' : 'opacity-100')}
                >
                  Copy Link
                </span>
                <span
                  className={cn(copy ? 'opacity-100' : 'opacity-0 absolute')}
                >
                  Copied!
                </span>
              </span>
            </Button>

            <Button
              variant="destructive"
              onClick={handleShowDialog}
              className="flex items-center gap-2 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </CardFooter>
        )}
      </Card>
      <AlertUserDialog
        action={handleDeleteEvent}
        isOpen={isOpen}
        loading={loading}
        description={
          'This action cannot be undone. This will permanently delete this event from our servers.'
        }
        handleClose={handleShowDialog}
      />
    </>
  )
}

export default EventCard
