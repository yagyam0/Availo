'use server'

import { createEventSchema } from '@/app/_lib/validators'
import { db } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

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

  const event = await db.event.findFirst({
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

  return event
}
