'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { jobsApi, applicationsApi } from '@/lib/api'
import { getUser } from '@/lib/auth'
import type { Job } from '@/types'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')
  const user = getUser()

  useEffect(() => {
    jobsApi.get(Number(id))
      .then(setJob)
      .catch(() => {})
      .finally(() => setLoading(false))
    if (user?.role === 'candidate') {
      applicationsApi.list()
        .then(r => { if (r.applications.some((a: any) => a.job_id === Number(id))) setApplied(true) })
        .catch(() => {})
    }
  }, [id])

  async function handleApply() {
    if (!user) { router.push('/auth/login'); return }
    if (user.role !== 'candidate') { setError('Only candidates can apply for jobs.'); return }
    setApplying(true)
    setError('')
    try {
      await applicationsApi.apply(Number(id))
      setApplied(true)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to apply'
      setError(msg.toLowerCase().includes('already') ? 'You have already applied to this job.' : msg)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-40 bg-gray-100 rounded" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        <p className="text-xl font-semibold">Job not found</p>
        <Link href="/jobs" className="mt-4 btn-primary inline-block">Browse all jobs</Link>
      </div>
    )
  }

  const salaryLabel = job.salary_min && job.salary_max
    ? `HKD ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()} / month`
    : 'Salary negotiable'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/jobs" className="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-6">
        ← Back to jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-700 font-bold text-lg">
                  {(job.company_name || 'Co').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                  {job.featured && (
                    <span className="badge bg-amber-100 text-amber-700 flex-shrink-0">Featured</span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{job.company_name}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {salaryLabel}
                  </span>
                  <span className="badge bg-blue-50 text-blue-700 capitalize">
                    {job.employment_type.replace('-', ' ')}
                  </span>
                  <span className="badge bg-gray-100 text-gray-600">{job.category}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-sm text-gray-600 mb-4">
              Posted {new Date(job.created_at).toLocaleDateString('en-HK', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>

            {applied ? (
              <div className="bg-green-50 text-green-700 rounded-lg p-3 text-sm font-medium text-center">
                ✓ Application submitted!
              </div>
            ) : (
              <>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn-primary w-full py-3 text-base"
                >
                  {applying ? 'Submitting...' : 'Apply Now'}
                </button>
                {!user && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    <Link href="/auth/login" className="text-primary-600 hover:underline">Login</Link> to apply
                  </p>
                )}
              </>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">Job Overview</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Category</dt>
                <dd className="font-medium text-gray-700">{job.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Location</dt>
                <dd className="font-medium text-gray-700">{job.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Job Type</dt>
                <dd className="font-medium text-gray-700 capitalize">{job.employment_type.replace('-', ' ')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Salary</dt>
                <dd className="font-medium text-gray-700">
                  {job.salary_min ? `HKD ${(job.salary_min / 1000).toFixed(0)}K+` : 'Negotiable'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
