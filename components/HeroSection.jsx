'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <div className="w-full mx-auto flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-16">
      {/* Text Section */}
      <div className="lg:w-1/2 text-center lg:text-left">
        <h1 className="text-5xl md:text-7xl font-extrabold pb-4 gradient-title text-transparent bg-clip-text leading-tight">
          Effortless Scheduling, Seamless Connections
        </h1>
        <p className="text-lg text-center sm:text-left md:text-xl text-gray-600 font-medium mb-6">
          Take control of your time with automated scheduling. Set your
          availability, share your link, and let others book meetings without
          the back-and-forth emails.
        </p>
        <div className="flex justify-center lg:justify-start">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-6 py-3 text-lg bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition"
            >
              Get Started <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
        <Image
          src="/poster.png"
          alt="Scheduling illustration"
          width={600} 
          height={600} 
          priority
          className="drop-shadow-lg rounded-lg max-w-lg md:max-w-xl lg:max-w-full h-auto"
        />
      </div>
    </div>
  )
}

export default HeroSection
