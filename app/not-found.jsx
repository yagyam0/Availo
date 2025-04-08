/* eslint-disable react/react-in-jsx-scope */
'use client'
import Link from 'next/link'
import { Ghost } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-gray-100 text-gray-800 px-4 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
        <Ghost className="w-10 h-10 text-blue-600" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-2">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <Link
        href="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium shadow hover:bg-blue-700 transition"
      >
        Go back to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
