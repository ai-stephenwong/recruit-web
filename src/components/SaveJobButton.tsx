'use client'
import { useState, useEffect } from 'react'
import { savedJobsApi } from '@/lib/api'
import { getToken } from '@/lib/auth'

export default function SaveJobButton({ jobId, className = '' }: { jobId: number; className?: string }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!getToken()) return
    savedJobsApi.getIds().then(ids => setSaved(ids.includes(jobId))).catch(() => {})
  }, [jobId])

  async function toggle() {
    if (!getToken()) { window.location.href = '/auth/login'; return }
    setLoading(true)
    try {
      if (saved) {
        await savedJobsApi.unsave(jobId)
        setSaved(false)
      } else {
        await savedJobsApi.save(jobId)
        setSaved(true)
      }
    } catch {}
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? 'Unsave job' : 'Save job'}
      className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'} ${className}`}
    >
      <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  )
}
