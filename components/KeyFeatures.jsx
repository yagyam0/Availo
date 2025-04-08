// KeyFeatures.jsx
import React from 'react'
import { Calendar, Clock, LinkIcon } from 'lucide-react'
import { features } from '@/constants/siteConstants'

const KeyFeatures = () => {
  const iconMap = {
    calendar: <Calendar />,
    clock: <Clock />,
    link: <LinkIcon />,
  }

  return (
    <section className="w-full px-6 lg:px-20 py-12 bg-gray-50">
      <div className="mx-auto text-center">
        <h4 className="text-3xl font-bold text-blue-600 mb-10">
          Key Features
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const { id, icon, title, description } = feature
            return (
              <div
                key={id}
                className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-3xl mb-4">
                  {iconMap[icon]} 
                </div>
                <h5 className="text-xl font-semibold text-gray-900">{title}</h5>
                <p className="text-gray-600 mt-2 text-center">{description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default KeyFeatures
