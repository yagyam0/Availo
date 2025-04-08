/* eslint-disable react/prop-types */
'use client'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Calendar, BarChart, Users, Clock } from 'lucide-react'
import { BarLoader } from 'react-spinners'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { id: 1, href: '/dashboard', label: 'Dashboard', icon: BarChart },
  { id: 2, href: '/events', label: 'Events', icon: Calendar },
  { id: 3, href: '/meetings', label: 'Meetings', icon: Users },
  { id: 4, href: '/availability', label: 'Availability', icon: Clock },
]

const AppLayout = ({ children }) => {
  const { isLoaded } = useUser()
  const pathname = usePathname()

  const getHeaderName = (pathname) =>
    navItems.find(({ href }) => href === pathname)?.label || ''

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-xl h-screen p-6 fixed top-0 left-0 z-30 border-r border-gray-200">
        <div className="text-2xl font-bold text-blue-600 mb-8 tracking-tight">
          <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-xl">
            Calendly
          </span>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ id, href, label, icon: Icon }) => (
            <Link
              key={id}
              href={href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                pathname === href
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-6 pb-20 md:pb-6 relative overflow-x-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 z-50 border-4 ">
            <BarLoader width="100%" color="#3b82f6" />
          </div>
        )}

        <header className="mb-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-semibold gradient-title tracking-tight text-center md:text-left">
            {getHeaderName(pathname)}
          </h2>
        </header>

        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg backdrop-blur-md border-t border-gray-200 flex justify-around items-center py-3 md:hidden z-50">
        {navItems.map(({ id, href, icon: Icon, label }) => (
          <Link
            key={id}
            href={href}
            className={`flex flex-col items-center text-xs font-medium ${
              pathname === href
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default AppLayout
