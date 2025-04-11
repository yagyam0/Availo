'use server'

import { createEventSchema } from '@/app/_lib/validators'
import { db } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import {
  addDays,
  addMinutes,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from 'date-fns'

export async function createNewEvent(eventData) {
  console.log('🚀 ~ createNewEvent ~ eventData:', eventData)
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const validatedEventData = createEventSchema.parse(eventData)

  const isUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  })

  if (!isUser) {
    throw new Error("User doesn't exist.")
  }

  const event = await db.event.create({
    data: {
      ...validatedEventData,
      userId: isUser?.id,
    },
  })

  return event
}

export async function getUserEvents() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }
  let events, isUser

  try {
    isUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    })
    console.log("🚀 ~ getUserEvents ~ isUser:", isUser)

    if (!isUser) {
      throw new Error("User doesn't exist.")
    }

    events = await db.event.findMany({
      where: { userId: isUser?.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    })
  } catch (error) {
    console.log('🚀 ~ getUserEvents ~ error:', error)
  }

  return { events, username: isUser?.username }
}

export async function deleteEvent(eventId) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const isUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  })

  if (!isUser) {
    throw new Error("User doesn't exist.")
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
  })

  if (!event || event.userId !== isUser?.id) {
    console.log(
      '🚀 ~ deleteEvent ~ event.userId !== isUser?.id:',
      event.userId,
      isUser?.id
    )
    throw new Error('Event not found.')
  }

  await db.event.delete({
    where: { id: eventId },
  })

  return { success: true }
}

export async function getEventDetails(data) {
  const { username, eventId } = data
  let event

  try {
    event = await db.event.findFirst({
      where: {
        id: eventId,
        user: {
          username: username,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
            email: true,
          },
        },
      },
    })
  } catch (error) {
    console.log('🚀 ~ getEventDetails ~ error:', error)
  }

  return event
}

export async function getEventAvailability(eventId) {
  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      user: {
        include: {
          availability: {
            select: {
              days: true,
              timeGap: true,
            },
          },
          bookings: {
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  })

  if (!event || !event.user.availability) {
    return []
  }

  const { availability, bookings } = event.user
  const startDate = startOfDay(new Date())
  const endDate = addDays(startDate, 30)

  const availableDates = []

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const dayOfWeek = format(date, 'EEEE').toUpperCase()
    const dayAvailability = availability.days.find(
      ({ day }) => day === dayOfWeek
    )

    if (dayAvailability) {
      const dateStr = format(date, 'yyyy-MM-dd')

      const slots = generateAvailableTimeSlots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        event.duration,
        bookings,
        dateStr,
        availability.timeGap
      )

      availableDates.push({ date: dateStr, slots })
    }
  }

  return availableDates
}

function generateAvailableTimeSlots(
  startTime,
  endTime,
  duration,
  bookings,
  dateStr,
  timeGap = 0
) {
  const slots = []
  let slotStartTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  )
  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  )

  const now = new Date()
  if (format(now, 'yyyy-MM-dd') === dateStr) {
    slotStartTime = isBefore(slotStartTime, now)
      ? addMinutes(now, timeGap)
      : slotStartTime
  }

  while (slotStartTime < slotEndTime) {
    const slotEnd = new Date(slotStartTime.getTime() + duration * 60000)
    const isSlotAvailable = !bookings.some((booking) => {
      const bookingStart = booking.startTime
      const bookingEnd = booking.endTime

      return (
        (slotStartTime >= bookingStart && slotStartTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (slotStartTime <= bookingStart && slotEnd >= bookingEnd)
      )
    })

    if (isSlotAvailable) {
      slots.push(format(slotStartTime, 'HH:mm'))
    }

    slotStartTime = slotEnd
  }

  return slots
}
