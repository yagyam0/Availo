'use server'

import { db } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'
import { google } from 'googleapis'

export async function createBooking(bookingData) {
  try {
    console.log("🚀 ~ createBooking ~ bookingData:", bookingData)
    // 1. Get event details
    const event = await db.event.findUnique({
      where: { id: bookingData?.eventId },
      include: { user: true },
    })
    console.log("🚀 ~ createBooking ~ event:", event, clerkClient)

    if (!event) {
      throw new Error('Event not found')
    }

    const client = await clerkClient();
    // 2. Get Google OAuth token of event owner
    const { data } = await client.users.getUserOauthAccessToken(
      event.user.clerkUserId || '',
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

    const { name, email, additionalInfo, startTime, endTime } = bookingData

    // 4. Create Google Calendar event
    const meetResponse = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${name} - ${event.title}`,
        description: additionalInfo,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
        attendees: [{ email }, { email: event.user.email }],
        conferenceData: {
          createRequest: {
            requestId: `${event.id}-${Date.now()}`,
          },
        },
      },
    })

    const meetLink = meetResponse?.data?.hangoutLink || ''
    const googleEventId = meetResponse?.data?.id || ''

    // 5. Save booking in database
    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name,
        email,
        startTime,
        endTime,
        additionalInfo,
        meetLink,
        googleEventId,
      },
    })

    return { success: true, meetLink, booking }

  } catch (error) {
    console.error('🚀 ~ createBooking ~ error:', error)
    return { success: false, error: error.message }
  }
}
