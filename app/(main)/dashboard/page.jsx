'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/app/_lib/validators'
import useFetch from '@/hooks/useFetch'
import { updateUsername } from '@/actions/users'
import { BarLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import { getLatestUpdates } from '@/actions/dashboard'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

const Dashboard = () => {
  const { isLoaded, user } = useUser()
  const [webUrl, setWebUrl] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(userSchema),
  })

  const {
    loading: dashBoardDataLoading,
    error: dashBoardDataError,
    data: upcomingMeetings,
    makeCall: getDashBoardUpdates,
  } = useFetch(getLatestUpdates)

  useLayoutEffect(() => {
    setWebUrl(window.location.origin)
    if (isLoaded) setValue('username', user?.username, { shouldValidate: true })
  }, [isLoaded])

  useEffect(() => {
    ;(async () => await getDashBoardUpdates())()
  }, [])

  const { loading, data: response, error, makeCall } = useFetch(updateUsername)

  const onSubmit = async (data) => {
    makeCall(data.username)
    if (response.success) toast.success('Username updated successfully.')
    else toast.error('Failed to update the username.')
  }

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card className="shadow-xl border border-gray-100 rounded-2xl bg-white transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            👋 Welcome back, {user?.firstName}!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-600 text-sm">
            Here’s a quick overview of your upcoming meetings:
          </p>

          {dashBoardDataLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="space-y-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {upcomingMeetings?.length ? (
                <div className="space-y-3">
                  {upcomingMeetings.map((meeting) => {
                    const { id, title, name, startTime } = meeting
                    return (
                      <div
                        key={id}
                        className="p-3 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition"
                      >
                        <p className="font-medium text-blue-800">{title}</p>
                        <p className="text-sm text-gray-700">
                          {format(new Date(startTime), 'MMM d, yyyy • h:mm a')}{' '}
                          with <span className="font-semibold">{name}</span>
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No upcoming meetings found.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Unique Link Card */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Your Unique Scheduling Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 w-full">
                <span className="text-blue-600 text-md whitespace-nowrap">
                  {webUrl}
                </span>
                <Input
                  {...register('username')}
                  placeholder={'Enter username'}
                  maxLength="20"
                />
              </div>
              {(error || errors.username) && (
                <p className="text-red-600 text-sm">
                  {' '}
                  {errors?.username?.message ?? error}{' '}
                </p>
              )}
            </div>
            {loading && (
              <BarLoader className="mb-4" width="100%" color="#3b82f6" />
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Save Username
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
