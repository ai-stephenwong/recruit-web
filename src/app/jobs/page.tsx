'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import JobCard from '@/components/JobCard'
import { jobsApi } from '@/lib/api'
import type { Job } from '@/types'
import { JOB_CATEGORIES, HK_LOCATIONS, EMPLOYMENT_TYPES } from '@/types'

function JobsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const q = searchParams.get('q') || ''
  const location = searchParams.get('location') || ''
  const category = searchParams.get('category') || ''
  const employmentType = searchParams.get('type') || ''
  const salaryMin = searchParams.get('salary_min') || ''

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = { page: String(page), limit: '20' }
    if (q) params.q = q
    if (location) params.location = location
    if (category) params.category = category
    if (employmentType) params.employment_type = employmentType
    if (salaryMin) params.salary_min = salaryMin

    jobsApi.list(params)
      .then(r => { setJobs(r.jobs || []); setTotal(r.total || 0) })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }, [q, location, category, employmentType, salaryMin, page])

  function updateFilter(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    setPage(1)
    router.push(`/jobs?${p.toString()}`)
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {q ? `Jobs matching "${q}"` : category ? `${category} Jobs` : 'All Jobs in Hong Kong'}
        </h1>
        {!loading && <p className="text-gray-500 mt-1">{total.toLocaleString()} positions found</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-5">
            <h3 className="font-semibold text-gray-900">Filters</h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={e => updateFilter('category', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Categories</option>
                {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Location</label>
              <select
                value={location}
                onChange={e => updateFilter('location', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Locations</option>
                {HK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Employment Type</label>
              <div className="space-y-2">
                {EMPLOYMENT_TYPES.map(t => (
                  <label key={t.value} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={t.value}
                      checked={employmentType === t.value}
                      onChange={e => updateFilter('type', e.target.value)}
                      className="text-primary-600"
                    />
                    {t.label}
                  </label>
                ))}
                {employmentType && (
                  <button onClick={() => updateFilter('type', '')} className="text-xs text-primary-600 hover:underline">
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Min. Salary (HKD/mo)</label>
              <select
                value={salaryMin}
                onChange={e => updateFilter('salary_min', e.target.value)}
                className="input text-sm"
              >
                <option value="">Any</option>
                <option value="15000">HKD 15,000+</option>
                <option value="20000">HKD 20,000+</option>
                <option value="30000">HKD 30,000+</option>
                <option value="40000">HKD 40,000+</option>
                <option value="50000">HKD 50,000+</option>
                <option value="70000">HKD 70,000+</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Job list */}
        <div className="flex-1">
          {/* Search bar inline */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search jobs..."
              defaultValue={q}
              className="input flex-1"
              onKeyDown={e => {
                if (e.key === 'Enter') updateFilter('q', (e.target as HTMLInputElement).value)
              }}
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-medium">No jobs found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {jobs.map(job => <JobCard key={job.id} job={job} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    ← Prev
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading jobs...</div>}>
      <JobsContent />
    </Suspense>
  )
}
