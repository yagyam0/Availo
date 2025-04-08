/* eslint-disable no-undef */
'use server'

import { db } from '@/lib/prisma'
import { auth, createClerkClient } from '@clerk/nextjs/server'

// Log process.env at module level to debug
console.log('🚀 ~ process.env at module level:', process.env)

export async function updateUsername(username) {
  const CLERK_SECRET_KEY = process.env?.CLERK_SECRET_KEY
  console.log('🚀 ~ updateUsername ~ CLERK_SECRET_KEY:', CLERK_SECRET_KEY)

  if (!CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is not defined in environment variables')
  }

  const { userId } = await auth()
  const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY })
  console.log('🚀 ~ updateUsername ~ userId:', userId)
  console.log('🚀 ~ clerkClient:', JSON.stringify(clerkClient, null, 2))

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const existingUser = await db.user.findUnique({
    where: { username },
  })

  if (existingUser && existingUser.id !== userId) {
    throw new Error('Username is already taken')
  }

  await db.user.update({
    where: { clerkUserId: userId },
    data: { username },
  })

  await clerkClient.users.updateUser(userId, { username })

  return { success: true }
}

export async function getUserData(username) {
  let user
  try {
    user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        events: {
          where: {
            isPrivate: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            isPrivate: true,
            _count: {
              select: { bookings: true },
            },
          },
        },
      },
    })
  } catch (error) {
    console.log('🚀 ~ getUserData ~ error:', error)
  }

  return user
}
