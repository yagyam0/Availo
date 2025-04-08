import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { db } from './prisma'

export const checkUser = async () => {
  const user = await currentUser()
  if (!user) {
    return null
  }

  try {
    const loggedInUser = await db?.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    })
    if (loggedInUser) {
      return loggedInUser
    }
    const name = `${user.firstName} ${user.lastName}`

    await (await clerkClient()).users.updateUser(user.id, {
      username: name.split(' ').join('_') + user.id.slice(-4),
    })

    const newUser = await db.user.create({
      data: {
        clerkUserId: user?.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: user?.username,
      },
    })

    return newUser;
  } catch (error) {
    console.log('🚀 ~ checkUser ~ error:', error)
  }
}
