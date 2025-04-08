import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logoImg from '../public/logo.png'
import { Button } from './ui/button'
import { PenBox } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import UserMenu from './UserMenu'
import { checkUser } from '@/lib/checkUser'

export default async function Header() {

  await checkUser();

  return (
    <nav className="flex justify-between items-center mx-auto py-3 px-6 shadow-md border-b bg-white sticky top-0 z-50">
      {/* Logo Section */}
      <Link
        className="flex items-center gap-3 hover:opacity-80 transition"
        href="/"
      >
        <Image
          src={logoImg}
          alt="Calendly Logo"
          width={150}
          height={60}
          className="h-12 w-auto"
        />
        <span className="text-2xl font-semibold gradient-title">Calendly</span>
      </Link>

      {/* Navigation Actions */}
      <div className="flex items-center gap-4">
        <Link href="/events?create=true">
          <Button className="flex items-center gap-2 main-bg text-white px-5 py-2 rounded-lg transition">
            <PenBox size="18" /> Create Event
          </Button>
        </Link>

        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Login
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  )
}
