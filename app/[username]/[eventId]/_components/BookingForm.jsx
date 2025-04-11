/* eslint-disable react/prop-types */
'use client'

import { bookingSchema } from '@/app/_lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import 'react-day-picker/style.css'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { bookingFormFields } from '@/app/_lib/FormFields'
import { Label } from '@/components/ui/label'
import useFetch from '@/hooks/useFetch'
import { createBooking } from '@/actions/bookings'
import toast from 'react-hot-toast'

const BookingForm = ({ event, availability }) => {
  console.log('🚀 ~ BookingForm ~ event:', event)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  })

  useEffect(() => {
    if (selectedDate)
      setValue('date', format(selectedDate, 'yyyy-MM-dd'), {
        shouldValidate: true,
      })
  }, [selectedDate])

  useEffect(() => {
    if (selectedTime) setValue('time', selectedTime, { shouldValidate: true })
  }, [selectedTime])

  const { loading, data, makeCall, error } = useFetch(createBooking)
  console.log("🚀 ~ BookingForm ~ data:", data)

  const availableDates = useMemo(
    () => availability.map((day) => new Date(day.date)),
    [availability]
  )

  const timeSlots = useMemo(() => {
    if (!selectedDate) return []
    const selected = availability.find(
      (day) => day.date === format(selectedDate, 'yyyy-MM-dd')
    )
    return selected?.slots || []
  }, [availability, selectedDate])

  const onSubmit = async (bookingData) => {
    if (!selectedDate || !selectedTime) {
      toast.error('Date or time not selected.')
      return
    }

    const startTime = new Date(
      `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`
    )
    const endTime = new Date(startTime.getTime() + event.duration * 60000)

    const payload = {
      ...bookingData,
      eventId: event?.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    }

    await makeCall(payload)
    if (data?.success) toast.success('Hurray!! your slot is confirmed.')
    else toast.error('Something went wrong in booking your session.')
  }

  if (data) {
    console.log('🚀 ~ BookingForm ~ data:', data)
    return (
      <>
        {data?.success ? (
          <div className="max-w-xl mx-auto mt-10 p-6 bg-green-50 border border-green-200 rounded-2xl shadow-md text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl shadow-inner">
                ✅
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-700">
              Booking Confirmed!
            </h2>
            <p className="text-gray-700">
              Your session has been successfully scheduled. We’ve sent a
              confirmation email with the details.
            </p>
            {data?.meetLink && (
              <p className="text-blue-700 font-medium">
                Join the meeting:{' '}
                <a
                  href={data.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-900 transition-colors"
                >
                  {data.meetLink}
                </a>
              </p>
            )}
          </div>
        ) : (
          <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-md text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl shadow-inner">
                ❌
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-700">Booking Failed</h2>
            <p className="text-gray-700">
              Something went wrong while scheduling your session. Please try
              again.
            </p>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-xl rounded-2xl border border-blue-100">
      <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-6">
        Book a session
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="flex flex-col gap-4 w-full">
          <label className="text-blue-600 font-medium text-sm sm:text-base">
            Select a Date
          </label>
          <div className="w-full">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date)
                setSelectedTime(null)
              }}
              disabled={[{ before: new Date() }]}
              modifiers={{ available: availableDates }}
              modifiersStyles={{
                available: {
                  backgroundColor: '#bfdbfe',
                  color: '#1e3a8a',
                  borderRadius: '50%',
                  fontWeight: 'bold',
                },
              }}
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="flex flex-col gap-4 w-full">
          <label className="text-blue-600 font-medium text-sm sm:text-base">
            Select a Time
          </label>
          {selectedDate ? (
            timeSlots.length ? (
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    variant={selectedTime === slot ? 'default' : 'outline'}
                    className={cn(
                      'transition-all px-4 py-2 text-sm',
                      selectedTime === slot && 'ring-2 ring-blue-300'
                    )}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No time slots available for this date.
              </p>
            )
          ) : (
            <p className="text-gray-400 text-sm">Pick a date to view times.</p>
          )}
        </div>
      </div>

      {/* Submit */}
      {selectedDate && (
        <form className="space-y-4 mt-5" onSubmit={handleSubmit(onSubmit)}>
          {bookingFormFields?.map((field) => {
            const {
              id,
              name,
              placeholder,
              component: Component,
              type,
              label,
            } = field
            return (
              <div key={id} className="flex flex-col">
                <Label
                  htmlFor={name}
                  className="text-sm text-blue-600 font-medium"
                >
                  {label}
                </Label>
                <Component
                  id={name}
                  key={id}
                  type={type}
                  {...register(name)}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 focus-visible:ring-blue-400  rounded-md"
                />
                {errors[name] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[name].message}
                  </p>
                )}
              </div>
            )
          })}
          {error && <p className="m-4 text-red-600">{error}</p>}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default BookingForm
