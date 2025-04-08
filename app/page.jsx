import HeroSection from '@/components/HeroSection'
import HowItWorks from '@/components/HowItWorks'
import KeyFeatures from '@/components/KeyFeatures'
import Testimonials from '@/components/Testimonials'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <section className="w-full px-6 py-20 bg-gray-50">
      <HeroSection />
      <KeyFeatures />
      <Testimonials />
      <HowItWorks />

      {/* Start Section */}
     <div className="bg-gradient-to-r from-blue-500 mx-5 to-purple-600 text-white rounded-2xl p-10 text-center shadow-lg">
      <h2 className="text-4xl font-bold mb-4">
        Ready to Simplify Your Scheduling?
      </h2>
      <p className="text-lg text-gray-200 mb-6 max-w-lg mx-auto">
        Join thousands of professionals who trust Calendly for effortless
        scheduling and time management.
      </p>
      <Link href="/dashboard">
        <Button
          size="lg"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          Start for Free
        </Button>
      </Link>
    </div>
    </section>
  )
}
