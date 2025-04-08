/* eslint-disable react/prop-types */
'use client'
import { createEventSchema } from '@/app/_lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { Label } from './ui/label'
import useFetch from '@/hooks/useFetch'
import { createNewEvent } from '@/actions/events'
import { useRouter } from 'next/navigation'
import { eventFormFields } from '@/app/_lib/FormFields'

const EventForm = ({ onSubmitForm }) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: 30,
      isPrivate: true,
    },
  })

  const isPrivate = watch('isPrivate')

  const { loading, error, makeCall } = useFetch(createNewEvent)

  const onSubmit = async (formData) => {
    console.log('🚀 ~ onSubmit ~ formData:', formData)
    await makeCall(formData)
    if (onSubmitForm && !loading && !error) onSubmitForm(formData)
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-5 md:p-0">
      {eventFormFields.map((field) => {
        const {
          id,
          name,
          label,
          placeholder,
          type,
          component: Component,
          ...rest
        } = field

        return (
          <div key={id} className="flex flex-col">
            <Label htmlFor={name} className="text-sm text-blue-600 font-medium">
              {label}
            </Label>
            {type === 'checkbox' ? (
              <div className="flex items-center gap-2">
                <Component
                  id={name}
                  checked={isPrivate}
                  onCheckedChange={(checked) =>
                    setValue(name, checked, { shouldValidate: true })
                  }
                  className={`${isPrivate ? 'main-bg' : ''} border-blue-300`}
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-600">
                  {isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
            ) : (
              <Component
                id={name}
                type={type}
                {...register(
                  name,
                  ...(name === 'duration'
                    ? [
                        {
                          valueAsNumber: true,
                        },
                      ]
                    : [])
                )}
                placeholder={placeholder}
                disabled={isSubmitting}
                {...rest}
                className="w-full border border-gray-300 focus-visible:ring-blue-400  rounded-md"
              />
            )}
            {errors[name] && (
              <p className="text-sm text-red-600 mt-1">
                {errors[name].message}
              </p>
            )}
          </div>
        )
      })}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      <Button type="submit" disabled={loading} className="w-full main-bg">
        {loading ? 'Submitting...' : 'Create Event'}
      </Button>
    </form>
  )
}

export default EventForm
