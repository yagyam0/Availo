/* eslint-disable react/prop-types */
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import CancelMeeting from './CancelMeeting'

const MeetingList = ({ meetings, type }) => {
  if (!meetings.length) {
    return (
      <div className="text-center text-gray-500 italic mt-10">
        No {type} meetings found.
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => {
        const {
          id,
          name,
          email,
          additionalInfo,
          startTime,
          endTime,
          meetLink,
          event,
        } = meeting

        const formattedStart = format(
          new Date(startTime),
          'eee, dd MMM yyyy • hh:mm a'
        )
        const formattedEnd = format(new Date(endTime), 'hh:mm a')

        return (
          <Card
            key={id}
            className="rounded-2xl shadow-md border border-blue-100 hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 via-white to-blue-100"
          >
            <CardHeader className="pb-3 space-y-1">
              <CardTitle className="text-lg sm:text-xl text-blue-800 font-semibold flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                {event?.title}
                <span className="text-sm font-semibold text-gray-600 sm:ml-2">
                  ⏳ {event?.duration} min
                </span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {event?.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm text-gray-700 border-t border-blue-100 pt-3">
              <div>
                <span className="font-medium text-blue-700">
                  👤 Participant:{' '}
                </span>
                <span className="text-gray-800">
                  {name} (
                  <a
                    href={`mailto:${email}`}
                    className="underline text-blue-600 hover:text-blue-800 transition"
                  >
                    {email}
                  </a>
                  )
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-700">🕒 Schedule: </span>
                {formattedStart} - {formattedEnd}
              </div>
              {additionalInfo && (
                <div>
                  <span className="font-medium text-blue-700">📝 Note: </span>
                  {additionalInfo}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 pt-4 border-t border-blue-100 text-sm">
              {meetLink ? (
                <Button
                  asChild
                  variant="outline"
                  className="text-blue-700 border-blue-300 hover:bg-blue-100 transition w-full sm:w-auto"
                >
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    Join Meeting <ExternalLink size={16} />
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-gray-500">No link available</span>
              )}

              <CancelMeeting meetingId={id} />
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

export default MeetingList
