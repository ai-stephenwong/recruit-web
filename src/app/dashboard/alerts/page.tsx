'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { alertsApi } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { JOB_CATEGORIES, HK_LOCATIONS } from '@/types'
import type { JobAlert } from '@/types'

export default function AlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ keywords: '', category: '', location: '', employment_type: '', salary_min: '' })

  useEffect(() => {
    const user = getUser()
    if (!user) { router.push('/auth/login'); return }
    alertsApi.list().then(setAlerts).catch(() => {}).finally(() => setLoading(false))
  }, [router])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const data: any = {}
    if (form.keywords) data.keywords = form.keywords
    if (form.category) data.category = form.category
    if (form.location) data.location = form.location
    if (form.employment_type) data.employment_type = form.employment_type
    if (form.salary_min) data.salary_min = Number(form.salary_min)
    try {
      const r = await alertsApi.create(data)
      setAlerts(prev => [r.data, ...prev])
      setShowForm(false)
      setForm({ keywords: '', category: '', location: '', employment_type: '', salary_min: '' })
    } catch {}
  }

  async function handleDelete(id: number) {
    await alertsApi.delete(id)
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Alerts</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + New Alert
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-5 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Create Alert</h2>
          <input type="text" placeholder="Keywords (e.g. Software Engineer)" value={form.keywords}
            onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} className="input" />
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">
            <option value="">All Categories</option>
            {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input">
            <option value="">All Locations</option>
            {HK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={form.salary_min} onChange={e => setForm(f => ({ ...f, salary_min: e.target.value }))} className="input">
            <option value="">Any Salary</option>
            <option value="15000">HKD 15,000+</option>
            <option value="20000">HKD 20,000+</option>
            <option value="30000">HKD 30,000+</option>
            <option value="40000">HKD 40,000+</option>
          </select>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">Save Alert</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="font-medium">No job alerts yet</p>
          <p className="text-sm mt-1">Create an alert to get notified of matching jobs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="card p-4 flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">{alert.keywords || 'All Jobs'}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {[alert.category, alert.location, alert.employment_type].filter(Boolean).join(' · ') || 'No filters'}
                  {alert.salary_min ? ` · HKD ${Number(alert.salary_min).toLocaleString()}+` : ''}
                </p>
              </div>
              <button onClick={() => handleDelete(alert.id)}
                className="text-red-400 hover:text-red-600 text-sm">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
