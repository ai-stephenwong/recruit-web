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
  register: (email: string, password: string, role: 'candidate' | 'employer') =>
    request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<User>('/api/auth/me'),
}

// Jobs
export const jobsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<{ jobs: Job[]; total: number; page: number; limit: number }>(`/api/jobs${qs}`)
  },
  get: (id: number) => request<Job>(`/api/jobs/${id}`),
  featured: () => request<{ jobs: Job[] }>('/api/jobs/featured'),
  create: (data: Partial<Job>) =>
    request<Job>('/api/jobs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Job>) =>
    request<Job>(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<{ message: string }>(`/api/jobs/${id}`, { method: 'DELETE' }),
  myJobs: () =>
    request<{ jobs: Job[] }>('/api/jobs?my=true'),
}

// Applications
export const applicationsApi = {
  apply: (jobId: number) =>
    request<Application>('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    }),
  list: () => request<{ applications: Application[] }>('/api/applications'),
  updateStatus: (id: number, status: Application['status']) =>
    request<Application>(`/api/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
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
  list: () => request<{ articles: Article[] }>('/api/articles'),
  get: (slug: string) => request<Article>(`/api/articles/${slug}`),
}
