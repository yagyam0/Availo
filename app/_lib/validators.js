import { z } from 'zod'

export const userSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be at most 20 characters' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        'Username can only contain letters, numbers, underscores, and dashes',
    }),
})

export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, 'Title is required')
    .max(100, 'Title must be 100 characters or less.'),

  description: z
    .string()
    .min(5, 'Description is required')
    .max(500, 'Description must be 100 characters or less.'),

  duration: z
    .number('Duration is required.')
    .int()
    .positive('Duration must be a positive number.'),
  isPrivate: z.boolean(),
})

export const daySchema = z
  .object({
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isAvailable) {
        return data.startTime < data.endTime
      }
      return true
    },
    {
      message: 'End time must be more than start time',
      path: ['endTime'],
    }
  )

export const availabilitySchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  timeGap: z.number().min(0, 'Time gap must be 0 or more minutes').int(),
})
