/* eslint-disable react/prop-types */
'use client'
import { cancelMeeting } from '@/actions/meetings'
import { AlertUserDialog } from '@/components/AlertUserDialog'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/useFetch'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const CancelMeeting = ({ meetingId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { loading, data, error, makeCall } = useFetch(cancelMeeting)
  const router = useRouter()

  const handleShowAlert = () => {
      setIsOpen(!isOpen);
  }

  const handleCancel = async () => {
    console.log('🚀 ~ handleCancel ~ meetingId:', meetingId)
    await makeCall(meetingId)
    if (data?.success) toast.success('Meeting cancelled successfully.')
    else toast.error('Failed to cancel meeting.')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="destructive"
        disabled={loading}
        className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
        onClick={handleShowAlert}
      >
        {loading ? 'Canceling...' : 'Cancel Meeting'}
      </Button>
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
      <AlertUserDialog
        action={handleCancel}
        isOpen={isOpen}
        loading={loading}
        description={
          'This action cannot be undone. This will permanently delete this event from our servers.'
        }
        handleClose={handleShowAlert}
      />
    </div>
  )
}

export default CancelMeeting
