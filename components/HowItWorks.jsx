import { howItWorks } from '@/constants/siteConstants'
import React from 'react'

const HowItWorks = () => {
  return (
    <div className="w-full lg:px-20 bg-gray-50 text-center py-16 px-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-10">
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {howItWorks.map(({ id, step, description }) => (
          <div
            key={id}
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 flex items-center justify-center main-bg text-white rounded-full text-3xl font-bold mb-4 shadow-lg">
              {id}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{step}</h3>
            <p className="text-gray-600 text-base max-w-xs">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowItWorks
