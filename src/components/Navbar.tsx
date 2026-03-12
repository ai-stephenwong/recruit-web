'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUser, clearAuth } from '@/lib/auth'
import type { User } from '@/types'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setUser(getUser())
  }, [pathname])

  function handleLogout() {
    clearAuth()
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-primary-800 text-lg">Recruit.com.hk</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-sm text-gray-600 hover:text-primary-700 font-medium">
              Find Jobs
            </Link>
            <Link href="/careers" className="text-sm text-gray-600 hover:text-primary-700 font-medium">
              Career Advice
            </Link>
            {user?.role === 'employer' && (
              <>
                <Link href="/employer" className="text-sm text-gray-600 hover:text-primary-700 font-medium">
                  My Jobs
                </Link>
                <Link href="/employer/pipeline" className="text-sm text-gray-600 hover:text-primary-700 font-medium">
                  Pipeline
                </Link>
                <Link href="/employer/jobs/new" className="btn-primary">
                  Post a Job
                </Link>
              </>
            )}
            {user?.role === 'candidate' && (
              <>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary-700 font-medium">
                  Dashboard
                </Link>
                <Link href="/dashboard/alerts" className="text-sm text-gray-600 hover:text-primary-700 font-medium">
                  Alerts
                </Link>
                <Link href="/dashboard/profile" className="text-sm text-gray-600 hover:text-primary-700 font-medium">
                  Profile
                </Link>
              </>
            )}
            {user ? (
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          <Link href="/jobs" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Find Jobs</Link>
          <Link href="/careers" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Career Advice</Link>
          {user?.role === 'candidate' && (
            <>
              <Link href="/dashboard" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/dashboard/alerts" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Alerts</Link>
              <Link href="/dashboard/profile" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Profile</Link>
            </>
          )}
          {user?.role === 'employer' && (
            <>
              <Link href="/employer" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>My Jobs</Link>
              <Link href="/employer/pipeline" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Pipeline</Link>
              <Link href="/employer/jobs/new" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Post a Job</Link>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} className="block w-full text-left py-2 text-sm text-red-600">Logout</button>
          ) : (
            <>
              <Link href="/auth/login" className="block py-2 text-sm text-primary-700" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/auth/register" className="block py-2 text-sm text-primary-700 font-medium" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
