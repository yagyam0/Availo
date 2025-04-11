'use server'

import { db } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function getLatestUpdates() {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const isUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!isUser) {
      throw new Error('User not found')
    }

    const now = new Date()

    const upcomingMeetings = await db.booking.findMany({
      where: {
        userId: isUser.id,
        startTime: { gte: now },
      },
      include: {
        event: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 3,
    })
    console.log('🚀 ~ getUserMeetings ~ meetings:', upcomingMeetings)

    return upcomingMeetings
  } catch (error) {
    console.log('🚀 ~ getLatestUpdates ~ error:', error)
  }
}
