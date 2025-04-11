/* eslint-disable react/prop-types */
'use client'
import { updateAvailability } from '@/actions/availability'
import { daysOfWeek, timeSlots } from '@/app/_lib/constants'
import { availabilitySchema } from '@/app/_lib/validators'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useFetch from '@/hooks/useFetch'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const AvailabilityForm = ({ initialData }) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    // mode: 'onChange',
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      ...initialData,
    },
  })
  console.log('🚀 ~ errors:', errors)

  console.log('🚀 ~ AvailabilityForm ~ errors:', errors)
  const timeField = [
    { id: 1, name: 'startTime', label: 'Start time' },
    { id: 2, name: 'endTime', label: 'End time' },
  ]

  const { loading, data, error, makeCall } = useFetch(updateAvailability)

  const onSubmit = async (formData) => {
    await makeCall(formData)
    if (data?.success) toast.success('Availability added successfully.')
    else toast.error('Failed to update the availability.')
    router.refresh()
  }

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-blue-100 bg-gradient-to-br from-white to-blue-50">
        <h2 className="text-2xl font-bold gradient-title mb-6 text-center">
          Weekly Availability
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {daysOfWeek.map((day) => {
            const name = `${day.toLowerCase()}.isAvailable`
            const isChecked = watch(name)

            return (
              <div
                key={day}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 border rounded-lg p-4 shadow-sm bg-gradient-to-tr from-white to-blue-50"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={name}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      console.log('🚀 ~ {daysOfWeek.map ~ checked:', checked)
                      setValue(name, checked, { shouldValidate: true })
                      if (!checked) {
                        setValue(`${day}.startTime`, '09:00')
                        setValue(`${day}.endTime`, '17:00')
                      }
                    }}
                    className={`w-5 h-5 border-blue-400 ${isChecked ? '!bg-blue-600' : ''}`}
                  />
                  <label
                    htmlFor={name}
                    className="text-gray-700 font-medium cursor-pointer text-lg"
                  >
                    {day[0] + day.slice(1).toLowerCase()}
                  </label>
                </div>

                {isChecked && (
                  <div
                    className={cn(
                      'flex items-center gap-4 transition-opacity duration-200',
                      isChecked ? 'opacity-100 visible' : 'opacity-0 invisible'
                    )}
                  >
                    {timeField.map((field, i) => (
                      <Fragment key={field.id}>
                        <Select
                          onValueChange={(value) =>
                            setValue(
                              `${day.toLowerCase()}.${field.name}`,
                              value,
                              { shouldValidate: true }
                            )
                          }
                          defaultValue={
                            initialData?.[day.toLowerCase()]?.[field.name]
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              'w-32 border-blue-300 shadow-sm',
                              errors?.[day.toLowerCase()]?.endTime &&
                                name === 'endTime' &&
                                'border-red-500 ring-1 ring-red-300'
                            )}
                          >
                            <SelectValue placeholder={`${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Time Slots</SelectLabel>
                              {timeSlots.map((time, index) => (
                                <SelectItem key={index} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {i === 0 && (
                          <span className="text-lg text-gray-700">to</span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                )}

                {errors?.[day.toLowerCase()]?.endTime?.message && (
                  <p className="text-sm text-red-500 ml-5">
                    {errors[day.toLowerCase()]?.endTime?.message}
                  </p>
                )}
              </div>
            )
          })}

          <div className="mt-6 space-y-1">
            <label
              htmlFor="timeGap"
              className="block text-sm font-medium text-gray-700"
            >
              Minimum gap before bookings (in minutes)
            </label>
            <Input
              id="timeGap"
              type="number"
              placeholder="Enter time gap"
              className={cn(
                'w-36 rounded-md border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-400',
                errors?.timeGap && 'border-red-500 focus:ring-red-400'
              )}
              {...register('timeGap', {
                valueAsNumber: true,
              })}
            />
            {errors?.timeGap?.message && (
              <p className="text-sm text-red-500">{errors.timeGap.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error.message}</p>}
          {errors?._form && (
            <p className="text-sm text-red-500 mt-2">{errors._form.message}</p>
          )}

          <Button className="mt-5 bg-blue-600" disabled={loading} type="submit">
            {loading ? 'Updating...' : 'Update Availability'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AvailabilityForm
