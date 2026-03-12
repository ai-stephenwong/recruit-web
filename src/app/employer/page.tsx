'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { jobsApi, applicationsApi } from '@/lib/api'
import { getUser } from '@/lib/auth'
import type { Job, Application } from '@/types'

export default function EmployerDashboard() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (!user) { router.push('/auth/login'); return }
    if (user.role !== 'employer') { router.push('/dashboard'); return }
    Promise.all([jobsApi.myJobs(), applicationsApi.list()])
      .then(([j, a]) => { setJobs(j.jobs || []); setApplications(a.applications || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activeJobs = jobs.filter(j => j.status === 'active').length
  const newApps = applications.filter(a => a.status === 'submitted').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your job postings and candidates</p>
        </div>
        <Link href="/employer/jobs/new" className="btn-primary">+ Post a Job</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Jobs', value: jobs.length, icon: '💼' },
          { label: 'Active', value: activeJobs, icon: '✅' },
          { label: 'Applications', value: applications.length, icon: '📋' },
          { label: 'New', value: newApps, icon: '🔔' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Jobs table */}
      <div className="card mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">My Job Listings</h2>
          <Link href="/employer/jobs/new" className="text-sm text-primary-600 hover:underline">+ New Job</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500 mb-4">No jobs posted yet</p>
            <Link href="/employer/jobs/new" className="btn-primary">Post Your First Job</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 font-medium text-gray-500">Job Title</th>
                  <th className="px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Location</th>
                  <th className="px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Posted</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-5 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-500">{job.category}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{job.location}</td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                      {new Date(job.created_at).toLocaleDateString('en-HK')}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge capitalize ${
                        job.status === 'active' ? 'bg-green-100 text-green-700' :
                        job.status === 'closed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => jobsApi.delete(job.id).then(() => setJobs(prev => prev.filter(j => j.id !== job.id)))}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent applications */}
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Applications</h2>
          <Link href="/employer/pipeline" className="text-sm text-primary-600 hover:underline">View Pipeline →</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No applications yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.slice(0, 5).map(app => (
              <div key={app.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Candidate #{app.candidate_id}</p>
                  <p className="text-xs text-gray-500">Applied for {app.job?.title || `Job #${app.job_id}`}</p>
                </div>
                <span className={`badge capitalize text-xs ${
                  app.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                  app.status === 'interview' ? 'bg-amber-100 text-amber-700' :
                  app.status === 'hired' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
