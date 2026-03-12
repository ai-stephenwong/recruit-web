'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { applicationsApi } from '@/lib/api'
import { getUser } from '@/lib/auth'
import type { Application } from '@/types'

const COLUMNS: { key: Application['status']; label: string; color: string }[] = [
  { key: 'submitted', label: 'New', color: 'bg-blue-50 border-blue-200' },
  { key: 'viewed', label: 'Reviewed', color: 'bg-purple-50 border-purple-200' },
  { key: 'interview', label: 'Interview', color: 'bg-amber-50 border-amber-200' },
  { key: 'hired', label: 'Hired', color: 'bg-green-50 border-green-200' },
]

const STATUS_BADGE: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  viewed: 'bg-purple-100 text-purple-700',
  interview: 'bg-amber-100 text-amber-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function PipelinePage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    const user = getUser()
    if (!user) { router.push('/auth/login'); return }
    if (user.role !== 'employer') { router.push('/dashboard'); return }
    applicationsApi.list()
      .then(r => setApplications(r.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function moveApplication(id: number, newStatus: Application['status']) {
    setUpdating(id)
    try {
      await applicationsApi.updateStatus(id, newStatus)
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
    } catch {
      // ignore
    } finally {
      setUpdating(null)
    }
  }

  const byStatus = (status: Application['status']) => applications.filter(a => a.status === status)

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400">Loading pipeline...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Candidate Pipeline</h1>
        <p className="text-gray-500 mt-1">Manage applicants through your hiring process</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => (
          <div key={col.key} className={`rounded-xl border-2 ${col.color} p-3`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">{col.label}</h3>
              <span className="badge bg-white text-gray-600 shadow-sm">
                {byStatus(col.key).length}
              </span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {byStatus(col.key).map(app => (
                <div key={app.id} className="bg-white rounded-lg p-3 shadow-sm border border-white">
                  <p className="font-medium text-sm text-gray-900">Candidate #{app.candidate_id}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {app.job?.title || `Job #${app.job_id}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(app.applied_at).toLocaleDateString('en-HK')}
                  </p>

                  {/* Move buttons */}
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {COLUMNS.filter(c => c.key !== col.key).map(target => (
                      <button
                        key={target.key}
                        disabled={updating === app.id}
                        onClick={() => moveApplication(app.id, target.key)}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors"
                      >
                        → {target.label}
                      </button>
                    ))}
                    <button
                      disabled={updating === app.id}
                      onClick={() => moveApplication(app.id, 'rejected')}
                      className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                  {updating === app.id && (
                    <p className="text-xs text-gray-400 mt-1">Updating...</p>
                  )}
                </div>
              ))}
              {byStatus(col.key).length === 0 && (
                <div className="flex items-center justify-center h-24 text-xs text-gray-400">
                  No candidates
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rejected section */}
      {applications.filter(a => a.status === 'rejected').length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Rejected ({applications.filter(a => a.status === 'rejected').length})</h3>
          <div className="flex flex-wrap gap-2">
            {applications.filter(a => a.status === 'rejected').map(app => (
              <div key={app.id} className="bg-red-50 rounded-lg px-3 py-2 text-sm text-red-600 border border-red-100">
                Candidate #{app.candidate_id} — {app.job?.title || `Job #${app.job_id}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
