import type { Job, Application, CandidateProfile, EmployerProfile, User, Article } from '@/types'
import { getToken } from './auth'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Request failed')
  return json
}

// Auth
export const authApi = {
  register: async (email: string, password: string, role: 'candidate' | 'employer') => {
    const r = await request<{ access_token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    })
    return { token: r.access_token, user: r.user }
  },
  login: async (email: string, password: string) => {
    const r = await request<{ access_token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return { token: r.access_token, user: r.user }
  },
  me: () => request<{ user: User }>('/api/auth/me').then(r => r.user),
}

// Jobs
export const jobsApi = {
  list: async (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    const r = await request<{ data: Job[]; pagination: { total: number; page: number; limit: number } }>(`/api/jobs${qs}`)
    return { jobs: r.data, total: r.pagination.total, page: r.pagination.page, limit: r.pagination.limit }
  },
  get: (id: number) => request<{ data: Job }>(`/api/jobs/${id}`).then(r => r.data),
  featured: async () => {
    const r = await request<{ data: Job[] }>('/api/jobs/featured')
    return { jobs: r.data }
  },
  create: (data: Partial<Job>) =>
    request<{ data: Job }>('/api/jobs', { method: 'POST', body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: Partial<Job>) =>
    request<{ data: Job }>(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) =>
    request<{ message: string }>(`/api/jobs/${id}`, { method: 'DELETE' }),
  myJobs: async () => {
    const r = await request<{ data: Job[]; pagination: { total: number } }>('/api/jobs?my=true')
    return { jobs: r.data }
  },
}

// Applications
export const applicationsApi = {
  apply: (jobId: number) =>
    request<{ data: Application }>('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    }).then(r => r.data),
  list: async () => {
    const r = await request<{ data: Application[]; pagination: { total: number } }>('/api/applications')
    return { applications: r.data }
  },
  updateStatus: (id: number, status: Application['status']) =>
    request<{ data: Application }>(`/api/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }).then(r => r.data),
}

// Candidate
export const candidateApi = {
  getProfile: () => request<CandidateProfile>('/api/candidates/profile'),
  updateProfile: (data: Partial<CandidateProfile>) =>
    request<CandidateProfile>('/api/candidates/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

// Employer
export const employerApi = {
  getProfile: () => request<EmployerProfile>('/api/employers/profile'),
  updateProfile: (data: Partial<EmployerProfile>) =>
    request<EmployerProfile>('/api/employers/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

// Articles
export const articlesApi = {
  list: async () => {
    const r = await request<{ data: Article[]; pagination: { total: number } }>('/api/articles')
    return { articles: r.data }
  },
  get: (slug: string) => request<{ data: Article }>(`/api/articles/${slug}`).then(r => r.data),
}
