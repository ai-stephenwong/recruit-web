'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { jobsApi } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { JOB_CATEGORIES, HK_LOCATIONS, type Job } from '@/types'

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '',
    salary_min: '', salary_max: '', employment_type: 'full-time', featured: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const user = getUser()
    if (!user) { router.push('/auth/login'); return }
    setSaving(true); setError('')
    try {
      await jobsApi.create({
        ...form,
        employment_type: form.employment_type as Job['employment_type'],
        salary_min: form.salary_min ? Number(form.salary_min) : undefined,
        salary_max: form.salary_max ? Number(form.salary_max) : undefined,
        status: 'active',
      })
      router.push('/employer')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to post job')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/employer" className="text-sm text-primary-600 hover:underline">← Dashboard</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Post a New Job</h1>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
              className="input"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                required
                className="input"
              >
                <option value="">Select category</option>
                {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <select
                value={form.location}
                onChange={e => set('location', e.target.value)}
                required
                className="input"
              >
                <option value="">Select location</option>
                {HK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (HKD/mo)</label>
              <input
                type="number"
                value={form.salary_min}
                onChange={e => set('salary_min', e.target.value)}
                className="input"
                placeholder="e.g. 30000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (HKD/mo)</label>
              <input
                type="number"
                value={form.salary_max}
                onChange={e => set('salary_max', e.target.value)}
                className="input"
                placeholder="e.g. 50000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'freelance', label: 'Freelance' },
              ].map(t => (
                <label key={t.value} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm transition-all ${
                  form.employment_type === t.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="employment_type"
                    value={t.value}
                    checked={form.employment_type === t.value}
                    onChange={() => set('employment_type', t.value)}
                    className="sr-only"
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
            <textarea
              rows={8}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              required
              className="input resize-none"
              placeholder="Describe the role, responsibilities, requirements, and benefits..."
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => set('featured', e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Feature this job</p>
              <p className="text-xs text-gray-500">Featured jobs appear at the top of search results</p>
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <Link href="/employer" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Publishing...' : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
