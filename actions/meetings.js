'use server'

import { db } from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { google } from 'googleapis'

export async function getUserMeetings(type = 'upcoming') {
  try {
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

    const now = new Date()

    const meetings = await db.booking.findMany({
      where: {
        userId: isUser.id,
        startTime: type === 'upcoming' ? { gte: now } : { lt: now },
      },
      include: {
        event: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: type === 'upcoming' ? 'asc' : 'desc',
      },
    })
    console.log('🚀 ~ getUserMeetings ~ meetings:', meetings)

    return meetings
  } catch (error) {
    console.log('🚀 ~ getUserMeetings ~ error:', error)
  }
}

export async function cancelMeeting(meetingId) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const meeting = await db.booking.findUnique({
      where: { id: meetingId },
      include: { event: true, user: true },
    })

    if (!meeting || meeting.userId !== user.id) {
      throw new Error('Meeting not found')
    }

    const client = await clerkClient()
    // 2. Get Google OAuth token of event owner
    const { data } = await client.users.getUserOauthAccessToken(
      meeting.user.clerkUserId || '',
      'oauth_google'
    )

    const token = data[0]?.token
    if (!token) {
      throw new Error('Event creator has not connected to Google Calendar.')
    }

    // 3. Setup Google OAuth client
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: token })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: meeting.googleEventId,
    })

    await db.booking.delete({
      where: { id: meetingId },
    })

    return { success: true }
  } catch (error) {
    console.log('🚀 ~ cancelMeeting ~ error:', error)
  }
}
