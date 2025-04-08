'use client'
import React, { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from './ui/button'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import EventForm from './EventForm'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const CreateEventDrawer = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const searchParams = useSearchParams()
  const isCreateParamActive = searchParams.get('create')
  const pathname = usePathname()
  const router = useRouter()

  const isOpen = useMemo(() => Boolean(isCreateParamActive), [searchParams])

  const handleClose = () => router.push(pathname)

  // ✨ Dialog for Desktop
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg rounded-xl border border-blue-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-blue-600 text-2xl font-semibold">
              Create New Event
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Share your event link and schedule with ease 🚀
            </DialogDescription>
          </DialogHeader>
          <EventForm className="pt-4" onSubmitForm={handleClose} />
        </DialogContent>
      </Dialog>
    )
  }

  // 📱 Drawer for Mobile
  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="rounded-t-xl border-t border-blue-100 shadow-xl">
        <DrawerHeader>
          <DrawerTitle className="text-blue-600 text-xl font-semibold">
            Create New Event
          </DrawerTitle>
        </DrawerHeader>

        <EventForm className="px-4 pt-2" onSubmitForm={handleClose} />

        <DrawerFooter className="border-t pt-4 flex justify-end gap-2 px-4 pb-6">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateEventDrawer
