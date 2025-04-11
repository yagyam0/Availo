import React, { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getUserMeetings } from '@/actions/meetings'
import MeetingList from './_components/MeetingList'
import { Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Your Meetings | Scheduler',
  description: 'View and manage your upcoming and past meetings.',
}

const MeetingsPage = () => {
  return (
    <section className="py-10">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-blue-50 border border-blue-200 rounded-xl p-1 gap-2 shadow-sm">
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-1 text-sm sm:text-base transition-all"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-1 text-sm sm:text-base transition-all"
          >
            Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <Suspense
            fallback={
              <div className="text-blue-600 flex items-center gap-2 text-sm">
                <Loader2 className="animate-spin w-`10 h-10" />
                Loading upcoming meetings...
              </div>
            }
          >
            <UpcomingMeetings />
          </Suspense>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <Suspense
            fallback={
              <div className="text-blue-600 flex items-center gap-2 text-sm">
                <Loader2 className="animate-spin w-10 h-10" />
                Loading past meetings...
              </div>
            }
          >
            <PastMeetings />
          </Suspense>
        </TabsContent>
      </Tabs>
    </section>
  )
}

async function UpcomingMeetings() {
  const meetings = await getUserMeetings('upcoming')
  return <MeetingList meetings={meetings} type={'upcoming'} />
}

async function PastMeetings() {
  const meetings = await getUserMeetings('past')
  return <MeetingList meetings={meetings} type={'past'} />
}

export default MeetingsPage
