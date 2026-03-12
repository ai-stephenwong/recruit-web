'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JOB_CATEGORIES, HK_LOCATIONS } from '@/types'

interface SearchBarProps {
  defaultKeyword?: string
  defaultLocation?: string
  defaultCategory?: string
  className?: string
}

export default function SearchBar({ defaultKeyword = '', defaultLocation = '', defaultCategory = '', className = '' }: SearchBarProps) {
  const [keyword, setKeyword] = useState(defaultKeyword)
  const [location, setLocation] = useState(defaultLocation)
  const [category, setCategory] = useState(defaultCategory)
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('q', keyword)
    if (location) params.set('location', location)
    if (category) params.set('category', category)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className={`bg-white rounded-2xl shadow-lg p-2 ${className}`}>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 px-3">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Job title, keywords, company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <div className="h-px md:h-auto md:w-px bg-gray-200 mx-1" />
        <div className="flex items-center gap-2 px-3">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="py-2.5 text-sm focus:outline-none bg-transparent"
          >
            <option value="">All Locations</option>
            {HK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="h-px md:h-auto md:w-px bg-gray-200 mx-1" />
        <div className="flex items-center gap-2 px-3">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-2.5 text-sm focus:outline-none bg-transparent"
          >
            <option value="">All Categories</option>
            {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary rounded-xl px-6 py-3">
          Search
        </button>
      </div>
    </form>
  )
}
