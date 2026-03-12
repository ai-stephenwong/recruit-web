'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { applicationsApi, savedJobsApi } from '@/lib/api'
import { getUser } from '@/lib/auth'
import type { Application, Job } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  viewed: 'bg-purple-100 text-purple-700',
  interview: 'bg-amber-100 text-amber-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

type Tab = 'applications' | 'saved'

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('applications')
  const router = useRouter()
  const user = getUser()

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    if (user.role !== 'candidate') { router.push('/employer'); return }
    Promise.all([
      applicationsApi.list().then(r => setApplications(r.applications || [])),
      savedJobsApi.list().then(jobs => setSavedJobs(jobs || [])).catch(() => {}),
    ])
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusCounts = {
    submitted: applications.filter(a => a.status === 'submitted').length,
    viewed: applications.filter(a => a.status === 'viewed').length,
    interview: applications.filter(a => a.status === 'interview').length,
    hired: applications.filter(a => a.status === 'hired').length,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your job applications</p>
        </div>
        <Link href="/jobs" className="btn-primary">Find More Jobs</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Applied', value: applications.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Viewed', value: statusCounts.viewed, color: 'bg-purple-50 text-purple-700' },
          { label: 'Interviews', value: statusCounts.interview, color: 'bg-amber-50 text-amber-700' },
          { label: 'Offers', value: statusCounts.hired, color: 'bg-green-50 text-green-700' },
        ].map(stat => (
          <div key={stat.label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'applications' ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          My Applications
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'saved' ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Saved Jobs
          {savedJobs.length > 0 && (
            <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">{savedJobs.length}</span>
          )}
        </button>
        <Link
          href="/dashboard/alerts"
          className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors"
        >
          Job Alerts
        </Link>
      </div>

      {/* Applications list */}
      {activeTab === 'applications' && (
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">My Applications</h2>
            <span className="text-sm text-gray-500">{applications.length} total</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">No applications yet</p>
              <Link href="/jobs" className="btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {applications.map(app => (
                <div key={app.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${app.job_id}`} className="font-medium text-gray-900 hover:text-primary-700 truncate block">
                      {app.job?.title || `Job #${app.job_id}`}
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {app.job?.company_name} · {app.job?.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Applied {new Date(app.applied_at).toLocaleDateString('en-HK')}
                    </p>
                  </div>
                  <span className={`badge flex-shrink-0 capitalize ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-600'}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Jobs list */}
      {activeTab === 'saved' && (
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Saved Jobs</h2>
            <span className="text-sm text-gray-500">{savedJobs.length} saved</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : savedJobs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">No saved jobs yet</p>
              <Link href="/jobs" className="btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {savedJobs.map(job => (
                <div key={job.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${job.id}`} className="font-medium text-gray-900 hover:text-primary-700 truncate block">
                      {job.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {job.company_name} · {job.location}
                    </p>
                  </div>
                  <span className="badge bg-blue-50 text-blue-700 flex-shrink-0 capitalize">{job.employment_type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
