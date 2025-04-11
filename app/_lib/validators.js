import { z } from 'zod'
import { daysOfWeek } from './constants'

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

const singleDaySchema = z
  .object({
    isAvailable: z.boolean(true),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

// Build schema per day, allowing days to be optional
const daysSchema = daysOfWeek.reduce((acc, day) => {
  acc[day.toLowerCase()] = singleDaySchema.optional()
  return acc
}, {})

export const availabilitySchema = z
  .object({
    ...daysSchema,
    timeGap: z
      .number({ invalid_type_error: 'Time gap is required' })
      .min(0, 'Time gap must be 0 or more'),
  })
  .refine(
    (data) => {
      return Object.values(data).some((day) => day?.isAvailable)
    },
    {
      message: 'At least one day must be selected',
      path: ['_form'], // custom field for global errors
    }
  )

export const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  additionalInfo: z.string().optional(),
})
