'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import React, { useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/app/_lib/validators'
import useFetch from '@/hooks/useFetch'
import { updateUsername } from '@/actions/users'
import { BarLoader } from 'react-spinners'

const Dashboard = () => {
  const { isLoaded, user } = useUser()
  const [webUrl, setWebUrl] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(userSchema),
  })

  useLayoutEffect(() => {
    setWebUrl(window.location.origin);
    if (isLoaded) setValue('username', user?.username, { shouldValidate: true })
  }, [isLoaded])

  const { loading, error, makeCall } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    makeCall(data.username);
  }

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            👋 Welcome back, {user?.firstName}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-600">
            Here’s a quick overview of your dashboard.
          </p>
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
                  maxLength='20'
                />
              </div>
              {(error || errors.username) && (
                <p className="text-red-600 text-sm"> {errors?.username?.message ?? error} </p>
              )}
            </div>
            {loading && <BarLoader className='mb-4' width="100%" color="#3b82f6" />}
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              Save Username
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
