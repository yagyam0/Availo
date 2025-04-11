'use server'
import { daysOfWeek } from '@/app/_lib/constants'
import { db } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export const getUserAvailability = async () => {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  let isUser
  try {
    isUser = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        availability: {
          include: { days: true },
        },
      },
    })

    if (!isUser || !isUser.availability) {
      return null
    }

    const availabilityData = {
      timeGap: isUser.availability.timeGap,
    }

    daysOfWeek.forEach((day) => {
      const dayAvailability = isUser.availability.days.find(
        (d) => d.day === day
      )

      availabilityData[day] = {
        isAvailable: !!dayAvailability,
        startTime:
          dayAvailability?.dayAvailability?.startTime
            ?.toISOString()
            .slice(11, 16) || '09:00',
        endTime:
          dayAvailability?.dayAvailability?.endTime
            ?.toISOString()
            .slice(11, 16) || '17:00',
      }
    })

    return availabilityData
  } catch (error) {
    console.log('🚀 ~ getUserAvailability ~ error:', error)
  }
}

export async function updateAvailability(data) {
  const { userId } = await auth()
  console.log('🚀 ~ updateAvailability ~ userId:', userId)

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const isUser = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { availability: true },
  })

  if (!isUser) {
    throw new Error('User not found')
  }

  const availabilityData = Object.entries(data).flatMap(
    ([day, { isAvailable, startTime, endTime }]) => {
      if (isAvailable) {
        const baseDate = new Date().toISOString().split('T')[0] // Get current date in YYYY-MM-DD format

        return [
          {
            day: day.toUpperCase(),
            startTime: new Date(`${baseDate}T${startTime}:00Z`),
            endTime: new Date(`${baseDate}T${endTime}:00Z`),
          },
        ]
      }
      return []
    }
  )

  if (isUser.availability) {
    await db.availability.update({
      where: { id: isUser.availability.id },
      data: {
        timeGap: data.timeGap,
        days: {
          deleteMany: {},
          create: availabilityData,
        },
      },
    })
  } else {
    await db.availability.create({
      data: {
        userId: isUser.id,
        timeGap: data.timeGap,
        days: {
          create: availabilityData,
        },
      },
    })
  }

  return { success: true }
}
