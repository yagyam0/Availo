/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */

import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { ClerkProvider } from '@clerk/nextjs'
import CreateEventDrawer from '@/components/CreateEventDrawer'

export const metadata = {
  title: 'Availo',
  description: 'Event Scheduling app',
  icons: {
    icon: '/favicon.ico',
  },
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* header */}
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-blue-200 to-white">
            {children}
          </main>
          {/* footer */}
          <footer className="bg-blue-100 py-12">
            <div className="container capitalize mx-auto px-4 text-center text-md text-gray-600">
              <p>Made with 💖 by cloud.com</p>
            </div>
          </footer>
          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  )
}
