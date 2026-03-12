'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { candidateApi } from '@/lib/api'
import { getUser } from '@/lib/auth'
import type { CandidateProfile } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Partial<CandidateProfile>>({})
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const user = getUser()
    if (!user) { router.push('/auth/login'); return }
    candidateApi.getProfile()
      .then(p => { setProfile(p); setSkillInput((p.skills || []).join(', ')) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    try {
      const skills = skillInput.split(',').map(s => s.trim()).filter(Boolean)
      await candidateApi.updateProfile({ ...profile, skills })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
          {saved && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">Profile saved!</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.full_name || ''}
                onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                className="input"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                className="input"
                placeholder="+852 xxxx xxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                className="input"
                placeholder="e.g. Central, HK"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input
                type="number"
                value={profile.experience_years || ''}
                onChange={e => setProfile(p => ({ ...p, experience_years: Number(e.target.value) }))}
                className="input"
                min={0}
                max={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary (HKD/mo)</label>
              <input
                type="number"
                value={profile.expected_salary || ''}
                onChange={e => setProfile(p => ({ ...p, expected_salary: Number(e.target.value) }))}
                className="input"
                placeholder="e.g. 30000"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                className="input"
                placeholder="e.g. React, TypeScript, Node.js"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea
                rows={4}
                value={profile.summary || ''}
                onChange={e => setProfile(p => ({ ...p, summary: e.target.value }))}
                className="input resize-none"
                placeholder="Brief overview of your experience and career goals"
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
